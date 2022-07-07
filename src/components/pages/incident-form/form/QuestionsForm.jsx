import React, { useContext, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// Imports for Redux
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// Imports of the Redux user state selectors
import * as userSelectors from '../../../../redux/user/user-selectors';

// Context
import { incidentFormContext } from '../../../../contexts/incidentFormContext';

// The API instance for making HTTP Requests
import API from '../../../../utils/apiUtils';

import GetQuestionJSX from '../incident-question/GetQuestionJSX';
import * as inputValidators from '../../../../validators/inputValidator';

function QuestionsForm(props) {
   //      ----- Props from parent --------   ---- Props from redux ---
   const { questions, incidentRecordHeaderID, currentUser, userToken } = props;

   const [searchParams] = useSearchParams();
   const navigate = useNavigate();
   const formRef = useRef();

   const {
      answers,
      currentIncident,
      setValidationErrors,
      clearFieldError,
      pushFieldError,
   } = useContext(incidentFormContext);

   const uncheckRadioFields = function () {
      const checkedFields = formRef.current?.querySelectorAll('input:checked'); // Get all checked fields
      checkedFields?.forEach(radio => (radio.checked = false)); // Uncheck them
   };

   useEffect(() => {
      // Because I noticed that if an 'Other' field is selected in one form, upon fetch new questions, the 'Other' fields in the new form get selected by default.
      uncheckRadioFields();
      setValidationErrors({});
   }, [currentIncident]); // New questions are fetched when currentIncident changes

   const getHiddenFields = () => {
      return questions.filter((que, i) => {
         const previousQue = questions[i - 1];
         const answerToPreviousQue = answers[previousQue?.questionOrder];

         if (
            previousQue?.openExtFieldIf &&
            previousQue.openExtFieldIf != 'Other' &&
            answerToPreviousQue != previousQue.openExtFieldIf
         )
            return true;
      });
   };

   const fieldValidators = {
      // isRequired, minLength must match function names in src/validators/inputValidators.js
      // The sub-field array elements will be passed as args to the matching function
      text: { isRequired: [] },
      radio: { isRequired: [] },
      calendar: { isRequired: [], isValidDate: [] },
      file: { minLength: [1, 'No images uploaded'] },
   };

   const validateFields = function () {
      let errorExists = false;

      const runValidators = que => {
         const fieldValidator = fieldValidators[que.responseFieldType];

         for (const [validatorName, params] of Object.entries(fieldValidator)) {
            const obj = { userInput: answers[que.questionOrder] };
            // Execute the matching function
            const feedback = inputValidators[validatorName]?.call(
               obj,
               ...params
            );
            if (feedback.status !== inputValidators.statusTypes.failed)
               continue;
            errorExists = true;
            pushFieldError(que.questionOrder, feedback);
            return;
         }
      };

      for (const que of questions) {
         const isHiddenField = field =>
            field.questionOrder == que.questionOrder;

         if (getHiddenFields().find(isHiddenField)) {
            clearFieldError(que.questionOrder);
            // alert(que.questionOrder);
            continue;
         }
         runValidators(que);
      }
      return { errorExists };
   };

   const scrollToFirstError = () => {
      let firstError =
         document.querySelector('.invalid-tooltip') ||
         document.querySelector('.app-error');

      firstError?.parentElement?.scrollIntoView({ behavior: 'smooth' });
   };

   const handleSubmitForm = async ev => {
      ev.preventDefault();
      setValidationErrors({}); // Clear all validation errors first

      const { errorExists } = validateFields();
      if (errorExists) return scrollToFirstError();

      const incidentID = +searchParams.get('incidentid'); // Get incidentID from window url
      if (!incidentID || isNaN(incidentID)) return;

      const body = {
         incidentID,
         RecordResponse: answers,
         incidentRecordHeaderID,
         createdBy: currentUser.userId,
      };

      try {
         const res = await API.submitIncidentQuestions(body, userToken);
         navigate('/success', { replace: true, state: { success: true } });
         console.log(res);
      } catch (err) {
         console.log(err);
      }
   };

   return (
      <form
         className="incidentSelectOption__forms"
         onSubmit={handleSubmitForm}
         ref={formRef}
      >
         <div className="row">
            <div className="col">
               {questions?.length ? <h2>FNOL Info</h2> : null}
               {questions?.map((que, i) => (
                  <GetQuestionJSX
                     key={i}
                     que={que}
                     i={i}
                     questions={questions}
                  />
               ))}
            </div>
         </div>

         {questions?.length ? (
            <button className="btn btn-primary" type="submit">
               Send
            </button>
         ) : null}
      </form>
   );
}

// Map Redux state to props for this component
const mapStateToProps = createStructuredSelector({
   currentUser: userSelectors.selectCurrentUser,
   userToken: userSelectors.selectUserToken,
});

export default connect(mapStateToProps)(QuestionsForm);
