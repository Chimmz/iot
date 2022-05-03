import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { subDays } from 'date-fns'


// Calling redux here
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as portfolioSelectors from '../../../../redux/portfolio/portfolio-selectors';
import * as userSelectors from '../../../../redux/user/user-selectors';
import * as incidentSelectors from '../../../../redux/incident/incident-selectors';
import * as incidentUtils from '../../../../redux/incident/incident-dashboard-utils';
import { Collapse } from 'bootstrap';

//CSS style
import './Portfolioviews.scss';


function WaterLeakView(props) {
   const { currentPortfolio, userToken } = props;
   const startDate = subDays(new Date(), 1);
   const endDate = new Date();
   // Get the count between days
   const [incidents, setIncidents] = useState([]);
   const [filteredDataLoading, setIsFilteredDataLoading] = useState(false);
   const [updateSeconds, SetUpdateSeconds] = useState(0 * 1000);

   const loadIncidents = async () => {
      const makeRequest = () => {
         return incidentUtils.fetchActiveIncidents(
            currentPortfolio,
            startDate,
            endDate,
            userToken
         );
      };
      const res = incidentUtils.handleFilterLoadingAsync(
         makeRequest,
         setIsFilteredDataLoading
      );
      const incids = await res;
      setIncidents(incids);
   };

   // Initial it will be 0 seconds to get the first update and after then
   //refresh the component for every 1 mins to update the water leak card
   useEffect(() => {
      const interval = setInterval(() => {
         if (currentPortfolio) loadIncidents();
         SetUpdateSeconds(60 * 1000);
      }, updateSeconds);
      return () => {
         clearInterval(interval);
      };
   }, [startDate, endDate, currentPortfolio?.portfolioHeaderId]);

   const sortByStartTime = (incidents, sortOrder = 'ascend') => {
      if (!incidents?.length) return [];
      if (!sortOrder) return incidents;

      const sortedData = incidents?.sort((currRow, nextRow) => {
         const currStartTime = +new Date(currRow.startTime);
         const nextStartTime = +new Date(nextRow.startTime);

         if (sortOrder === 'ascend') {
            if (currStartTime < nextStartTime) return -1;
            return 1;
         }
         if (currStartTime < nextStartTime) return 1;
         return -1;
      });
      return sortedData;
   };
   var DynamicData = {}
   var PreviousDate = startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + (startDate.getDay())
   var TodayRecord = incidents.filter(item => item.displayName === "Leak" && item.startTime < PreviousDate)
   // this is to use for sorting by date
   var SortedRecord = sortByStartTime(TodayRecord, "ascend")
   var CorrectedTime = ""
   for (var i = 0; i < SortedRecord.length; i++) {
      var Data = SortedRecord[i]
      // required to split the timeonly
      const [number, period] = SortedRecord[i]["startTime"].split('T');
      // this is used to split the hours to change from 24 to 12 hrs
      const [hours, minutes, seconds] = period.split(":")
      if (hours >= 13) {
         const Updatehours = hours - 12
         CorrectedTime = Updatehours + ":" + minutes + " " + "PM"
      }
      else {
         CorrectedTime = hours + ":" + minutes + " " + "AM"
      }
      // Addd all the data inside it to make as dict.
      DynamicData[i] = { time: CorrectedTime, floorName: Data["floorName"], SensorName: Data["sensorName"], description: Data["description"] }
   }

   const DisplayData = (props) => {
      var DynamicPost = []
      const DynamicData = props.Data
      for (var Datas in DynamicData) {
         DynamicPost.push([
            <>
               <tr className='table-title'>
                  <td>{DynamicData[Datas]["floorName"]}</td>
                  <td className='text-end'>{DynamicData[Datas]["time"]}</td>
               </tr>
               <tr>
                  <td colSpan={2}>{DynamicData[Datas]["SensorName"]} / {DynamicData[Datas]["description"]} </td>
               </tr>
            </>

         ]);
      }
      return DynamicPost
   }
   // Incidents values passing here
   return (
      <>
         <div className='card dashboard-card'>
            <div className='card-header'>
               <div className='text-primary'><b>Water Leaks</b></div>
            </div>
            <div className='card-body'>
               <div className='d-flex justify-content-between px-3 py-2'>
                  <span className='h2'> {TodayRecord.length}</span>
                  <img src={process.env.PUBLIC_URL + '/images/dashboard/Water_Leaks_view.png'} />
               </div>
               <div className='table-wrapper-scroll-y thin-scrollbar mt-4 border-top ps-3'>
                  <table className='table table-hover'>
                     <thead>
                        <tr>
                           <th scope="col">Location</th>
                           <th scope="col" className='text-end'>Time</th>
                        </tr>
                     </thead>
                     <tbody>
                        <DisplayData Data={DynamicData} />
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </>
   );
}

const mapStateToProps = createStructuredSelector({
   currentPortfolio: portfolioSelectors.selectCurrentPortfolio,
   // incidents: incidentSelectors.selectIncidents,
   incidentsLoading: incidentSelectors.selectIncidentLoading,
   userToken: userSelectors.selectUserToken
});

const mapDispatchToProps = dispatch => ({
   // getIncidents: (token, portfolio, timePeriod) => {
   //    dispatch(
   //       incidentCreators.getIncidents(token, portfolio, timePeriod, {
   //          reduxSave: false
   //       })
   //    );
   // }
});

export default connect(mapStateToProps, mapDispatchToProps)(WaterLeakView);