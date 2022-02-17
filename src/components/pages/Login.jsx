import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

// Redux standard imports
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// Imports of redux state selectors, and action creators
import * as userCreators from '../../redux/user/user-action-creators';
import * as userSelectors from '../../redux/user/user-selectors';

// Hooks
import useInput from '../../hooks/useInput';
import useModal from '../../hooks/useModal';

// External components
import Input from '../UI/Input';

// Standard bootstrap components
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button, Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import './Login.scss';
// dhanush.s@tonkabi.com
// ravi.shankar@tonkabi.com
// root123+

function Login({ isLoggedIn, dispatch }) {
   const [email, handleChangeEmail] = useInput('');
   const [password, handleChangePassword] = useInput('');

   const handleSubmit = ev => {
      ev.preventDefault();
      dispatch(userCreators.login(email.trim(), password.trim()));
   };

   if (isLoggedIn) return <Navigate replace to='/dashboard' />;
   return (
      <>
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
                        <InputGroup className='mb-3 mb-lg-4'>
                           <InputGroup.Text id='email'>
                              <img
                                 src='images/icons/mail-gray.svg'
                                 alt='mail-svg-icon'
                              />
                           </InputGroup.Text>
                           <Form.Control
                              type='email'
                              value={email}
                              onChange={handleChangeEmail}
                              placeholder='E-mail'
                              aria-label='E-mail'
                              aria-describedby='email'
                           />
                        </InputGroup>

                        <InputGroup className='mb-3 mb-lg-4'>
                           <InputGroup.Text id='email'>
                              <img
                                 src='images/icons/lock-gray.svg'
                                 alt='mail-svg-icon'
                              />
                           </InputGroup.Text>
                           <Form.Control
                              type='password'
                              value={password}
                              onChange={handleChangePassword}
                              placeholder='Password'
                              aria-label='Password'
                              aria-describedby='email'
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
                              <Form.Check type='checkbox' label='Remember me' />
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
   userAcceptedTermsAndCond: userSelectors.selectUserAccepted
});

export default connect(mapStateToProps)(Login);
