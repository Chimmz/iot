import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectUserLoggedIn } from '../../redux/user/user-selectors';

const ProtectedRoute = ({ path, Component, isLoggedIn }) => {
   console.log('isLoggedIn: ', isLoggedIn);
   // const redirectToLogin = () => ;
   // const redirectToComponent = routeProps =>

   return (
      <Route
         path={path}
         render={routeProps =>
            !isLoggedIn ? (
               <Navigate replace to='/login' />
            ) : (
               <Component {...routeProps} />
            )
         }
      />
   );
};

const mapStateToProps = createStructuredSelector({
   isLoggedIn: selectUserLoggedIn
});

export default connect(mapStateToProps)(ProtectedRoute);
