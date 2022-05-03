import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Stateless component
function IncidentFormSuccess() {
   const { state } = useLocation();
   const navigate = useNavigate();

   // If page was loaded maybe by just entering the URL in the browser and not by truly changing password, go back
   if (!state?.success) navigate(-1);

   return (
      <>
         <main className="success__wrapp d-flex justify-content-center align-items-center mh-100 position-relative">
            <div className="content col-lg-5 text-center">
               <img
                  src="/images/icons/check-circle-lg.svg"
                  alt="check-circle-icon"
               />
               <h3 className="h3 ff-bronova text-primary my-4">
                  Submitted Successfully
               </h3>
               <p className="text-gray">
                  Thank you. Your information was successfully submitted
               </p>
            </div>
            <p className="fs10 copyright position-absolute start-50 translate-middle-x bottom-0 text-dark z-index">
               © Copyright 2022 |<Link to="/">Terms of Use</Link> |
               <Link to="/">Privacy Policy</Link>
            </p>
         </main>
      </>
   );
}

export default IncidentFormSuccess;
