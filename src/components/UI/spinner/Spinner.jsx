import React from 'react';
import LoadingSpinner from 'react-bootstrap/Spinner';
import './Spinner.scss';

const Spinner = function (props) {
   const { show, message = 'Loading. Please wait ...' } = props;

   if (!show) return <></>;
   return (
      <div className="loading-spinner">
         <LoadingSpinner animation="grow" variant="primary"></LoadingSpinner>
         <h3>{message}</h3>
      </div>
   );
};

export default Spinner;
