import React, { useState, useEffect, useContext, useCallback } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
// Redux standard imports
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// Redux user state selectors
import * as userSelectors from '../../../redux/user/user-selectors';

// The API instance for making HTTP requests
import API from '../../../utils/apiUtils';
import * as userUtils from '../../../redux/user/user-utils';
// The data in this context is for this compon. and it's descendants
import { incidentFormContext } from '../../../contexts/incidentFormContext';
// The actual form
import QuestionsForm from './form/QuestionsForm';
// React-bootstrap
import Form from 'react-bootstrap/Form';
import './IncidentFormPage.scss';
import useFetch from '../../../hooks/useFetch';
import Spinner from '../../UI/spinner/Spinner';

const FORM_FILLED_BEFORE_MSG = 'This form has been filled before';

function IncidentFormPage({ currentUser, userToken }) {
   const [searchParams] = useSearchParams();
   const incidentId = +searchParams.get('incidentid');

   const [formFilledBefore, setFormFilledBefore] = useState(false);
   const [formCannotBeFilled, setFormCannotBeFilled] = useState({ why: '' });
   const {
      sendRequest: sendGetRecordResponse,
      loading: getRecordResponseRequestLoading,
   } = useFetch();
   const {
      sendRequest: sendIncidentStatusRequest,
      loading: incidentStatusRequestsLoading,
   } = useFetch();
   const {
      sendRequest: sendGetIncidentTypesRequest,
      loading: getIncidentTypesRequestLoading,
   } = useFetch();
   const {
      sendRequest: sendGetQuestionsRequest,
      loading: getQuestionsRequestLoading,
   } = useFetch();

   const [incidentTypes, setIncidentTypes] = useState([]);
   const [incidentQuestions, setIncidentQuestions] = useState([]);
   const {
      clearAnswers,
      setValidationErrors,
      currentIncident,
      setCurrentIncident,
   } = useContext(incidentFormContext);

   const checkFormFilledBefore = async function (incidentId) {
      try {
         const res = await sendGetRecordResponse(
            API.getIncidentRecordResponse(userToken, incidentId)
         );
         console.log(res);
         if (res?.incidentRecordQuestions.length) setFormFilledBefore(true);
         // setFormCannotBeFilled({ why: FORM_FILLED_BEFORE_MSG });
      } catch (err) {
         console.log(err);
      }
   };

   const checkIncidentStatus = useCallback(() => {
      const req = sendIncidentStatusRequest(
         API.getIncidentStatus(+incidentId, userToken)
      );
      req.then(status => {
         if (!status?.code) throw Error('No status');
         switch (status.code) {
            case 'CLOSED_BY_USER':
               const closedBy = userUtils.getFullName(status);
               const isClosedByLoggedInUser =
                  closedBy === userUtils.getFullName(currentUser);

               setFormCannotBeFilled({
                  why: `This incident has been marked as closed by ${
                     isClosedByLoggedInUser ? 'you' : closedBy
                  }`,
               });
               break;
            default:
               break;
         }
      }).catch(console.log);
   }, [incidentId]);

   // The control for this page starts here
   useEffect(() => {
      document.title = 'Incident Form Q&A';

      if (!incidentId || isNaN(incidentId))
         return setFormCannotBeFilled({
            why: 'Request BLOCKED: Malformed Data.',
         });
      checkFormFilledBefore(incidentId);
   }, []);

   useEffect(() => {
      if (!setFormFilledBefore) checkIncidentStatus(incidentId);
   }, [setFormFilledBefore, checkIncidentStatus, incidentId]);

   useEffect(() => {
      if (formCannotBeFilled.why.length) return;

      const res = sendGetIncidentTypesRequest(
         API.getIncidentRecordTypes(userToken)
      );
      res.then(setIncidentTypes);
      res.catch(err => {
         setIncidentTypes([]);
         console.log(err);
      });
   }, [formCannotBeFilled.why]);

   // This is a util
   const getIncidentByName = name => {
      return incidentTypes?.find(inc => inc.name === name);
   };

   useEffect(() => {
      setValidationErrors({}); // Remove validation errors since new questions will be fetched
      clearAnswers(); // Clear user's input since new questions will be fetched
   }, [currentIncident]);

   const handleSelectIncident = async function (ev) {
      const selectedName = ev.target.value;
      if (selectedName.toLowerCase() === 'select incident type') return;
      setCurrentIncident(selectedName); // currentIncident will be global via Context

      // Fetch questions based on selected incident type
      const questions = await sendGetQuestionsRequest(
         API.getIncidentRecordQuestions(
            getIncidentByName(selectedName)?.incidentRecordHeaderID,
            userToken
         )
      );
      setIncidentQuestions(questions);
      console.log(questions);
   };

   if (
      getRecordResponseRequestLoading ||
      getIncidentTypesRequestLoading ||
      getQuestionsRequestLoading ||
      incidentStatusRequestsLoading
   )
      return <Spinner show />;

   if (formFilledBefore)
      return (
         <h3 className="d-flex justify-content-center vh-100 align-items-center fs-4 fw-normal text-primary mx-5 px-5">
            This form has been filled before.
         </h3>
      );
   if (formCannotBeFilled.why.length)
      return (
         <h3 className="d-flex justify-content-center vh-100 align-items-center fs-4 fw-normal text-primary mx-5 px-5">
            {formCannotBeFilled.why}.
         </h3>
      );
   return (
      <div className="container my-md-5 body-font">
         <div className="row">
            <div className="incident-form__header col-md-6 offset-md-3 d-flex justify-content-between">
               <NavLink to="/dashboard" className="logo">
                  <img
                     src={
                        process.env.PUBLIC_URL +
                        '/images/insuretek-white-logo.svg'
                     }
                     className="img-fluid"
                     alt="logo"
                  />
               </NavLink>

               <span className="incident-form__header--title d-flex align-items-center">
                  Incident form Q&A
               </span>
            </div>
         </div>
         <div className="row">
            <div className="col-md-6 offset-md-3 border shadow-sm form-container">
               <div className="incident-form__top d-md-flex justify-content-between align-items-start">
                  <div className="incident-form__topleft d-flex justify-content-between align-items-start">
                     <img
                        src={
                           process.env.PUBLIC_URL +
                           '/images/icons/incident-form_icon.png'
                        }
                        alt="Incident form icon"
                        className="img-fluid"
                     />
                     <span>
                        Select Incident Type
                        <p>
                           While doing physical inspection at device location
                        </p>
                     </span>
                  </div>
                  <div className="incident-form__topright">
                     <Form.Select
                        aria-label="Default select example"
                        onChange={handleSelectIncident}
                        className="form-select"
                        value={currentIncident}
                        // defaultValue="Select incident type"
                     >
                        <option>Select incident type</option>
                        {incidentTypes?.map(incid => (
                           <option key={incid.name} value={incid.name}>
                              {incid.name}
                           </option>
                        ))}
                     </Form.Select>
                  </div>
               </div>
               {/* This is the actual form */}
               <QuestionsForm
                  questions={incidentQuestions}
                  incidentRecordHeaderID={
                     getIncidentByName(currentIncident)?.incidentRecordHeaderID
                  }
               />
            </div>
         </div>
      </div>
   );
}

const mapStateToProps = createStructuredSelector({
   currentUser: userSelectors.selectCurrentUser,
   userToken: userSelectors.selectUserToken,
});
export default connect(mapStateToProps)(IncidentFormPage);
