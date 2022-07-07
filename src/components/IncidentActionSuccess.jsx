import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import API from '../utils/apiUtils';

import * as userSelectors from '../redux/user/user-selectors';

const IncidentActionSuccess = ({ currentUser, loggedIn, userToken }) => {
  const [responseMsg, setResponseMsg] = useState(null);

  const { state } = useLocation();
  const location = useLocation();
  window.history.pushState(null, null, location.href);
  window.onpopstate = function () {
    window.history.go(1);
  };
  const navigate = useNavigate();
  // If page was loaded maybe by just entering the URL in the browser and not by truly changing password, go back
  if (!state?.type) navigate(-1);
  let displayText;

  if (state?.type === 10) {
    displayText = 'Suppress Action has been Cancelled';
  } else if (state?.type === 11) {
    const { statusid, incidentid } = state;
    console.log(statusid, incidentid);
    if (statusid && incidentid && !responseMsg) {
      console.log(!responseMsg, responseMsg);
      let res = API.updateIncidentStatus(statusid, incidentid, currentUser.userId, userToken);
      console.log(res);
      res
        .then(data => {
          console.log(data);
          setResponseMsg('Suppressed Successfully');
          // navigate('/suppress-action', { state: { type: 12 } });
        })
        .catch(err => {
          setResponseMsg('Sorry, something wrong happened: ', err);
          console.log(err);
        });
    }
  } else if (!state) displayText = 'Request BLOCKED : Invalid action.';
  return (
    <>
      <main className='success__wrapp d-flex justify-content-center align-items-center mh-100 position-relative'>
        <div className='content col-lg-5 text-center'>
          {(state !== null && (responseMsg || displayText) && (
            <>
              <img src='/images/icons/check-circle-lg.svg' alt='check-circle-icon' />
              <h3 className='h3 ff-bronova text-primary my-4'>{responseMsg || displayText}</h3>
            </>
          )) || (
            <h3 className='d-flex justify-content-center vh-100 align-items-center fs-4 fw-normal text-primary'>
              {(displayText && displayText) || `Please Wait...`}
            </h3>
          )}
        </div>
      </main>
    </>
  );
};
const mapStateToProps = createStructuredSelector({
  currentUser: userSelectors.selectCurrentUser,
  loggedIn: userSelectors.selectUserLoggedIn,
  userToken: userSelectors.selectUserToken
});

export default connect(mapStateToProps)(IncidentActionSuccess);
