import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Standard bootstrap components
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import './EmailSuccess.scss';
import Spinner from '../../../../UI/spinner/Spinner';

// Stateless component
function EmailSuccess({ resendEmail, emailResetLoading }) {
   const navigate = useNavigate();
   const goToLogin = () => navigate('login', { replace: true });

   const handleResendEmail = () => resendEmail(goToLogin); // On successful re-emailing, go to login.

   return (
      <>
         <Spinner show={emailResetLoading} message="Resending email..." />
         <div className="email__verify__wrapp">
            <Container>
               <div className="content__card p-4 p-lg-5 d-block z-index">
                  <div className="back fs16 mb-5">
                     <Link to="/">
                        <i className="fa fa-angle-left fs-5 me-2"></i>
                     </Link>
                     <span>Back to </span>
                     <Link to="/login">Login</Link>
                  </div>
                  <img
                     src="images/insuretek-logo.png"
                     className="logo"
                     alt="logo"
                  />
                  <div className="input__box">
                     <h3 className="text-primary">
                        Email has been sent{' '}
                        <img src="images/icons/check-circle.svg" alt="" />
                     </h3>
                  </div>
                  <p>
                     Please check your inbox, and click in the received link to
                     reset password.
                  </p>
                  <p className="mb-0">
                     If you didn’t receive the link,{' '}
                     <Button
                        className="btnCloseModal"
                        onClick={handleResendEmail}
                     >
                        click here
                     </Button>
                     to resend the email.
                  </p>
               </div>
            </Container>
         </div>
      </>
   );
}

export default EmailSuccess;
