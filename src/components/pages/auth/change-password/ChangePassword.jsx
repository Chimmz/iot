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
import Copyright from '../../../UI/footer/Copyright';

// External custom components
import Spinner from '../../../UI/spinner/Spinner';
import InputField from '../../../UI/InputField';

// Input validator
import * as inputValidators from '../../../../validators/inputValidator';

import './ChangePassword.scss';

function ChangePassword({
   currentUser,
   userToken,
   userState,
   dispatch,
   displayPasswordModal = false,
   handleToggleDisplayPasswordModal,
}) {
   const navigate = useNavigate();

   const {
      inputValue: currentPassword,
      handleChange: onChangeCurrPass,
      runValidators: runCurrPassValidators,
      validationErrors: currPassErrors,
      setValidationErrors: setCurrPassErrors,
      pushError: pushCurrPasswordError,
   } = useInput({
      init: '',
      validators: [
         {
            isRequired: ['This field is required'],
            // Key name (Ex: 'isRequired', 'isEmail') must match a function name in /src/validators/inputValidator.js

            // Array elements will be passed as args to the matching function in the order that they're stated here
         },
      ],
   });

   // prettier-ignore
   const {
      inputValue: newPassword,
      handleChange: onChangeNewPass,
      runValidators: runNewPassValidators,
      validationErrors: newPassErrors,
      setValidationErrors: setNewPassErrors
   } = useInput({
      init: '',
      validators: [
         { isRequired: ['This field is required'] },
         { minLength: [8, 'Password is less than 8 characters'] },
         { isNotSameAs: [currentPassword, 'New password should not be same as old password']},
         { containsUpperCase: [] },
         { containsDigit: [] },
         { isStrongPassword: ['Password is weak. Choose a strong password'] },
         { hasPasswordExceptions: ['Password must not contain %, -'] }
         // Key name (Ex: 'isRequired', 'minLength', etc) must match a function name in /src/validators/inputValidator.js

         // Array elements will be passed as args to the matching function in the order that they're stated here
      ]
   });

   const {
      inputValue: confirmPassword,
      handleChange: onChangeConfirmPass,
      runValidators: runConfirmPassValidators,
      validationErrors: confirmPassErrors,
      setValidationErrors: setConfirmPassErrors,
   } = useInput({
      init: '',
      validators: [
         { isRequired: ['This field is required'] },
         { isSameAs: [newPassword, 'Passwords do not match'] },
      ],
   });

   const clearAllValidatorErrors = () => {
      setCurrPassErrors([]);
      setNewPassErrors([]);
      setConfirmPassErrors([]);
   };

   const handleSubmit = ev => {
      ev.preventDefault();
      const errors = [
         runCurrPassValidators(),
         runNewPassValidators(),
         runConfirmPassValidators(),
      ];
      if (errors.flat().length) {
         [setCurrPassErrors, setNewPassErrors, setConfirmPassErrors].forEach(
            (set, i) => set(errors[i])
         );
         return;
      }

      // Proceed to change password
      const userDetails = {
         userId: currentUser.userId,
         currentPassword,
         newPassword,
         userToken,
      };

      dispatch(
         userCreators.changePassword(
            userDetails,
            pushCurrPasswordError,
            navigate,
            displayPasswordModal,
            handleToggleDisplayPasswordModal
         )
      );
      clearAllValidatorErrors();
   };

   return (
      <>
         <Spinner show={userState.isLoading}></Spinner>
         <main className="create__password__wrapp forgot__password auth__wrapper py-5 position-relative vh-100">
            <Container>
               <div className="h3 fw-normal">
                  Hi
                  <span className="text-primary">
                     {' '}
                     {currentUser.firstName} !
                  </span>
               </div>

               {/* space */}
               <div className="py-3 py-md-4 py-lg-5">&nbsp;</div>

               <Row className="align-items-center g-4 g-lg-5">
                  <Col md="6">
                     <div className="left__wrapp">
                        <h1 className="text-primary fw-bold ff-bronova">
                           Create a new password
                        </h1>
                        <Form
                           className="mt-4 form__wrapp"
                           onSubmit={handleSubmit}
                        >
                           <Form.Label className="text-gray fs16">
                              Type and confirm a secure new password for the
                              account.
                           </Form.Label>

                           {/* InputField is a custom component (not a React-Bootstrap compon.) returning Form.Control & Form.Control.Feedback */}
                           <InputGroup className="mb-3 mb-lg-4">
                              <InputField
                                 type="password"
                                 value={currentPassword}
                                 onChange={onChangeCurrPass}
                                 placeholder="Enter current password"
                                 aria-label="Enter password"
                                 aria-describedby="password"
                                 validationErrors={currPassErrors}
                                 className="input-icon-txt"
                              />
                              <InputGroup.Text id="password" className="input-icon">
                                 <img
                                    src="/images/icons/lock-gray.svg"
                                    alt="mail-svg-icon"
                                 />
                              </InputGroup.Text>
                           </InputGroup>

                           {/* InputField is a custom component (not a React-Bootstrap compon.) returning Form.Control & Form.Control.Feedback */}
                           <InputGroup className="mb-3 mb-lg-4">
                              <InputField
                                 type="password"
                                 value={newPassword}
                                 onChange={onChangeNewPass}
                                 placeholder="Enter a new password"
                                 aria-label="Enter password"
                                 aria-describedby="password"
                                 validationErrors={newPassErrors}
                                 className="input-icon-txt"
                              />
                              <InputGroup.Text id="password" className="input-icon">
                                 <img
                                    src="/images/icons/lock-gray.svg"
                                    alt="mail-svg-icon"
                                 />
                              </InputGroup.Text>
                           </InputGroup>

                           {/* InputField is a custom component returning Form.Control & Form.Control.Feedback */}
                           <InputGroup className="mb-3 mb-lg-4">
                              <InputField
                                 type="password"
                                 value={confirmPassword}
                                 onChange={onChangeConfirmPass}
                                 placeholder="Confirm new password"
                                 aria-label="Confirm password"
                                 aria-describedby="password2"
                                 validationErrors={confirmPassErrors}
                                 className="input-icon-txt"
                              />
                              <InputGroup.Text id="password2" className="input-icon">
                                 <img
                                    src="/images/icons/lock-gray.svg"
                                    alt="mail-svg-icon"
                                 />
                              </InputGroup.Text>
                           </InputGroup>

                           <div className="action-group">
                              <Button
                                 type="submit"
                                 varient="primary"
                                 className="rounded"
                              >
                                 {' '}
                                 Save
                                 {/* Update password */}
                              </Button>
                              {displayPasswordModal == true && (
                                 <Button
                                    onClick={handleToggleDisplayPasswordModal}
                                    variant="outline-secondary"
                                    className="rounded"
                                 >
                                    Cancel
                                 </Button>
                              )}
                           </div>
                        </Form>
                     </div>
                  </Col>
                  <Col md="6" id="password-change-info" className="d-none d-sm-block">
                     <img
                        src="/images/icons/lock-lg-gray-reset.svg"
                        alt="lock-svg-icon"
                     />

                     <p
                        className="fs12 mt-3 w-100 text-gray"
                        style={{ maxWidth: '360px' }}
                     >
                        <b>Please note: </b> <br />
                        The password should be at least 8 characters long. To
                        make it stronger, use upper and lower case letters,
                        numbers and symbols like ! \ “ ? $ ^ &).
                     </p>
                  </Col>
               </Row>
               <div className="position-absolute bottom-0 start-50">
                  <p className="fs12 text-center">
                     © Copyright 2022 InsureTek |{' '}
                     <span className="d-block d-md-inline-block">
                        All Rights Reserved |{' '}
                        <Link to="/privacy-policy">Privacy Policy</Link>
                     </span>
                  </p>
               </div>
            </Container>
            {/* <p className="fs10 copyright position-absolute start-50 translate-middle-x bottom-0">
               © Copyright 2022 | <Link to="/">Terms of Use</Link> |{' '}
               <Link to="/">Privacy Policy</Link>
            </p> */}
            {/* <Copyright /> */}
         </main>
      </>
   );
}

const mapStateToProps = createStructuredSelector({
   userState: userSelectors.selectUser,
   currentUser: userSelectors.selectCurrentUser,
   userToken: userSelectors.selectUserToken,
});

export default connect(mapStateToProps)(ChangePassword);