import React from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectAllAlerts } from '../../redux/alert/alert-selectors';

import './Alert.css';
// import Alert from './Alert';

function Alerts({ alerts }) {
   console.log('All alerts: ', alerts);

   if (!alerts?.length) return <></>;

   return (
      <div className='alerts'>
         {alerts.map(alert => (
            <div key={alert.id} className={`alert ${alert.type}`}>
               {alert.msg}
            </div>
         ))}
      </div>
   );
}

const mapStateToProps = createStructuredSelector({
   alerts: selectAllAlerts
});

export default connect(mapStateToProps)(Alerts);
