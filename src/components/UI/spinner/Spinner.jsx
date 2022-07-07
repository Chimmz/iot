import React from 'react';
import LoadingSpinner from 'react-bootstrap/Spinner';
import './Spinner.scss';

const Spinner = function (props) {
   const { show, message = 'Loading...', noContent } = props;

   if (!show) return <></>;
   return (
      <div className="loading-spinner" style={{ gap: '10px' }}>
         {noContent ? (
            <LoadingSpinner animation="border" size="md" />
         ) : (
            <>
               <LoadingSpinner animation="border" size="sm" />
               <h6>{message}</h6>
            </>
         )}
      </div>
   );
};

export default Spinner;
