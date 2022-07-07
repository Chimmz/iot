import React, { useState, useEffect } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
// Redux standard imports
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// Imports of redux state selectors, and action creators
import * as userCreators from '../../../../redux/user/user-action-creators';
import * as userSelectors from '../../../../redux/user/user-selectors';
// Hooks
import useInput from '../../../../hooks/useInput';
import useToggle from '../../../../hooks/useToggle';
import useCounter from '../../../../hooks/useCounter';
// Imports of utils
import * as browserUtils from '../../../../utils/browserUtils';
import { loginValidators, MAX_LOGIN_ATTEMPTS } from './config';
// External components
import InputField from '../../../UI/InputField';
import Spinner from '../../../UI/spinner/Spinner';
import Footer from '../../../layout/Footer';
// Standard bootstrap imports
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button, Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';
import './Login.scss';
// import useTimeout from '../../../../hooks/useTimeout';

const getNextLoginDate = () => new Date(new Date() + 30 * 60 * 1000);

function Login({ isLoggedIn, user, dispatch }) {
   const [location, navigate] = [useLocation(), useNavigate()];
   const redirectTo = location.state?.redirectTo || '/dashboard';
   // The remeber-me checked state
   const [rememberMe, toggleRememberMe] = useToggle(false);
   // Get email & password browser cookie
   const [cookieEmail, cookiePassword] = browserUtils
      .getCookie(process.env.REACT_APP_REMEMBER_ME_COOKIE_KEY)
      ?.split('/');

   const [countDown, setCountDown] = useState({});

   const {
      count: loginAttemptsCount,
      advanceCounter: advanceLoginAttemptsCounter,
      resetCounter: resetLoginAttemptsCount,
   } = useCounter({
      init: 0,
      limit: MAX_LOGIN_ATTEMPTS,
      // onReachLimit: window.alert,
   });

   useEffect(() => {
      const usedMaxAttempts = loginAttemptsCount >= MAX_LOGIN_ATTEMPTS;
      if (usedMaxAttempts) return;

      // const timer = setInterval(() => {
      //    console.log('Running every sec now');
      //    const timeLeft = +getNextLoginDate() - Date.now();
      //    console.log('timeLeft: ', timeLeft);

      //    const mins = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      //    const secs = Math.floor((timeLeft % (1000 * 60)) / 1000);
      //    console.log('mins, secs: ', mins, secs);

      //    setCountDown(prevState => ({
      //       ...prevState,
      //       mins: mins.toString().padStart(2, '0'),
      //       secs: secs.toString().padStart(2, '0'),
      //    }));
      // }, 1000);

      // return () => clearInterval(timer);
   }, [loginAttemptsCount]);
   // const {} = useTimeout({
   //    millisecs: , onTimeout:
   // })

   // The email input field. This field will be pre-filled with cookieEmail
   const {
      inputValue: email,
      handleChange: onChangeEmail,
      runValidators: runEmailValidators,
      validationErrors: emailErrors,
      setValidationErrors: setEmailErrors,
      pushError: pushEmailError,
   } = useInput({
      init: cookieEmail, // This field will be pre-filled with cookieEmail.
      validators: [...loginValidators.email],
   });

   // The password input field controller
   const {
      inputValue: password,
      handleChange: handleChangePassword,
      runValidators: runPasswordValidators,
      validationErrors: passwordErrors,
      setValidationErrors: setPasswordErrors,
      pushError: pushPasswordError,
   } = useInput({
      init: cookiePassword, // This field will be pre-filled with cookiePassword.
      validators: [...loginValidators.password],
   });

   const redirect = () => navigate(redirectTo, { replace: true });

   const handleSubmit = function (ev) {
      ev.preventDefault();
      const errors = [runEmailValidators(), runPasswordValidators()]; // Array of validation errors

      if (errors.flat().length) {
         advanceLoginAttemptsCounter();
         [setEmailErrors, setPasswordErrors].forEach((set, i) => {
            set(errors[i]);
         });
         return;
      }
      // Proceed to login if validation passed
      dispatch(
         userCreators.login({
            loginDetails: { email: email.trim(), password: password.trim() },
            rememberMe,
            pushEmailError,
            pushPasswordError, // Useful if there's a wrong password input
            redirect,
            advanceLoginAttemptsCounter,
            resetLoginAttemptsCount,
         })
      );
   };
   // const attemptsRemaining = loginAttemptsCount <= MAX_LOGIN_ATTEMPTS;

   if (isLoggedIn) return <Navigate to={redirectTo} />;
   return (
      <>
         {/* A loading spinner that will show while doing an API request */}
         <Spinner show={user.isLoading}></Spinner>
         <div className="auth__wrapper">
            <Container fluid className="px-0">
               <Row className="align-items-center g-0">
                  <Col
                     lg={6}
                     className="banner__wrapp bg-primary d-none d-lg-block"
                  >
                     <div className="text-center">
                        <img
                           src="images/auth/login.gif"
                           className="img-fluid"
                           alt="main-auth-banner-image"
                        />
                     </div>
                  </Col>
                  <Col lg={6}>
                     <div className="d-flex justify-content-center align-items-center vh-block">
                        {loginAttemptsCount >= MAX_LOGIN_ATTEMPTS && (
                           <Alert variant="warning">
                              Your next login attempt will be after{' '}
                              <b>
                                 {countDown.mins}:{countDown.secs}
                              </b>
                           </Alert>
                        )}
                        <Form
                           className="form__wrapp mx-auto"
                           onSubmit={handleSubmit}
                           noValidate
                        >
                           <p className="text-primary fs21">
                              Welcome to insuretek
                           </p>
                           <h1 className="text-primary my-4 fw-bold">Login</h1>
                           <InputGroup className="mb-4 mb-lg-4 position-relative">
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
                              <InputGroup.Text id="email" className="input-icon">
                                 <img
                                    src="images/icons/mail-gray.svg"
                                    alt="mail-svg-icon"
                                 />
                              </InputGroup.Text>
                           </InputGroup>

                           <InputGroup className="mb-4 mb-lg-4">
                              {/* InputField is a custom component (not a React-Bootstrap compon.) returning Form.Control & Form.Control.Feedback */}
                              <InputField
                                 type="password"
                                 value={password}
                                 onChange={handleChangePassword}
                                 placeholder="Password"
                                 aria-label="Password"
                                 aria-describedby="Password"
                                 validationErrors={passwordErrors}
                                 className="input-icon-txt"
                              />
                              <InputGroup.Text id="email" className="input-icon">
                                 <img
                                    src="images/icons/lock-gray.svg"
                                    alt="mail-svg-icon"
                                 />
                              </InputGroup.Text>
                           </InputGroup>
                           <Button
                              type="submit"
                              variant="primary"
                              className="btn btn-primary fw-bold w-100 d-block btn-lg"
                              disabled={!email || !password}
                           >
                              Login
                           </Button>

                           <div className="d-flex justify-content-between align-items-center mt-3">
                              <Form.Group controlId="formBasicCheckbox d-flex align-items-center">
                                 <Form.Check
                                    type="checkbox"
                                    label="Remember me"
                                    onChange={toggleRememberMe}
                                    checked={rememberMe}
                                    className="fs16 d-flex justify-item-center"
                                 />
                              </Form.Group>
                              <Link to="/forgot-password" className="fs16 form-check-label">
                                 Forgot Password ?
                              </Link>
                           </div>
                        </Form>
                        {/* <Footer /> */}
                     </div>
                     <p className="fs12 copyright">
                        © Copyright 2022 InsureTek |{' '}
                        <span className="d-block d-md-inline-block">
                           All Rights Reserved |{' '}
                           <Link to="/privacy-policy">Privacy Policy</Link>
                        </span>
                     </p>
                  </Col>
               </Row>
            </Container>
         </div>
      </>
   );
}

// Getting redux state pieces that will be made as props
const mapStateToProps = createStructuredSelector({
   isLoggedIn: userSelectors.selectUserLoggedIn,
   user: userSelectors.selectUser,
});

// Connect the component to redux
export default connect(mapStateToProps)(Login);
