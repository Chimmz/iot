import React, { useState, useEffect, useRef, useContext } from 'react';
import { NavLink } from 'react-router-dom';

// Redux standard imports
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// Redux user state selectors
import * as userSelectors from '../../../redux/user/user-selectors';

// The API instance for making HTTP requests
import API from '../../../utils/apiUtils';

// The data in this context is for this compon. and it's descendants
import { incidentFormContext } from '../../../contexts/incidentFormContext';

// The actual form
import QuestionsForm from './form/QuestionsForm';
// React-bootstrap
import Form from 'react-bootstrap/Form';
import './IncidentFormPage.scss';
import useFetch from '../../../hooks/useFetch';
import Spinner from '../../UI/spinner/Spinner';

function IncidentFormPage({ userToken }) {
   const {
      sendRequest: sendGetIncidentTypesRequest,
      loading: getIncidentTypesRequestLoading
   } = useFetch();

   const {
      sendRequest: sendGetQuestionsRequest,
      loading: getQuestionsRequestLoading
   } = useFetch();

   const [incidentTypes, setIncidentTypes] = useState([]);
   const [incidentQuestions, setIncidentQuestions] = useState([]);
   const {
      clearAnswers,
      setValidationErrors,
      currentIncident,
      setCurrentIncident
   } = useContext(incidentFormContext);

   // prettier-ignore
   // This is a util
   const getIncidentByName = name => incidentTypes?.find(inc => inc.name === name);

   const handleSelectIncident = async function (ev) {
      const selectedName = ev.target.value;
      if (selectedName.toLowerCase() === 'select incident type') return;

      setCurrentIncident(selectedName); // currentIncident will be global via Context
      setValidationErrors({}); // Remove validation errors since new questions will be fetched
      clearAnswers(); // Clear user's input since new questions will be fetched

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

   useEffect(() => {
      document.title = 'Incident Form Q&A';

      const onError = err => {
         setIncidentTypes([]);
         console.log(err);
      };

      const res = sendGetIncidentTypesRequest(
         API.getIncidentRecordTypes(userToken)
      );
      res.then(setIncidentTypes).catch(onError);
   }, []);

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
                     >
                        <option value={null} selected>
                           Select incident type
                        </option>

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
         <Spinner
            show={getIncidentTypesRequestLoading || getQuestionsRequestLoading}
         />
      </div>
   );
}

const mapStateToProps = createStructuredSelector({
   userToken: userSelectors.selectUserToken
});
export default connect(mapStateToProps)(IncidentFormPage);
