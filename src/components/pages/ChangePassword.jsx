import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Standard Redux imports
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// Imports of Redux state selectors, action creators, and utils
import * as userSelectors from '../../redux/user/user-selectors';
import { flashAlert } from '../../redux/alert/alert-creators';
import * as userCreators from '../../redux/user/user-action-creators';
import * as alertUtils from '../../redux/alert/alert-utils';

// Hooks
import useInput from '../../hooks/useInput';

// Bootstrap components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

// External components
import ChangedPasswordSuccess from './ChangedPasswordSuccess';
// import Input from '../UI/Input';
// import Form from '../UI/Form';

import './ChangePassword.scss';

function ChangePassword({ currentUser, userToken, dispatch }) {
   const [currentPassword, handleChangeCurrentPassword] = useInput('');
   const [newPassword, handleChangeNewPassword] = useInput('');
   const [confirmPassword, handleChangeConfirmPassword] = useInput('');
   const navigate = useNavigate();

   const handleSubmit = ev => {
      ev.preventDefault();
      if (newPassword !== confirmPassword) {
         return dispatch(
            flashAlert(new alertUtils.Alert('Passwords do not match', 'error'))
         );
      }

      // Proceed to change password if validation is passed
      dispatch(
         userCreators.changePassword(
            navigate,
            currentUser.userId,
            currentPassword,
            newPassword,
            userToken
         )
      );
   };

   return (
      <>
         <main className='create__password__wrapp forgot__password auth__wrapper py-5 position-relative'>
            <Container>
               <div className='h3 fw-normal'>
                  Hi
                  <span className='text-primary'>
                     {' '}
                     {currentUser.firstName} !
                  </span>
               </div>

               {/* space */}
               <div className='py-3 py-md-4 py-lg-5'>&nbsp;</div>

               <Row className='align-items-center g-4 g-lg-5'>
                  <Col md='6'>
                     <div className='left__wrapp'>
                        <h1 className='text-primary fw-bold ff-bronova'>
                           Create a new password
                        </h1>
                        <Form
                           className='mt-4 form__wrapp'
                           onSubmit={handleSubmit}>
                           <Form.Label className='text-gray fs16'>
                              Type and confirm a secure new password for the
                              account.
                           </Form.Label>
                           <InputGroup className='mb-3 mb-lg-4'>
                              <InputGroup.Text id='password'>
                                 <img
                                    src='images/icons/lock-gray.svg'
                                    alt='mail-svg-icon'
                                 />
                              </InputGroup.Text>
                              <Form.Control
                                 type='password'
                                 value={currentPassword}
                                 onChange={handleChangeCurrentPassword}
                                 placeholder='Enter password'
                                 aria-label='Enter password'
                                 aria-describedby='password'
                              />
                           </InputGroup>
                           <InputGroup className='mb-3 mb-lg-4'>
                              <InputGroup.Text id='password'>
                                 <img
                                    src='images/icons/lock-gray.svg'
                                    alt='mail-svg-icon'
                                 />
                              </InputGroup.Text>
                              <Form.Control
                                 type='password'
                                 value={newPassword}
                                 onChange={handleChangeNewPassword}
                                 placeholder='Enter password'
                                 aria-label='Enter password'
                                 aria-describedby='password'
                              />
                           </InputGroup>
                           <InputGroup className='mb-3 mb-lg-4'>
                              <InputGroup.Text id='password2'>
                                 <img
                                    src='images/icons/lock-gray.svg'
                                    alt='mail-svg-icon'
                                 />
                              </InputGroup.Text>
                              <Form.Control
                                 type='password'
                                 value={confirmPassword}
                                 onChange={handleChangeConfirmPassword}
                                 placeholder='Confirm password'
                                 aria-label='Confirm password'
                                 aria-describedby='password2'
                              />
                           </InputGroup>

                           <Button
                              type='submit'
                              varient='primary'
                              className='rounded'>
                              Reset password
                           </Button>
                           <Link to='/change-password/success'>
                              success page
                           </Link>
                        </Form>
                     </div>
                  </Col>
                  <Col md='6'>
                     <img
                        src='images/icons/lock-lg-gray-reset.svg'
                        alt='lock-svg-icon'
                     />

                     <p
                        className='fs12 mt-3 w-100 text-gray'
                        style={{ maxWidth: '360px' }}>
                        <b>Plaese Note: </b> <br />
                        The password should be at least 12 characters long. To
                        make it stronger, user upper and ower case letters
                        numbers, and symbols like ! \ “ ? $ % ^ &).
                     </p>
                  </Col>
               </Row>
            </Container>
            <p className='fs10 copyright position-absolute start-50 translate-middle-x bottom-0'>
               © Copyright 2022 | <Link to='/'>Terms of Use</Link> |{' '}
               <Link to='/'>Privacy Policy</Link>
            </p>
         </main>
      </>
   );
}

const mapStateToProps = createStructuredSelector({
   currentUser: userSelectors.selectCurrentUser,
   userToken: userSelectors.selectUserToken
});

export default connect(mapStateToProps)(ChangePassword);
