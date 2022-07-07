import React, { useState, useEffect, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as userCreators from '../../../redux/user/user-action-creators';
import * as userSelectors from '../../../redux/user/user-selectors';
import * as notifSelectors from '../../../redux/notification/notification-selectors';
import * as portfolioCreators from '../../../redux/portfolio/portfolio-action-creators';

// Hooks
import useFetch from '../../../hooks/useFetch';
import useToggle from '../../../hooks/useToggle';
// Contexts
import { dashboardContext } from '../../../contexts/dashboardContext';
// Utils
import API from '../../../utils/apiUtils';

import LoggedInUser from './LoggedInUser';
import Spinner from 'react-bootstrap/Spinner';
import PortfoliosDropdown from './PortfoliosDropdown';
import NotificationBell from './NotificationBell';
import './Header.scss';

function Header(props) {
   const { currentUser, userToken, dispatch } = props;
   const [portfolios, setPortfolios] = useState([]);
   const { sidebarCollapsed, toggleSidebarCollapsed } =
      useContext(dashboardContext);
   const {
      sendRequest: sendPortfolioRequest,
      loading: portfolioRequestLoading,
   } = useFetch();

   const getUserPortfolio = async function () {
      const req = sendPortfolioRequest(
         API.getUserPortfolio(currentUser.userId, userToken)
      );
      // console.log(res);
      req.then(res => {
         dispatch(portfolioCreators.setUserPortfolio(res));
         setPortfolios(res);
      }).catch(console.log);
   };

   useEffect(() => {
      getUserPortfolio();
   }, []);

   return (
      <div className="header__wrapp d-flex align-items-center">
         <div className="logo__wrapp d-flex align-items-center col-md-6">
            <button
               className={`p-1 btn hamburger ${sidebarCollapsed && 'rotated'}`}
               onClick={toggleSidebarCollapsed}
            >
               <img
                  src={process.env.PUBLIC_URL + '/images/icons/indent.svg'}
                  alt="indent-icon"
               />
            </button>
            <NavLink to="/dashboard" className="logo">
               <img
                  src={
                     process.env.PUBLIC_URL + '/images/insuretek-white-logo.svg'
                  }
                  className="img-fluid"
                  alt="logo"
               />
            </NavLink>
            <PortfoliosDropdown portfolios={portfolios} />
         </div>

         <ul className="navbar-nav ms-auto d-flex flex-row">
            <NotificationBell />
            <LoggedInUser user={currentUser} portfolios={portfolios} />
         </ul>
      </div>
   );
}

const mapStateToProps = createStructuredSelector({
   currentUser: userSelectors.selectCurrentUser,
   userToken: userSelectors.selectUserToken,
   unreadNotifs: notifSelectors.selectUnreadNotifs,
   unreadNotifsCount: notifSelectors.selectUnreadNotifsCount,
});

export default connect(mapStateToProps)(Header);
