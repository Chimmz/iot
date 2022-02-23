import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Standard Redux imports
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// Imports of Redux state selectors, action creators, and utils
import * as userSelectors from '../../../../redux/user/user-selectors';
import * as alertCreators from '../../../../redux/alert/alert-creators';
import * as userCreators from '../../../../redux/user/user-action-creators';
import * as alertUtils from '../../../../redux/alert/alert-utils';

// Hooks
import useInput from '../../../../hooks/useInput';

// Bootstrap components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

// External custom components
import Spinner from '../../../UI/spinner/Spinner';
import InputField from '../../../UI/InputField';

import './ChangePassword.scss';

function ChangePassword({ currentUser, userToken, userState, dispatch }) {
   const navigate = useNavigate();

   const [
      currentPassword,
      onChangeCurrPass,
      runCurrPassValidators,
      currPassErrors,
      setCurrPassErrors,
      clearCurrPass
   ] = useInput({
      init: '',
      validators: [{ isRequired: 'This field is required' }]
      // Key names (Ex: 'isEmpty', 'isEmail') must match a function name in: /src/validators/inputValidator.js
   });

   const [
      newPassword,
      onChangeNewPass,
      runNewPassValidators,
      newPassErrors,
      setNewPassErrors,
      clearNewPass
   ] = useInput({
      init: '',
      validators: [
         { isRequired: 'This field is required' },
         { minSixChars: 'Password is less than 6 characters' },
         { isStrongPassword: 'Password is weak' }
      ]
   });

   const [
      confirmPassword,
      onChangeConfirmPass,
      runConfirmPassValidators,
      confirmPassErrors,
      setConfirmPassErrors,
      clearConfirmPass
   ] = useInput({
      init: '',
      validators: [{ isRequired: 'This field is required' }]
   });

   const runAllValidators = () => {
      runCurrPassValidators();
      runNewPassValidators();
      runConfirmPassValidators();
   };

   const clearAllValidators = () => {
      setCurrPassErrors([]);
      setNewPassErrors([]);
      setConfirmPassErrors([]);
   };

   const clearAllInputs = () => {
      clearCurrPass();
      clearNewPass();
      clearConfirmPass();
   };

   const handleSubmit = ev => {
      ev.preventDefault();
      runAllValidators();

      // prettier-ignore
      if (currPassErrors.length || newPassErrors.length || confirmPassErrors.length)
         return

      if (newPassword !== confirmPassword) {
         dispatch(
            alertCreators.flashAlert(
               new alertUtils.Alert('Passwords do not match', 'error')
            )
         );
         return;
      }

      // Proceed to change password
      dispatch(
         userCreators.changePassword(
            navigate,
            currentUser.userId,
            currentPassword,
            newPassword,
            userToken
         )
      );
      // clearAllInputs();
      clearAllValidators();
   };

   return (
      <>
         <Spinner show-if={userState.isLoading}></Spinner>
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
                              <InputField
                                 type='password'
                                 value={currentPassword}
                                 onChange={onChangeCurrPass}
                                 placeholder='Enter current password'
                                 aria-label='Enter password'
                                 aria-describedby='password'
                                 validationErrors={currPassErrors}
                              />
                           </InputGroup>
                           <InputGroup className='mb-3 mb-lg-4'>
                              <InputGroup.Text id='password'>
                                 <img
                                    src='images/icons/lock-gray.svg'
                                    alt='mail-svg-icon'
                                 />
                              </InputGroup.Text>
                              <InputField
                                 type='password'
                                 value={newPassword}
                                 onChange={onChangeNewPass}
                                 placeholder='Enter a new password'
                                 aria-label='Enter password'
                                 aria-describedby='password'
                                 validationErrors={newPassErrors}
                              />
                           </InputGroup>
                           <InputGroup className='mb-3 mb-lg-4'>
                              <InputGroup.Text id='password2'>
                                 <img
                                    src='images/icons/lock-gray.svg'
                                    alt='mail-svg-icon'
                                 />
                              </InputGroup.Text>
                              <InputField
                                 type='password'
                                 value={confirmPassword}
                                 onChange={onChangeConfirmPass}
                                 placeholder='Confirm new password'
                                 aria-label='Confirm password'
                                 aria-describedby='password2'
                                 validationErrors={confirmPassErrors}
                              />
                           </InputGroup>

                           <Button
                              type='submit'
                              varient='primary'
                              className='rounded'>
                              Update password
                           </Button>
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
   userState: userSelectors.selectUser,
   currentUser: userSelectors.selectCurrentUser,
   userToken: userSelectors.selectUserToken
});

export default connect(mapStateToProps)(ChangePassword);
