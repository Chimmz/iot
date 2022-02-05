import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectUserLoggedIn } from './redux/user/user-selectors';

import Login from './components/pages/Login';
import Alerts from './components/alert/Alerts';
import Dashboard from './components/pages/Dashboard';

// import ProtectedRoute from './components/HOC/ProtectedRoute';

import './App.css';
import ChangePassword from './components/pages/ChangePassword';

function App({ isLoggedIn }) {
   console.log('isLoggedIn: ', isLoggedIn);
   return (
      <>
         <Alerts />
         <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/' element={<Navigate replace to='/dashboard' />} />
            <Route
               path='/dashboard'
               element={
                  isLoggedIn ? <Dashboard /> : <Navigate replace to='/login' />
               }
            />
            <Route path='/change-password' element={<ChangePassword />} />
         </Routes>
      </>
   );
}

{
   /* <ProtectedRoute path='/dashboard' Component={<Dashboard />} /> */
}
const mapStateToProps = createStructuredSelector({
   isLoggedIn: selectUserLoggedIn
});

export default connect(mapStateToProps)(App);
