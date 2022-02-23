import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

// Imports of Standard bootstrap components
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button, Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

// Redux standard imports
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// Imports of redux state selectors, and action creators
import * as userCreators from '../../../../redux/user/user-action-creators';
import * as userSelectors from '../../../../redux/user/user-selectors';
import { flashAlert } from '../../../../redux/alert/alert-creators';

// Hooks
import useInput from '../../../../hooks/useInput';
import useToggle from '../../../../hooks/useToggle';

// Imports of utils
// import * as alertUtils from '../../redux/alert/alert-utils';
import * as browserUtils from '../../../../utils/browserUtils';

// External components
import InputField from '../../../UI/InputField';
import Spinner from '../../../UI/spinner/Spinner';

import './Login.scss';

// ravi.shankar@tonkabi.com

function Login({ isLoggedIn, user, dispatch }) {
   const [rememberMeChecked, toggleRememberMe] = useToggle(false);
   const [email, onChangeEmail, runEmailValidators, emailErrors] = useInput({
      init: '',
      validators: [{ isRequired: 'Username is required' }]
      // Key name ('isEmpty' in this case) must match a function name in /src/validators/inputValidator.js
   });

   const [password, onChangePass, runPasswordValidators, passwordErrors] =
      useInput({
         init: '',
         validators: [{ isRequired: 'Password is required' }]
         // Key name ('isEmpty' in this case) must match a function name in /src/validators/inputValidator.js
      });

   console.log(emailErrors, passwordErrors);

   const handleSubmit = function (ev) {
      ev.preventDefault();

      runEmailValidators();
      runPasswordValidators();

      if (emailErrors.length || passwordErrors.length) return;

      // On validation passed
      dispatch(
         userCreators.login(email.trim(), password.trim(), rememberMeChecked)
      );
   };

   if (isLoggedIn) return <Navigate replace to='/dashboard' />;
   return (
      <>
         <Spinner show-if={user.isLoading}></Spinner>
         <div className='auth__wrapper'>
            <Container fluid className='px-0'>
               <Row className='align-items-center g-0'>
                  <Col
                     lg={6}
                     className='banner__wrapp bg-primary d-none d-lg-block'>
                     <div className='text-center'>
                        <img
                           src='images/auth/loginn.gif'
                           className='img-fluid'
                           alt='main-auth-banner-image'
                        />
                     </div>
                  </Col>
                  <Col lg={6}>
                     <Form
                        className='form__wrapp mx-auto'
                        onSubmit={handleSubmit}>
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
                           {/* InputField is a custom component returning Form.Control & Form.Control.Feedback */}
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
                           {/* InputField is a custom component returning Form.Control & Form.Control.Feedback */}
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
                           className='btn btn-primary fw-bold w-100 d-block btn-lg'>
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

const mapStateToProps = createStructuredSelector({
   isLoggedIn: userSelectors.selectUserLoggedIn,
   userAcceptedTermsAndCond: userSelectors.selectUserAccepted,
   user: userSelectors.selectUser
});

export default connect(mapStateToProps)(Login);
