import React, { useState, useRef } from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// Redux selectors, action creators and utils
import { setUserAccepted } from '../../redux/user/user-action-creators';
import { selectUserStatusMsg } from '../../redux/user/user-selectors';
import { flashAlert } from '../../redux/alert/alert-creators';
import { Alert } from '../../redux/alert/alert-utils';

// Hooks
import { useToggle } from '../../hooks/useToggle';

// External components
import Form from './Form';
import './Modal.css';
import { useNavigate } from 'react-router-dom';

function Modal({ hidden, hideModal, uerStatusMsg, dispatch }) {
   console.log(uerStatusMsg);
   const checkboxRef = useRef();
   const navigate = useNavigate();

   if (hidden) return <></>;

   const handleChange = ev => {
      dispatch(setUserAccepted(checkboxRef.current.checked));
   };

   const handleSubmit = () => {
      const userAcceptedTerms = checkboxRef.current.checked;

      if (userAcceptedTerms) return hideModal();

      dispatch(
         flashAlert(
            new Alert(
               'Cannot proceed without accepting terms and conditions',
               'error'
            )
         )
      );

      // navigate('/dashboard');
   };

   return (
      <div className='dialog shadow-lg'>
         <div className='dialog-header'>
            Terms & Conditions
            <button
               type='button'
               className='btn-close'
               data-bs-dismiss='modal'
               aria-label='Close'
               onClick={hideModal}></button>
         </div>
         <div className='dialog-body'>
            <p>
               Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
               eiusmod tempor incididunt ut labore et dolore magna aliqua. Dui
               ut ornare lectus sit amet est placerat. Semper quis lectus nulla
               at volutpat diam. Urna nunc id cursus metu
            </p>
            <p>
               Onas pharetra convallis posuere. Sed tempus urna et pharetra
               pharetra massa massa ultricies mi. Magna fermentum iaculis eu non
               diam phasellus. Et leo duis ut diam quam nulla porttitor massa
               id. Sit amet consectetur adipiscing elit duis.
            </p>
            <p>
               nisl. Aliquam id diam maecenas ultricies mi eget mauris pharetra.
               Auctor elit sed vulputate mi sit. Cum sociis natoque penatibus et
               magnis. Quis imperdiet massa tincidunt nunc pulvinar sapien et.
               Mattis aliquam faucibus purus in massa.
            </p>
            <p>
               enatis a condimentum. Massa ultricies mi quis hendrerit dolor
               magna eget est lorem. Vel risus commodo viverra maecenas.
            </p>
         </div>
         <Form className='dialog-footer' submitHandler={handleSubmit}>
            <div className='i-accept'>
               <input
                  type='checkbox'
                  onChange={handleChange}
                  ref={checkboxRef}
               />
               <label htmlFor=''>I accept</label>
            </div>
            <button
               type='submit'
               className='btn btn-success btn-block shadow border-0 py-2 text-uppercase'
               style={{ fontSize: '1.7rem' }}>
               Continue
            </button>
         </Form>
      </div>
   );
}

const mapStateToProps = createStructuredSelector({
   uerStatusMsg: selectUserStatusMsg
});

export default connect(mapStateToProps)(Modal);
