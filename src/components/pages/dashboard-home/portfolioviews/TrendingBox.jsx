import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { subDays, differenceInDays } from 'date-fns'

// Redux
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as portfolioSelectors from '../../../../redux/portfolio/portfolio-selectors';
import * as userSelectors from '../../../../redux/user/user-selectors';
import * as incidentSelectors from '../../../../redux/incident/incident-selectors';
import * as incidentUtils from '../../../../redux/incident/incident-dashboard-utils';
import { isNumber } from 'highcharts';


function TrendingView(props) {
   const { currentPortfolio, userToken, Data } = props;
   const startDate = Data["startDate"]
   const endDate = Data["endDate"]
   // Get the count between days
   const getDaysCount = differenceInDays(endDate, startDate)
   const increaseStartDate = subDays(startDate, getDaysCount)
   const [incidents, setIncidents] = useState([]);
   const [filteredDataLoading, setIsFilteredDataLoading] = useState(false);

   const loadIncidents = async () => {
      const makeRequest = () => {
         return incidentUtils.fetchIncidents(
            currentPortfolio,
            increaseStartDate,
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

   useEffect(() => {
      if (currentPortfolio) loadIncidents();
   }, [startDate, endDate, currentPortfolio?.portfolioHeaderId])

   // Get the date
   var last30Days = incidents.filter(item => new Date(item.startTime) >= startDate)
   var previousto30Days = incidents.filter(item => new Date(item.startTime) >= increaseStartDate && new Date(item.startTime) <= startDate)
   console.log(previousto30Days)
   var PreviousLogInc = previousto30Days.filter(item => item.incidentRecordHeaderName !== null).length
   var LoggedIncidents = last30Days.filter(item => item.incidentRecordHeaderName !== null).length
   var WaterFloodCount = last30Days.filter(item => item.displayName === "Flood").length
   var PreviousWaterFld = previousto30Days.filter(item => item.displayName === "Flood").length
   var WaterLeakCount = last30Days.filter(item => item.displayName === "Leak").length
   var PreviousLeakCount = last30Days.filter(item => item.displayName === "Leak").length

   const GetPercentage = (props) => {
      const { Current, Previous } = props
      const CheckPostivie = Current - Previous
      var GetPercentagevalue = (Current / Previous) * 100
      GetPercentagevalue = Math.round(GetPercentagevalue)
      // This is for the Check negative or not.
      if (CheckPostivie < 0) {
         var returnValue = (
            <>
               <img src={process.env.PUBLIC_URL + '/images/dashboard/Orange_down_arrow.png'} />
               <span style={{ color: "#FFD580" }}>{GetPercentagevalue}%</span>
            </>)
      }
      else if (isNumber(CheckPostivie) === false) {
         GetPercentagevalue = "N/A";
         return GetPercentagevalue
      }
      else if (CheckPostivie === 0) {
         GetPercentagevalue = "N/A";
         return GetPercentagevalue
      }
      else if (Current === 0 || Previous === 0) {
         GetPercentagevalue = "N/A";
         return GetPercentagevalue
      }
      // this is for the positive showing percentage.
      else {
         var returnValue = (
            <>
               <img src={process.env.PUBLIC_URL + '/images/dashboard/Green_down_arrow.png'} />
               <span style={{ color: "green" }}>{GetPercentagevalue}%</span>
            </>
         )
      }
      return returnValue
   }

   // Incidents values passing here

   return (
      <div className='card dashboard-card'>
         <div className='card-header'>
            <div className='text-primary'><b>Trending</b></div>
         </div>
         <div className='card-body'>
            <div className='d-flex justify-content-between px-3 py-2'>
               <span className='h2'>{last30Days.length}</span>
               <img src={process.env.PUBLIC_URL + '/images/dashboard/trending-up.png'} />
            </div>
            <div className='table-wrapper-scroll-y thin-scrollbar mt-4 border-top ps-3'>
               <table className='table table-hover'>
                  <tbody>
                     <tr>
                        <td>Incidents</td>
                        <td>{last30Days.length}</td>
                        <td><img src={process.env.PUBLIC_URL + '/images/dashboard/Line Graph.png'} /></td>
                        <td>{GetPercentage({ Current: last30Days.length, Previous: previousto30Days.length })}</td>
                     </tr>
                     <tr>
                        <td>Logged Incident</td>
                        <td>{LoggedIncidents}</td>
                        <td><img src={process.env.PUBLIC_URL + '/images/dashboard/Line Graph.png'} /></td>
                        <td>{GetPercentage({ Current: LoggedIncidents, Previous: PreviousLogInc })}</td>
                     </tr>
                     <tr>
                        <td>Water Floods</td>
                        <td>{WaterFloodCount}</td>
                        <td><img src={process.env.PUBLIC_URL + '/images/dashboard/Line Graph.png'} /></td>
                        <td>{GetPercentage({ Current: WaterFloodCount, Previous: PreviousWaterFld })}</td>
                     </tr>
                     <tr>
                        <td>Water Leaks</td>
                        <td>{WaterLeakCount}</td>
                        <td><img src={process.env.PUBLIC_URL + '/images/dashboard/Line Graph.png'} /></td>
                        <td>{GetPercentage({ Current: WaterLeakCount, Previous: PreviousLeakCount })}</td>
                     </tr>
                     <tr>
                        <td>Water Usage</td>
                        <td></td>
                        <td></td>
                        <td>N/A</td>
                     </tr>
                     <tr>
                        <td>Cost of Water</td>
                        <td></td>
                        <td></td>
                        <td>N/A</td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(TrendingView);

