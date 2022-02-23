import React from 'react';
import { Link } from 'react-router-dom';

// Standard bootstrap components
import Container from 'react-bootstrap/Container';

import './EmailSuccess.scss';

function EmailSuccess() {
   return (
      <>
         <main className='email__verify__wrapp bg-primary'>
            <Container>
               <div className='back' style={{ color: '#fff' }}>
                  <Link to='/' style={{ color: '#fff' }}>
                     <i className='fa fa-angle-left fs-5 me-2'></i>
                  </Link>
                  <span>Back to </span>
                  <Link to='/login' style={{ color: '#ffcf75' }}>
                     Login
                  </Link>
               </div>
               <div className='content__card p-4 p-lg-5 d-block z-index'>
                  <img
                     src='images/insuretek-logo.png'
                     className='logo'
                     alt='logo'
                  />
                  <div className='input__box'>
                     <h3 className='text-primary'>
                        Email has been sent{' '}
                        <img src='images/icons/check-circle.svg' alt='' />
                     </h3>
                  </div>
                  <Link to='/change-password'>Next page</Link>
                  <p>
                     Please check your inbox, and click in the received link to
                     reset password.
                  </p>
                  <p className='mb-0'>
                     If you didn’t receive the link,{' '}
                     <Link to='/forgot-password'>click here</Link> to resend the
                     again.
                  </p>
               </div>
            </Container>
            {/* -- Bottom Shape Image --- */}
            <img
               src='images/auth/bottom-shape.png'
               className='img-fluid position-absolute bottom-0 start-0'
               alt='shape-banner-image'
            />
            <p className='fs10 copyright position-absolute start-50 translate-middle-x bottom-0 text-dark z-index'>
               © Copyright 2022 |
               <Link to='/' className='text-dark'>
                  Terms of Use
               </Link>{' '}
               |
               <Link to='/' className='text-dark'>
                  Privacy Policy
               </Link>
            </p>
         </main>
      </>
   );
}

export default EmailSuccess;
