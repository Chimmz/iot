import React from 'react';
import './Alert.css';

function Alert({ allAlerts }) {
   console.log(allAlerts);
   return (
      <div className={'alert hidden'}>Wrong user ID or pasword entered.</div>
   );
}

export default Alert;
