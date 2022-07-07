import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Redux standard imports to connect components to redux state
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// Imports of redux state selectors, and action creators
import * as userSelectors from '../../../../redux/user/user-selectors';
import * as userCreators from '../../../../redux/user/user-action-creators';
// Utils
import API from '../../../../utils/apiUtils';
// Hooks
import useInput from '../../../../hooks/useInput';
import useFetch from '../../../../hooks/useFetch';
// React-Boostrap imports
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

// Imports of external custom components
import InputField from '../../../UI/InputField';
import Spinner from '../../../UI/spinner/Spinner';
import EmailSuccess from './success/EmailSuccess';

import './PasswordReset.scss';

function PasswordReset() {
   const [emailSent, setEmailSent] = useState(false);
   const { sendRequest: sendEmailResetRequest, loading: emailResetLoading } =
      useFetch();

   const {
      inputValue: email,
      handleChange: onChangeEmail,
      runValidators: runEmailValidators,
      validationErrors: emailErrors,
      setValidationErrors: setEmailValidationErrors,
      pushError: pushEmailError,
   } = useInput({
      init: '',
      validators: [
         // Key name (Ex: 'isRequired', 'isEmail') must match a function name in /src/validators/inputValidator.js. The matching function will be executed.
         // The array elements will be passed as args to the matching function in the order that they're stated here
         { isRequired: ['Please enter an email'] },
         { isEmail: ['Please enter a correct email'] },
      ],
   });

   const sendEmail = successCallback => {
      const req = sendEmailResetRequest(API.resetPassword(email));
      req.then(res => {
         if (res?.message === 'EmailID not found')
            return pushEmailError('Sorry, this email is invalid');
         if (res?.message?.toLowerCase().includes('sent successfully')) {
            setEmailSent(true);
            successCallback?.();
            return;
         }
      });
   };

   const submitHandler = function (ev) {
      ev.preventDefault();
      const errors = runEmailValidators(); // 'errors' is an array of error objects if any error at all
      if (errors.length) return setEmailValidationErrors(errors); // Causes the display of validation error
      sendEmail(); // If validation passed
   };

   return (
      <>
         <Spinner show={emailResetLoading}></Spinner>
         <main className="forgot__password auth__wrapper position-relative vh-100 py-5">
            <Container>
               <div className="back">
                  <Link to="/">
                     <i className="fa fa-angle-left fs-5 me-2"></i>
                  </Link>
                  <span>Back to </span>
                  <Link to="/login">Login</Link>
               </div>

               {/* space */}
               <div className="py-3 py-md-4 py-lg-5">&nbsp;</div>

               <Row className="align-items-center g-4 g-lg-5">
                  <Col md="6">
                     <div className="left__wrapp">
                        <h1 className="text-primary p-0 m-0 fw-600">
                           Recover my password
                        </h1>
                        <Form
                           className="mt-4 form__wrapp"
                           onSubmit={submitHandler}
                           noValidate
                        >
                           <Form.Label>
                              Enter your email to reset your password.
                           </Form.Label>
                           <InputGroup className="mb-3 mb-lg-4">
                              {/* InputField is a custom component (not a React-Bootstrap compon.) returning Form.Control & Form.Control.Feedback */}
                              <InputField
                                 type="email"
                                 value={email}
                                 onChange={onChangeEmail}
                                 placeholder="E-mail"
                                 aria-label="E-mail"
                                 aria-describedby="email"
                                 validationErrors={emailErrors}
                                 className="input-icon-txt"
                              />
                              <InputGroup.Text
                                 id="email"
                                 className="input-icon"
                              >
                                 <img
                                    src="images/icons/mail-gray.svg"
                                    alt="mail-svg-icon"
                                 />
                              </InputGroup.Text>
                           </InputGroup>

                           <Button
                              variant="primary"
                              className="rounded"
                              type="submit"
                           >
                              Continue
                           </Button>
                        </Form>
                     </div>
                  </Col>
                  <Col md="6" className="d-none d-sm-block">
                     <img
                        src="images/icons/lock-lg-gray.svg"
                        alt="lock-svg-icon"
                     />
                     <p className="fs12 text-muted mb-1 mt-3">
                        You have come to the right place to reset a forgotten
                        password.
                     </p>
                     <p className="fs12 text-muted">
                        <b>Please Note: </b> <br />
                        Insuretek will send a link over your registered email
                        account, and link will expire in 15 minutes.
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

            {/* The email success modal */}
            {emailSent && (
               <EmailSuccess
                  emailSent={emailSent}
                  resendEmail={sendEmail}
                  emailResetLoading={emailResetLoading}
               />
            )}
         </main>
      </>
   );
}

const mapStateToProps = createStructuredSelector({
   userState: userSelectors.selectUser,
});

export default connect(mapStateToProps)(PasswordReset);
