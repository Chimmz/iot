import React from 'react';
import { Navigate } from 'react-router-dom';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectUserStatusMsg } from '../../redux/user/user-selectors';

import Input from '../UI/Input';

function ForgotPassword(props) {
   return (
      <div className='container h-100'>
         <div className='row h-100 justify-content-center align-items-center'>
            <form className='col-md-9'>
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
                                 type='email'
                                 className='form-control border-0 border-bottom rounded-0 shadow-none'
                                 id='email'
                                 placeholder='Email Address'
                              />
                              <i className='bi bi-envelope'></i>
                           </div>

                           <button className='btn btn-success btn-block shadow border-0 py-2 text-uppercase '>
                              Send Email
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
   userStatusMsg: selectUserStatusMsg
});

export default connect(mapStateToProps)(ForgotPassword);
