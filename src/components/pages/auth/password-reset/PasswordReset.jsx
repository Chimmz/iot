import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Redux standard imports to connect components to redux state
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// Imports of redux state selectors, and action creators
import * as userSelectors from '../../../../redux/user/user-selectors';
import * as userCreators from '../../../../redux/user/user-action-creators';

// Hooks
import useInput from '../../../../hooks/useInput';
import useToggle from '../../../../hooks/useToggle';

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

function PasswordReset({ userState, dispatch }) {
   // To monitor when an email is sent
   const [emailSent, setEmailSent] = useState(false);

   const {
      inputValue: email,
      handleChange: onChangeEmail,
      runValidators: runEmailValidators,
      validationErrors: emailErrors,
      setValidationErrors: setValidationErrors,
      pushError: pushEmailError
   } = useInput({
      init: '',
      validators: [
         { isRequired: ['Please enter an email'] },
         { isEmail: ['Please enter a correct email'] }

         // Key name (Ex: 'isRequired', 'isEmail') must match a function name in /src/validators/inputValidator.js

         // The array elements will be passed as args to the matching function in the order that they're stated here
      ]
   });

   const sendEmail = () =>
      // Passing setEmailSent here will make the emailSent state to be changed
      dispatch(userCreators.resetPassword(email, pushEmailError, setEmailSent));

   const submitHandler = function (ev) {
      ev.preventDefault();

      // Run validators and get error-based validation messages
      const errors = runEmailValidators();

      if (errors.length) {
         // This causes the display of validation error
         setValidationErrors(errors);
         return;
      }
      // Upon validation passed...
      sendEmail();
   };

   return (
      <>
         <Spinner show={userState.isLoading}></Spinner>
         <main className="forgot__password auth__wrapper py-5 position-relative">
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
                        <h1 className="text-primary fw-600">
                           Recover my password
                        </h1>
                        <Form
                           className="mt-4 form__wrapp"
                           onSubmit={submitHandler}
                           noValidate
                        >
                           <Form.Label className="text-muted">
                              Enter your email to reset your password.
                           </Form.Label>
                           <InputGroup className="mb-3 mb-lg-4">
                              <InputGroup.Text id="email">
                                 <img
                                    src="images/icons/mail-gray.svg"
                                    alt="mail-svg-icon"
                                 />
                              </InputGroup.Text>

                              {/* InputField is a custom component (not a React-Bootstrap compon.) returning Form.Control & Form.Control.Feedback */}
                              <InputField
                                 type="email"
                                 value={email}
                                 onChange={onChangeEmail}
                                 placeholder="E-mail"
                                 aria-label="E-mail"
                                 aria-describedby="email"
                                 validationErrors={emailErrors}
                              />
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
                  <Col md="6">
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
            </Container>
            <p className="fs10 position-absolute start-50 translate-middle-x bottom-0">
               © Copyright 2022 | <Link to="/">Terms of Use</Link> |{' '}
               <Link to="/">Privacy Policy</Link>
            </p>

            {/* The email success modal */}
            <EmailSuccess emailSent={emailSent} resendEmail={sendEmail} />
         </main>
      </>
   );
}

const mapStateToProps = createStructuredSelector({
   userState: userSelectors.selectUser
});

export default connect(mapStateToProps)(PasswordReset);
