import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as userCreators from '../../../../redux/user/user-action-creators';
import * as portfolioCreators from '../../../../redux/portfolio/portfolio-action-creators';
import * as userSelectors from '../../../../redux/user/user-selectors';

// Contexts
import { dashboardContext } from '../../../../contexts/dashboardContext';

// Utils
import apiUtils from '../../../../utils/apiUtils';

import LoggedInUser from './LoggedInUser';
import PortfoliosDropdown from './PortfoliosDropdown';

import './DashboardHeader.scss';

function DashboardHeader(props) {
   const { currentUser, userToken, dispatch } = props;
   const [portfolios, setPortfolios] = useState([]);
   const { toggleSidebarCollapsed } = useContext(dashboardContext);

   const getUserPortfolio = async function () {
      try {
         const res = await apiUtils.getUserPortfolio(
            currentUser.userId,
            userToken
         );
         // console.log(res);

         dispatch(portfolioCreators.setUserPortfolio(res));
         setPortfolios(res);
      } catch (err) {
         console.log(err);
      }
   };

   useEffect(() => getUserPortfolio(), []);

   const headerIcons = [
      {
         imgSrc: '/images/icons/search-white.svg',
         alt: 'Search'
      },
      {
         imgSrc: '/images/icons/bell-white.svg',
         alt: 'Notifications'
      },
      {
         imgSrc: '/images/icons/expend-white.svg',
         alt: 'Zoom to fullscreen'
      }
   ];

   return (
      <div className="header__wrapp d-flex align-items-center">
         <div className="logo__wrapp d-flex align-items-center col-md-6">
            <button className="p-1 btn" onClick={toggleSidebarCollapsed}>
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
            {headerIcons.map(icon => (
               <button key={icon.imgSrc} className="px-2 btn d-none d-sm-block">
                  <img
                     src={process.env.PUBLIC_URL + icon.imgSrc}
                     alt={icon.alt}
                  />
               </button>
            ))}

            <LoggedInUser user={currentUser} />
         </ul>
      </div>
   );
}

const mapStateToProps = createStructuredSelector({
   currentUser: userSelectors.selectCurrentUser,
   userToken: userSelectors.selectUserToken
});

export default connect(mapStateToProps)(DashboardHeader);
