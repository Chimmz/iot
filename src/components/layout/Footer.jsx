import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
   return (
      <p className="fs12 copy__right">
      © Copyright 2022 InsureTek |{' '}
      <span className="d-block d-md-inline-block">
         All Rights Reserved |{' '}
         <Link to="/privacy-policy">Privacy Policy</Link>
      </span>
   </p>
   );
}

export default Footer;
