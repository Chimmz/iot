import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Redux standard imports to connect components to redux state
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// Imports of redux state selectors, and action creators
import * as userSelectors from '../../redux/user/user-selectors';
import * as userCreators from '../../redux/user/user-action-creators';
import { flashAlert } from '../../redux/alert/alert-creators';
import * as alertUtils from '../../redux/alert/alert-utils';

// Hooks
import useInput from '../../hooks/useInput';

// Boostrap imports
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

import Input from '../UI/Input';
import './ForgotPassword.scss';

function ForgotPassword({ dispatch }) {
   const [email, handleEmailChange] = useInput('');
   const navigate = useNavigate();

   const submitHandler = ev => {
      ev.preventDefault();

      if (email) return dispatch(userCreators.resetPassword(email, navigate));

      dispatch(
         flashAlert(new alertUtils.Alert('Please enter your email', 'error'))
      );
   };

   return (
      <>
         <main className='forgot__password auth__wrapper py-5 position-relative'>
            <Container>
               <div className='back'>
                  <Link to='/'>
                     <i className='fa fa-angle-left fs-5 me-2'></i>
                  </Link>
                  <span>Back to </span>
                  <Link to='/login'>Login</Link>
               </div>

               {/* space */}
               <div className='py-3 py-md-4 py-lg-5'>&nbsp;</div>

               <Row className='align-items-center g-4 g-lg-5'>
                  <Col md='6'>
                     <div className='left__wrapp'>
                        <h1 className='text-primary fw-600'>
                           Recover my password
                        </h1>
                        <Form
                           className='mt-4 form__wrapp'
                           onSubmit={submitHandler}>
                           <Form.Label className='text-muted'>
                              Enter your email to reset your password.
                           </Form.Label>
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
                                 onChange={handleEmailChange}
                                 placeholder='E-mail'
                                 aria-label='E-mail'
                                 aria-describedby='email'
                              />
                           </InputGroup>

                           <Button
                              variant='primary'
                              className='rounded'
                              type='submit'>
                              Continue
                           </Button>
                        </Form>
                     </div>
                  </Col>
                  <Col md='6'>
                     <img
                        src='images/icons/lock-lg-gray.svg'
                        alt='lock-svg-icon'
                     />
                     <p className='fs12 text-muted mb-1 mt-3'>
                        You have come to the right place to reset a forgotten
                        password.
                     </p>
                     <p className='fs12 text-muted'>
                        <b>Plaese Note: </b> <br />
                        Insuretek will send a link over your registered email
                        account, and link will expire in 15 minutes.
                     </p>
                  </Col>
               </Row>
            </Container>
            <p className='fs10 position-absolute start-50 translate-middle-x bottom-0'>
               © Copyright 2022 | <Link to='/'>Terms of Use</Link> |{' '}
               <Link to='/'>Privacy Policy</Link>
            </p>
         </main>
      </>
   );
}

// const mapStateToProps = createStructuredSelector({
// });

export default connect(null)(ForgotPassword);
