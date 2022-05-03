import React from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
// date-fns module used for the subtracting the days
import { subDays, addDays } from 'date-fns';

// This are the bootstrap modules for the date range based picker for the dashboard UI
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { Calendar4Week } from 'react-bootstrap-icons';

import PageHeader from '../../page-header/PageHeader';

// This are the portfolio pages which we will use for the dashboard each card category
// import DeviceList from '../../../../../graphs/userMaintanance'
import TrendingView from './portfolioviews/TrendingBox';
import DeviceGraph from './portfolioviews/DeviceView';
import IncVsLogView from './portfolioviews/IncidentVsLoggedView';
import WaterFloodView from './portfolioviews/WaterFloodCardview';
import WaterLeakView from './portfolioviews/WaterLeakCardView';
import ShutoffValue from './portfolioviews/ShutoffValueCardView';

function DashboardHome() {
   const Location = useLocation();
   // Added the default count as 30 days to showing on UI
   const DefaultSubDays = 30;
   const Dashboard = 2;
   // create a State hooks for storing the date updating the latest date coming from the UI
   const [UpdateDate, setUpdateDate] = useState({
      startDate: subDays(new Date(), DefaultSubDays),
      endDate: new Date()
   });
   const RangeValidation = props => {
      const { start, end } = props;
      console.log(start, end);
      if (end > addDays(new Date(), 1)) {
         window.alert('date range should not be greater');
      } else {
         setUpdateDate({ startDate: start, endDate: end });
      }
   };
   // this function is for displaying the calendar in the dashbard page
   const CreateCalendar = () => {
      // This is for the callback default function for the DateRangePicker
      const handleCallback = (start, end, label) => {
         //start._d and end._d is the key for getting the selected date.
         RangeValidation({ start: start._d, end: end._d });
      };
      return (
         <>
            <DateRangePicker
               initialSettings={UpdateDate}
               onCallback={handleCallback}>
               <input />
            </DateRangePicker>
         </>
      );
   };

   if (Dashboard === 1) {
      return (
         <>
            <div className='row g-4 border-bottom'>
               <div className='d-flex justify-content-between'>
                  <PageHeader location={Location} />
                  {/* <CreateCalendar>
                     <input style={{ width: '100%' }} />
                  </CreateCalendar> */}
                  {/* <DateRangePicker>
                     <button type="button" className="btn btn-light h3 px-4">
                        Today <Calendar4Week className='ms-3' />
                     </button>
                  </DateRangePicker> */}

               </div>
            </div>

            <div className='row g-4'>
               <div className='col'>
                  <div className='row'>
                     <div className='col-md-3'>
                        <DeviceGraph />
                        <br />
                     </div>
                     <div className='col-md-3'>
                        <ShutoffValue />
                     </div>
                     <div className='col-md-3'>
                        <WaterFloodView />
                     </div>
                     <div className='col-md-3'>
                        <WaterLeakView />
                     </div>
                  </div>
               </div>
            </div>
         </>
      );
   } else if (Dashboard === 2) {
      return (
         <>
            <div className="row g-4 border-bottom">
               <div className='d-flex justify-content-between'>
                  <PageHeader location={Location} />
                  {/* <CreateCalendar>
                     <input className='form-control form-control-lg' />
                  </CreateCalendar> */}
               </div>
            </div>
            <div className='row g-4'>
               <div className='col'>
                  <div className='row dash-widgets'>
                     <div className='col-md-6 col-lg-3'>
                        <DeviceGraph />
                     </div>
                     <div className='col-md-6 col-lg-3'>
                        <ShutoffValue />
                     </div>
                     <div className='col-md-6 col-lg-3'>
                        <WaterFloodView />
                     </div>
                     <div className='col-md-6 col-lg-3'>
                        <WaterLeakView />
                     </div>
                  </div>
               </div>
            </div>
         </>
      );
   }
}

export default DashboardHome;
