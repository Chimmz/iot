import React, { useEffect } from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
// date-fns module used for the subtracting the days
import { subDays, addDays } from 'date-fns';

// This are the bootstrap modules for the date range based picker for the dashboard UI
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { Calendar4Week } from 'react-bootstrap-icons';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as portfolioSelectors from '../../../redux/portfolio/portfolio-selectors';
import * as userSelectors from '../../../redux/user/user-selectors';

import PageHeader from '../../page-header/PageHeader';

import GetActiveIncidents from './portfolioviews/overview/ActiveIncidentsAPI';

// This are the portfolio pages which we will use for the dashboard each card category
// import DeviceList from '../../../../../graphs/userMaintanance'
import DeviceGraph from './portfolioviews/overview/DeviceView';
import SuppressedDevice from './portfolioviews/overview/suppressDeviceView';
import WaterFloodView from './portfolioviews/overview/WaterFloodCardview';
import WaterLeakView from './portfolioviews/overview/WaterLeakCardView';
import ShutoffValue from './portfolioviews/overview/ShutoffValueCardView';

function DashboardHome(props) {
   const Location = useLocation();

   // This is to call the active incidents API 
   var incidents = GetActiveIncidents(props)

   // Get the roles from the redux store and check the device state
   // Filter the role based on view and render whether manager, maintenence or portfolio
   const GetViewRole = props.roles.filter(item => item.roleType === "VIEW")
   let dashboard = GetViewRole?.[0]["code"];
   if (dashboard === "MAINTENANCE") {
      return (
         <>
            <div className="row g-4">
               <div className='d-flex justify-content-between'>
                  <PageHeader location={Location} />
               </div>
            </div>
            <div className='row dash-widgets g-4'>
               <div className='col-md-5'>
                  <DeviceGraph />
               </div>
               <div className='col-md-5'>
                  <SuppressedDevice />
               </div>
            </div>
            <div className='row dash-widgets g-4'>
               <div className='col-md-4'>
                  <WaterFloodView incidents={incidents} />
               </div>
               <div className='col-md-4'>
                  <WaterLeakView incidents={incidents} />
               </div>
               <div className='col-md-4'>
                  <ShutoffValue incidents={incidents} />
               </div>
            </div>
         </>
      );
   } else if (dashboard === "MANAGER") {
      return (
         <>
            <div className="row g-4">
               <div className='d-flex justify-content-between'>
                  <PageHeader location={Location} />
               </div>
            </div>
            <div className='row dash-widgets g-4'>
               <div className='col-md-5'>
                  <DeviceGraph />
               </div>
               <div className='col-md-5'>
                  <SuppressedDevice />
               </div>
            </div>
            <div className='row dash-widgets g-4'>
               <div className='col-md-4'>
                  <WaterFloodView incidents={incidents} />
               </div>
               <div className='col-md-4'>
                  <WaterLeakView incidents={incidents} />
               </div>
               <div className='col-md-4'>
                  <ShutoffValue incidents={incidents} />
               </div>
            </div>
         </>
      );
   }
}

const mapStateToProps = createStructuredSelector({
   currentPortfolio: portfolioSelectors.selectCurrentPortfolio,
   userToken: userSelectors.selectUserToken,
   roles: userSelectors.userRoles

});

export default connect(mapStateToProps)(DashboardHome);
