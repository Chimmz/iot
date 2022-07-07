import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import API from '../utils/apiUtils';
import * as userSelectors from '../redux/user/user-selectors';
function IncidentSupress({ currentUser, loggedIn, userToken }) {
  const [searchParams] = useSearchParams();
  const [responseMsg, setResponseMsg] = useState('');
  const queryParams = [+searchParams.get('statusid'), +searchParams.get('incidentid')];
  const location = useLocation();
  window.history.pushState(null, null, location.href);
  window.onpopstate = function () {
    window.history.go(1);
  };
  let responseText;

  const checkStatus = () => {
    let res = API.getIncidentStatus(queryParams[1], userToken);
    res
      .then(data => {
        if (data === undefined) throw new Error(' Request BLOCKED: Invalid incident');

        if (!data) throw new Error('System Error');
        if (typeof data === 'string') {
          if (data.includes('System Error')) throw new Error(data);
        }
        if (data?.code === 'CLOSED' || data?.code === 'NEW') {
          responseText = (
            <div className='mx-auto' style={{ color: '#A9A9A9', width: '90%' }}>
              <p>
                You are asking to cease further emails from this device. In doing so you agree your
                warrantee will not be valid.
              </p>
              <p>This incident remains open until</p>
              <ol style={{ listStyleType: 'disc', paddingLeft: '16px' }}>
                <li>You close this incident or fill out an incident form.</li>
                <li>Incident is automatically closed by the system.</li>
              </ol>
              <div style={{ textAlign: 'center' }}>
                <p>
                  <Link
                    to='/incident/suppress-action'
                    state={{
                      type: 11,
                      statusid: queryParams[0],
                      incidentid: queryParams[1]
                    }}
                  >
                    Confirm device to suppress device
                  </Link>
                </p>
                <p>or</p>
                <p>
                  <Link
                    to='/incident/suppress-action'
                    state={{
                      type: 10
                    }}
                  >
                    Cancel
                  </Link>
                </p>
              </div>
            </div>
          );
        } else {
          let statusName = data?.name.split(' ')[0];
          let modifiedBy = data?.firstName + ' ' + data?.lastName;
          const loggedInUserName = currentUser?.firstName + ' ' + currentUser?.lastName;
          if (modifiedBy === loggedInUserName) modifiedBy = 'you';
          modifiedBy = modifiedBy.trim();
          responseText = (
            <p>
              Incident has been marked as {statusName} {modifiedBy && ` by ${modifiedBy}`}
            </p>
          );
        }
        setResponseMsg(responseText);
      })
      .catch(err => {
        responseText = setResponseMsg(`Sorry, something wrong happened. ${err}`);
        console.log(err);
      });
  };

  useEffect(() => {
    document.title = 'AMS | Update Incident Status';
    if (!loggedIn) return;

    const isInvalidParam = param => !param || isNaN(param);
    if (queryParams.some(isInvalidParam)) {
      setResponseMsg('Request BLOCKED: Malformed Data.');
      return;
    }
    checkStatus();
  }, []);
  const { pathname, search } = useLocation();
  const currentFullPath = pathname + search;

  const Wrapper = props => (
    <h3
      className={`d-flex justify-content-center vh-100 align-items-center fs-4 fw-normal text-primary mx-5 px-5 ${props.className} `}
    >
      {props.children}
    </h3>
  );
  if (!loggedIn) {
    return (
      <Wrapper>
        <span className='text-secondary'>You're not logged in.</span>
        <Link to='/login' state={{ redirectTo: currentFullPath }} className='mx-2'>
          Login
        </Link>
      </Wrapper>
    );
  }
  if ([1, -1].includes(responseMsg)) return <Wrapper>Thank you.</Wrapper>;
  return (
    <>
      <style>
        {`
            @media (max-width: 992px) {
              .update-wrapper-message {
                padding-right: 0.1rem !important;
                padding-left: 0.1rem !important;

              }
            }
          `}
      </style>
      <Wrapper className='update-wrapper-message'> {responseMsg || 'Please wait...'}</Wrapper>
    </>
  );
}
const mapStateToProps = createStructuredSelector({
  currentUser: userSelectors.selectCurrentUser,
  loggedIn: userSelectors.selectUserLoggedIn,
  userToken: userSelectors.selectUserToken
});

export default connect(mapStateToProps)(IncidentSupress);
