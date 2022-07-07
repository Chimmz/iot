import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// Redux state selectors and action creators
import * as userSelectors from '../../../redux/user/user-selectors';
import * as portfolioSelectors from '../../../redux/portfolio/portfolio-selectors';

// Contexts
import { dashboardContext } from '../../../contexts/dashboardContext';

// Imports of Utils
import API from '../../../utils/apiUtils';

// External custom  components
import LeftSidebar from '../../layout/left-sidebar/LeftSidebar';
import DashboardPages from './body/DashboardPages';
import Header from '../../layout/header/Header';
import TermsAndConditions from '../../terms-and-conds/TermsAndConditions';

import './Dashboard.scss';
import Backdrop from '../../UI/backdrop/Backdrop';

function Dashboard(props) {
   const { currentUser, userStatus, loggedIn, userToken } = props;
   const [legalUser, setLegalUser] = useState(false);
   const [hasAcceptedTerms, setHasAcceptedTerms] = useState(true);
   const { sidebarCollapsed, hideSidebar } = useContext(dashboardContext);

   const getLegalUser = async function () {
      try {
         let res = await API.getLegalUser(currentUser.userId, userToken);
         console.log(res);

         const acceptedBefore = Boolean(res?.legal);
         setHasAcceptedTerms(acceptedBefore);

         if (!acceptedBefore) res = await API.getLegalUser(0, userToken);
         setLegalUser(res?.legal);
      } catch (err) {
         console.log(err);
      }
   };

   useEffect(() => {
      document.title = 'AMS Portal';
      getLegalUser();
   }, []);

   return !loggedIn ? (
      <Navigate to="/login" />
   ) : userStatus === 'DEFAULT_PASSWORD' ? (
      <Navigate to="/change-password" />
   ) : (
      <>
         <Header />
         <main className={`main__layout ${sidebarCollapsed && 'compact'}`}>
            <LeftSidebar />
            <DashboardPages />
         </main>
         {!hasAcceptedTerms && <TermsAndConditions legalUser={legalUser} />}

         <Backdrop
            show={sidebarCollapsed}
            classes="sidebar-mobile"
            onClick={hideSidebar}
         />
      </>
   );
}

const mapStateToProps = createStructuredSelector({
   currentUser: userSelectors.selectCurrentUser,
   loggedIn: userSelectors.selectUserLoggedIn,
   userStatus: userSelectors.selectUserStatusMsg,
   userToken: userSelectors.selectUserToken,
   currentPortfolio: portfolioSelectors.selectCurrentPortfolio
});

export default connect(mapStateToProps)(Dashboard);
