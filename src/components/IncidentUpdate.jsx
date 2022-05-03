import React, { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import API from '../utils/apiUtils';
import * as userSelectors from '../redux/user/user-selectors';

function IncidentUpdate({ currentUser, loggedIn, userToken }) {
   const [searchParams] = useSearchParams();
   const [responseMsg, setResponseMsg] = useState('');

   const queryParams = [
      +searchParams.get('statusid'),
      +searchParams.get('incidentid')
   ];
   console.log(queryParams);

   const updateStatus = () => {
      let res = API.updateIncidentStatus(
         ...queryParams,
         currentUser.userId,
         userToken
      );
      res.then(setResponseMsg).catch(err => {
         setResponseMsg('Sorry, something wrong happened: ', err);
         console.log(err);
      });
   };

   useEffect(() => {
      document.title = 'AMS | Update Incident Status';
      if (!loggedIn) return;

      const isInvalidParam = param => !param || isNaN(param);
      if (queryParams.some(isInvalidParam)) return;
      updateStatus();
   }, []);

   const { pathname, search } = useLocation();
   const currentFullPath = pathname + search;

   const Wrapper = props => (
      <h3 className="d-flex justify-content-center vh-100 align-items-center">
         {props.children}
      </h3>
   );

   if (!loggedIn) {
      return (
         <Wrapper>
            You're not logged in.
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
   return <Wrapper> {responseMsg || 'Please wait...'}</Wrapper>;
}

const mapStateToProps = createStructuredSelector({
   currentUser: userSelectors.selectCurrentUser,
   loggedIn: userSelectors.selectUserLoggedIn,
   userToken: userSelectors.selectUserToken
});

export default connect(mapStateToProps)(IncidentUpdate);
