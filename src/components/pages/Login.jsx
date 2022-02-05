import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { loginUser } from '../../redux/user/user-action-creators';
import { selectUserLoggedIn } from '../../redux/user/user-selectors';

import Input from '../UI/Input';
import './Login.css';

function Login({ isLoggedIn, dispatch }) {
   const navigate = useNavigate();
   const [userData, setUserData] = useState({ username: '', password: '' });

   if (isLoggedIn) return <Navigate replace to='/dashboard'></Navigate>;

   const handleChange = (field, value) => {
      setUserData(prevState => ({ ...prevState, [field]: value }));
   };

   const submitHandler = ev => {
      ev.preventDefault();
      dispatch(
         loginUser(userData.username.trim(), userData.password.trim(), navigate)
      );
   };

   return (
      <div className='container h-100'>
         <div className='row h-100 justify-content-center align-items-center'>
            <form className='col-md-9' onSubmit={submitHandler}>
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
                                 <a href='#'>Forgot Password?</a>
                              </div>
                           </div>

                           <button className='btn btn-success btn-block shadow border-0 py-2 text-uppercase'>
                              Login
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </form>
         </div>
      </div>
   );
}

const mapStateToProps = createStructuredSelector({
   isLoggedIn: selectUserLoggedIn
});

export default connect(mapStateToProps)(Login);
