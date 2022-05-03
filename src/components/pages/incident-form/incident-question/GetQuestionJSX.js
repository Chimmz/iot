import React, { useState, useContext, useEffect, Fragment } from 'react';

import { incidentFormContext } from '../../../../contexts/incidentFormContext';

import IncidentQuestion from './IncidentQuestion';
import GetResponseField from './GetResponseField';

const GetQuestionJSX = ({ que: currentQue, i: currIndex, questions }) => {
   const { answers, answerQuestion, validationErrors, clearFieldError } =
      useContext(incidentFormContext);

   const previousQue = questions[currIndex - 1];
   const answerToPrevQue = answers[previousQue?.questionOrder];

   const doesFieldDependOnPreviousInput = () =>
      previousQue?.openExtFieldIf && previousQue.openExtFieldIf !== 'Other';

   const [showField, setShowField] = useState(
      !doesFieldDependOnPreviousInput()
   );

   // Is triggered when new questions are fetched
   useEffect(() => {
      setShowField(!doesFieldDependOnPreviousInput());
   }, [questions?.length]);

   // This useffect runs for each current question but it will watch for changes in answer to previous question
   useEffect(() => {
      // The first element (currIndex = 0) will not have a previous question.
      if (!previousQue?.openExtFieldIf) return;
      if (previousQue.openExtFieldIf === 'Other') return;

      if (answerToPrevQue === previousQue.openExtFieldIf)
         return setShowField(true);

      // ------------- ELSE ------------
      answerQuestion(currentQue.questionOrder, []);
      clearFieldError(currentQue.questionOrder);
      return setShowField(false);
   }, [answerToPrevQue]); // Watch for changes in user's answer to previous question

   useEffect(() => {
      clearFieldError(currentQue.questionOrder);
   }, [answers[currentQue.questionOrder]]); // Watch for changes in this question's response

   return !showField ? (
      <Fragment key={currentQue.questionOrder}></Fragment>
   ) : (
      <IncidentQuestion
         key={currentQue.questionOrder}
         className="mb-3"
         que={currentQue}
         validationErrors={validationErrors[currentQue.questionOrder]}
         responseField={
            <GetResponseField
               que={currentQue}
               validationErrors={validationErrors[currentQue.questionOrder]}
               className="mb-4 mb-lg-4"
            />
         }
      ></IncidentQuestion>
   );
};

export default GetQuestionJSX;
