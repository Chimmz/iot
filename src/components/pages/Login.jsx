import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { loginUser } from '../../redux/user/user-action-creators';
import { selectUsername } from '../../redux/user/user-selectors';

import Input from '../UI/Input';
import './Login.css';

function Login({ dispatch }) {
   const [userData, setUserData] = useState({ username: '', password: '' });

   const handleChange = (field, value) => {
      setUserData(prevState => ({ ...prevState, [field]: value }));
   };

   const submitHandler = ev => {
      ev.preventDefault();
      const { username, password } = userData;
      // console.log(username, password);
      dispatch(loginUser(username, password));
   };

   // console.log(props.username);

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
   username: selectUsername
});

export default connect(mapStateToProps)(Login);
