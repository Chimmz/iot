import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
   selectCurrentUser,
   selectUserStatusMsg,
   selectUserToken
} from '../../redux/user/user-selectors';

import { flashAlert } from '../../redux/alert/alert-creators';
import * as userCreators from '../../redux/user/user-action-creators';
import * as alertUtils from '../../redux/alert/alert-utils';

import Input from '../UI/Input';

function ResetPassword({ currentUser, userToken, dispatch }) {
   // console.log('currentUser, userToken: ', currentUser, userToken);

   const [passwords, setPasswords] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
   });

   const handleChange = (name, value) => {
      setPasswords(prevState => ({ ...prevState, [name]: value }));
   };

   const submitHandler = ev => {
      ev.preventDefault();

      const { currentPassword, newPassword, confirmPassword } = passwords;

      if (Object.values(passwords).some(input => !input?.length)) {
         return dispatch(
            flashAlert(
               new alertUtils.Alert('Password field cannot be empty', 'error')
            )
         );
      }

      if (newPassword !== confirmPassword) {
         return dispatch(
            flashAlert(new alertUtils.Alert('Passwords do not match', 'error'))
         );
      }

      dispatch(
         userCreators.changePassword(
            currentUser.userId,
            currentPassword,
            newPassword,
            userToken
         )
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
                           <h1>Change Password</h1>
                           <div className='form-group position-relative mb-4'>
                              <Input
                                 type='password'
                                 className='form-control border-0 border-bottom rounded-0 shadow-none'
                                 name='currentPassword'
                                 placeholder='Enter your current password'
                                 uponChange={handleChange}
                              />
                              <Input
                                 type='password'
                                 className='form-control border-0 border-bottom rounded-0 shadow-none'
                                 name='newPassword'
                                 placeholder='Enter new password'
                                 uponChange={handleChange}
                              />
                              <Input
                                 type='password'
                                 className='form-control border-0 border-bottom rounded-0 shadow-none'
                                 name='confirmPassword'
                                 placeholder='Confirm new password'
                                 uponChange={handleChange}
                              />
                              <i className='bi bi-envelope'></i>
                           </div>

                           <button
                              className='btn btn-success btn-block shadow border-0 py-2 text-uppercase '
                              type='submit'>
                              Change password
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
   currentUser: selectCurrentUser,
   userToken: selectUserToken
});

export default connect(mapStateToProps)(ResetPassword);
