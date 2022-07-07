import React, { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import API from '../utils/apiUtils';
import * as userSelectors from '../redux/user/user-selectors';
import * as userUtils from '../redux/user/user-utils';

function IncidentUpdate({ currentUser, loggedIn, userToken }) {
   const [searchParams] = useSearchParams();
   const [responseMsg, setResponseMsg] = useState('');
   const { pathname, search } = useLocation();

   const currentFullPath = pathname + search;
   let queryParams = [
      +searchParams.get('statusid'),
      +searchParams.get('incidentid'),
   ];

   const checkStatus = () => {
      let res = API.getIncidentStatus(queryParams[1], userToken);
      let responseText;
      res.then(data => {
         if (data === undefined)
            throw new Error(' Request BLOCKED: Invalid incident');

         if (!data) throw new Error('System Error');

         if (typeof data === 'string') {
            if (data.includes('System Error')) throw new Error(data);
         }
         if (['CLOSED', 'NEW', 'SUPPRESSED'].includes(data?.code)) {
            if (queryParams[0] == 5 || queryParams[0] == 7) {
               queryParams = [7, queryParams[1]];
               updateStatus();
            }
         } else {
            let statusName;
            try {
               statusName = data?.name.split(' ')[0];
            } catch {
               throw new Error('data not found');
            }
            let modifiedBy = userUtils.getFullName.call(data);
            const loggedInUserName = userUtils.getFullName.call(currentUser);

            if (modifiedBy === loggedInUserName) modifiedBy = 'you';
            responseText = (
               <p>
                  {`Incident has been marked as ${statusName} by ${modifiedBy}.`}
               </p>
            );
            setResponseMsg(responseText);
         }
      }).catch(err => {
         responseText = setResponseMsg(
            `Sorry, something wrong happened: ${err}`
         );
         console.log(err);
      });
   };

   const updateStatus = () => {
      let res = API.updateIncidentStatus(
         ...queryParams,
         currentUser.userId,
         userToken
      );
      let responseText;
      res.then(data => {
         responseText = (
            <div className="mx-auto" style={{ color: '#A9A9A9' }}>
               <p>
                  You have visited the location, reviewed the incident, and
                  confirm that there is no damage requiring further action by
                  InsureTEK.
               </p>
               <p>
                  If further attention is needed,
                  <a
                     href={`${window.location.origin}/telemetry/incident-form?incidentid=${queryParams[1]}`}
                  >
                     please fill out an incident form.
                  </a>
               </p>
            </div>
         );
         setResponseMsg(responseText);
      }).catch(err => {
         setResponseMsg('Sorry, something wrong happened: ', err);
         console.log(err);
      });
   };

   useEffect(() => {
      document.title = 'AMS | Update Incident Status';
      if (!loggedIn) return;
      const isInvalidParam = param => !param || isNaN(param);

      if (queryParams.some(isInvalidParam))
         return setResponseMsg('Request BLOCKED: Malformed Data.');
      // checkStatus();
   }, []);

   const Wrapper = props => (
      <div
         className={`d-flex justify-content-center vh-100 align-items-center fs-4 fw-normal text-primary mx-5 px-5 ${props.className} `}
      >
         {props.children}
      </div>
   );

   if (!loggedIn) {
      return (
         <Wrapper>
            <span className="text-secondary">You're not logged in.</span>
            <Link
               to="/login"
               state={{ redirectTo: currentFullPath }}
               className="mx-2"
            >
               Login
            </Link>
         </Wrapper>
      );
   }
   if ([1, -1].includes(responseMsg)) return <Wrapper>Thank you.</Wrapper>;
   return (
      <Wrapper>
         <div className="mx-auto" style={{ color: '#A9A9A9' }}>
            <p>
               You have visited the location, reviewed the incident, and confirm
               that there is no damage requiring further action by InsureTEK.
            </p>
            <p>
               If further attention is needed,{' '}
               <Link
                  to={`/telemetry/incident-form?incidentid=${queryParams[1]}`}
               >
                  please fill out an incident form.
               </Link>
            </p>
         </div>
      </Wrapper>
   );
   // return (
   //    <>
   //       <style>
   //          {`
   //          @media (max-width: 992px) {
   //            .update-wrapper-message {
   //              padding-right: 0.1rem !important;
   //              padding-left: 0.1rem !important;

   //            }
   //          }
   //        `}
   //       </style>
   //       <Wrapper className="update-wrapper-message">
   //          {responseMsg || 'Please wait...'}
   //       </Wrapper>
   //    </>
   // );
}

const mapStateToProps = createStructuredSelector({
   currentUser: userSelectors.selectCurrentUser,
   loggedIn: userSelectors.selectUserLoggedIn,
   userToken: userSelectors.selectUserToken,
});

export default connect(mapStateToProps)(IncidentUpdate);
