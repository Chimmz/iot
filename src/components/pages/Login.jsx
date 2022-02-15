import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as userCreators from '../../redux/user/user-action-creators';
import {
   selectUserLoggedIn,
   selectUserStatusMsg
} from '../../redux/user/user-selectors';

import Input from '../UI/Input';
import './Login.css';
import Form from '../UI/Form';

function Login({ isLoggedIn, userStatusMsg, dispatch }) {
   const navigate = useNavigate();
   const [userData, setUserData] = useState({ username: '', password: '' });

   if (isLoggedIn) return <Navigate replace to='/dashboard' />;

   const handleChange = (field, value) => {
      setUserData(prevState => ({ ...prevState, [field]: value }));
   };

   const handleSubmit = ev => {
      ev.preventDefault();
      dispatch(
         userCreators.login(userData.username.trim(), userData.password.trim())
      );
   };

   // dhanush.s@tonkabi.com
   // ravi.shankar@tonkabi.com
   // root123+
   // https://ams-iot-dev.azurewebsites.net/api/Auth/login

   return (
      <div className='container h-100'>
         <div className='row h-100 justify-content-center align-items-center'>
            <Form className='col-md-9' submitHandler={handleSubmit}>
               <div className='IOTForm shadow-lg'>
                  <div className='row'>
                     <div className='col-md-6'>
                        <div className='IOTFormRight position-relative d-flex justify-content-center flex-column align-items-center text-center p-5 text-white'></div>
                     </div>
                     <div className='col-md-6 d-flex justify-content-center align-items-center'>
                        <div className='IOTFormLeft'>
                           <h1>Login</h1>
                           <div className='form-group position-relative mb-4'>
                              <Input
                                 className='form-control border-0 border-bottom rounded-0 shadow-none'
                                 id='username'
                                 name='username'
                                 placeholder='Username'
                                 uponChange={handleChange}
                              />
                              <i className='bi bi-person'></i>
                           </div>
                           <div className='form-group position-relative mb-4'>
                              <Input
                                 type='password'
                                 className='form-control border-0 border-bottom rounded-0 shadow-none'
                                 id='password'
                                 name='password'
                                 placeholder='Password'
                                 uponChange={handleChange}
                              />
                              <i className='bi bi-key'></i>
                           </div>
                           <div className='row mt-4 mb-4'>
                              <div className='col-md-12 text-right'>
                                 <Link to='/change-password'>
                                    Forgot Password
                                 </Link>
                              </div>
                           </div>

                           <button className='btn btn-success btn-block shadow border-0 py-2 text-uppercase'>
                              Login
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </Form>
         </div>
      </div>
   );
}

const mapStateToProps = createStructuredSelector({
   isLoggedIn: selectUserLoggedIn,
   userStatusMsg: selectUserStatusMsg
});

export default connect(mapStateToProps)(Login);
