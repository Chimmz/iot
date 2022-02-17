import React from 'react';
import { Link } from 'react-router-dom';

const ChangedPasswordSuccess = () => {
   return (
      <>
         <main className='success__wrapp d-flex justify-content-center align-items-center mh-100 position-relative'>
            <div className='content col-lg-5 text-center'>
               <img
                  src='images/icons/check-circle-lg.svg'
                  alt='check-circle-icon'
               />
               <h3 className='h3 ff-bronova text-primary my-4'>
                  Password Changed!
               </h3>
               <p className='text-gray'>
                  Your password has been changed successfully.
               </p>
               <Link
                  to='/login'
                  className='btn btn-primary mt-4 justify-content-center'
                  style={{ minWidth: '200px' }}>
                  Log In
               </Link>
            </div>
            <p className='fs10 copyright position-absolute start-50 translate-middle-x bottom-0 text-dark z-index'>
               © Copyright 2022 |<Link to='/'>Terms of Use</Link> |
               <Link to='/'>Privacy Policy</Link>
            </p>
         </main>
      </>
   );
};
export default ChangedPasswordSuccess;