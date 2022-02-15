import React, { useState } from 'react';
import { useToggle } from '../../hooks/useToggle';
import './Modal.css';

function Modal({ hidden, hide }) {
   if (hidden) return <></>;

   return (
      <div className='dialog shadow-lg'>
         <div className='dialog-header'>
            Terms & Conditions{' '}
            <button
               type='button'
               className='btn-close'
               data-bs-dismiss='modal'
               aria-label='Close'
               onClick={hide}></button>
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
         <form action='' className='dialog-footer'>
            <div className='i-accept'>
               <input type='checkbox' />
               <label htmlFor=''>I accept</label>
            </div>
            <button
               className='btn btn-success btn-block shadow border-0 py-2 text-uppercase'
               style={{ fontSize: '1.7rem' }}>
               Continue
            </button>
         </form>
      </div>
   );
}

export default Modal;
