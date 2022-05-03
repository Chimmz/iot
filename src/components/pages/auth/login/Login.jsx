import React from 'react';
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

// Imports of utils
import * as browserUtils from '../../../../utils/browserUtils';

// External components
import InputField from '../../../UI/InputField';
import Spinner from '../../../UI/spinner/Spinner';

// Imports of Standard bootstrap components
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button, Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import './Login.scss';

function Login({ isLoggedIn, user, dispatch }) {
   const location = useLocation();
   const redirectTo = location.state?.redirectTo || '/dashboard';

   const navigate = useNavigate();

   // Get email & password browser cookie
   const [cookieEmail, cookiePassword] = browserUtils
      .getCookie(process.env.REACT_APP_REMEMBER_ME_COOKIE_KEY)
      ?.split('/');

   // The remeber-me checked state
   const [rememberMeChecked, toggleRememberMe] = useToggle(false);

   // The email input field. This field will be pre-filled with cookieEmail
   const {
      inputValue: email,
      handleChange: onChangeEmail,
      runValidators: runEmailValidators,
      validationErrors: emailErrors,
      setValidationErrors: setEmailErrors,
      pushError: pushEmailError
   } = useInput({
      init: cookieEmail, // This field will be pre-filled with cookieEmail.
      validators: [
         // Key names (Ex: 'isRequired', 'isEmail') must match function names in /src/validators/inputValidator.js. (Pls check this file)
         { isRequired: [] }, // Uses default isRequired validation msg.
         { isEmail: ['Please enter a valid email'] }
         // The array elements will be passed as args to the matching function in the order that they're stated here
      ]
   });

   // The password input field controller
   const {
      inputValue: password,
      handleChange: onChangePass,
      runValidators: runPasswordValidators,
      validationErrors: passwordErrors,
      setValidationErrors: setPasswordErrors,
      pushError: pushPasswordError
   } = useInput({
      init: cookiePassword, // This field will be pre-filled with cookiePassword.
      validators: [
         {
            isRequired: [] // Uses default isRequired validation msg
            // Key names (Ex: 'isRequired') must match a function name in /src/validators/inputValidator.js
         }
      ]
   });

   const redirect = () => navigate(redirectTo, { replace: true });

   const handleSubmit = function (ev) {
      ev.preventDefault();
      // runEmailValidators() returns an array of error-based validation messages
      const emailErrs = runEmailValidators();
      const passwordErrs = runPasswordValidators();
      console.log(emailErrs, passwordErrs);

      if (emailErrs.length || passwordErrs.length) {
         // These 'set' actions make the validation errors get displayed
         setEmailErrors(emailErrs);
         return setPasswordErrors(passwordErrs);
      }

      const loginDetails = { email: email.trim(), password: password.trim() };
      // Proceed to login if validation passed
      dispatch(
         userCreators.login(
            loginDetails,
            rememberMeChecked,
            pushEmailError,
            pushPasswordError, // Useful if there's a wrong password input
            redirect
         )
      );
   };

   if (isLoggedIn) return <Navigate to={redirectTo} />;
   return (
      <>
         {/* A loading spinner that will show while doing an API request */}
         <Spinner show={user.isLoading}></Spinner>

         <div className='auth__wrapper'>
            <Container fluid className='px-0'>
               <Row className='align-items-center g-0'>
                  <Col
                     lg={6}
                     className='banner__wrapp bg-primary d-none d-lg-block'>
                     <div className='text-center'>
                        <img
                           src='images/auth/login.gif'
                           className='img-fluid'
                           alt='main-auth-banner-image'
                        />
                     </div>
                  </Col>
                  <Col lg={6}>
                     <Form
                        className='form__wrapp mx-auto'
                        onSubmit={handleSubmit}
                        noValidate>
                        <p className='text-primary fs21'>
                           Welcome to insuretek
                        </p>
                        <h1 className='text-primary mb-5 fw-bold'>Log in</h1>
                        <InputGroup className='mb-5 mb-lg-4'>
                           <InputGroup.Text id='email'>
                              <img
                                 src='images/icons/mail-gray.svg'
                                 alt='mail-svg-icon'
                              />
                           </InputGroup.Text>

                           {/* InputField is a custom component (not a React-Bootstrap compon.) returning Form.Control & Form.Control.Feedback */}
                           <InputField
                              type='email'
                              value={email}
                              onChange={onChangeEmail}
                              placeholder='E-mail'
                              aria-label='E-mail'
                              aria-describedby='email'
                              validationErrors={emailErrors}
                           />
                        </InputGroup>

                        <InputGroup className='mb-5 mb-lg-4'>
                           <InputGroup.Text id='email'>
                              <img
                                 src='images/icons/lock-gray.svg'
                                 alt='mail-svg-icon'
                              />
                           </InputGroup.Text>

                           {/* InputField is a custom component (not a React-Bootstrap compon.) returning Form.Control & Form.Control.Feedback */}
                           <InputField
                              type='password'
                              value={password}
                              onChange={onChangePass}
                              placeholder='Password'
                              aria-label='Password'
                              aria-describedby='Password'
                              validationErrors={passwordErrors}
                           />
                        </InputGroup>
                        <Button
                           type='submit'
                           variant='primary'
                           className='btn btn-primary fw-bold w-100 d-block btn-lg'
                           disabled={!email || !password}>
                           Login
                        </Button>

                        <div className='d-flex justify-content-between align-items-center mt-3'>
                           <Form.Group controlId='formBasicCheckbox'>
                              <Form.Check
                                 type='checkbox'
                                 label='Remember me'
                                 onChange={toggleRememberMe}
                                 checked={rememberMeChecked}
                              />
                           </Form.Group>
                           <Link to='/forgot-password' className='fs18'>
                              Forgot Password
                           </Link>
                        </div>
                        <p className='fs10 copyright'>
                           © Copyright 2022 | <Link to='/'>Terms of Use</Link> |{' '}
                           <Link to='/'>Privacy Policy</Link>
                        </p>
                     </Form>
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
   user: userSelectors.selectUser
});

// Connect the component to redux
export default connect(mapStateToProps)(Login);
