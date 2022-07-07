import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { subDays, differenceInDays } from 'date-fns';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as portfolioSelectors from '../../../../../redux/portfolio/portfolio-selectors';
import * as userSelectors from '../../../../../redux/user/user-selectors';

import './highlightsCharts.scss';

 // Used for sum the galon
const getSumByKey = (arr, key) => {
   return arr.reduce((accumulator, current) => accumulator + Number(current[key]),0);
};



/* end of the water cost API */
function TrendingView(props) {
   var CostPerGalon = 0.0132;
   var currentWaterUsage = 0, currentWaterCost = 0, PrevWaterUsage = 0, PrevWaterCost = 0
   const { Dates, incidents, WaterTrending } = props;
   const startDate = Dates['startDate'];
   const endDate = Dates['endDate'];
   // Get the count between days and add 1 to get the previous days same as match
   const getDaysCount = differenceInDays(endDate, startDate) + 1;
   const increaseStartDate = subDays(startDate, getDaysCount);
   if (WaterTrending.length > 0) {
         var CurrentData = WaterTrending.filter(
            item => item.dateTimeStamp >= startDate
         );
         // this is for the previous date range from current date range.
         var PreviousData = WaterTrending.filter(
            item => item.dateTimeStamp < startDate
         );
         currentWaterUsage = getSumByKey(CurrentData, 'galon').toFixed(2);
         currentWaterCost = (currentWaterUsage * CostPerGalon).toFixed(2);
         // This is to take the previous data galon sum and total water cost for percentage calculation.
         // Sum all the galon
         PrevWaterUsage = getSumByKey(PreviousData, 'galon').toFixed(2);
         // Add 0.20 cents as water per galon.
         PrevWaterCost = (PrevWaterUsage * CostPerGalon).toFixed(2);
      }

   // Get the record based on the start date.
   var last30Days = incidents.filter(
      item => new Date(item.startTime) >= startDate
   );
   var previousto30Days = incidents.filter(
      item =>
         new Date(item.startTime) >= increaseStartDate &&
         new Date(item.startTime) < startDate
   );
   var LoggedIncidents = last30Days.filter(
      item => item.incidentRecordHeaderName !== null
   ).length;
   var PreviousLogInc = previousto30Days.filter(
      item => item.incidentRecordHeaderName !== null
   ).length;
   var WaterFloodCount = last30Days.filter(
      item => item.displayName === 'Flood'
   ).length;
   var PreviousWaterFld = previousto30Days.filter(
      item => item.displayName === 'Flood'
   ).length;
   var WaterLeakCount = last30Days.filter(
      item => item.displayName === 'Leak'
   ).length;
   var PreviousLeakCount = last30Days.filter(
      item => item.displayName === 'Leak'
   ).length;

   // console.log('*****************************');
   // console.log('startDate : ', startDate);
   // console.log('endDate : ', endDate);
   // console.log('Previous startDate : ', increaseStartDate);
   // console.log('previous End Date : ', startDate);
   // console.log(last30Days);
   // console.log('------incidents-------');
   // console.log('Current :', last30Days.length);
   // console.log('Previous count: ', previousto30Days.length);
   // console.log('------LoggedIncidents-------');
   // console.log('Current :', LoggedIncidents);
   // console.log('Previous count: ', PreviousLogInc);
   // console.log('------LoggedIncidents-------');
   // console.log('Current :', LoggedIncidents);
   // console.log('Previous count: ', PreviousLogInc);
   // console.log('------WaterFlood-------');
   // console.log('Current :', WaterFloodCount);
   // console.log('Previous count: ', PreviousWaterFld);
   // console.log('------WaterLeak-------');
   // console.log('Current :', WaterLeakCount);
   // console.log('Previous count: ', PreviousLeakCount);
   // console.log('------Water usage-------');
   // console.log('Current :', currentWaterUsage);
   // console.log('Previous count: ', PrevWaterUsage);
   // console.log('------cost of water-------');
   // console.log('Current :', currentWaterCost);
   // console.log('Previous count: ', PrevWaterCost);
   // console.log('***************************************');

   // This is to generate the data for the graph.
   // will be attached under the series.
   const DynamicGraph = []
   // Disabling the label water usage and cost of water for graph issues
   // const labelName = ["Incidents", "Logged", "Water Floods", "Water Leaks", "Water Usage", "Cost of Water"]
   // const labelData = ["last30Days.length", "LoggedIncidents", "WaterFloodCount", "WaterLeakCount", "currentWaterUsage", "currentWaterCost"]
   const labelName = ["Incidents", "Logged", "Water Floods", "Water Leaks"]
   const labelData = ["last30Days.length", "LoggedIncidents", "WaterFloodCount", "WaterLeakCount"]
   
   for (var x = 0; x < labelName.length; x++){
      var xData = Math.round(eval(labelData[x]))
      DynamicGraph.push({
               name: labelName[x],
               data: [xData],
               dataLabels: { enabled: true },
            }
      )
   }

   const options = {
      chart: {
         type: 'bar',
         marginTop: 0,
         spacingTop: 0,
         spacingRight: 0,
         marginRight: 0,
         reflow: true,
         height: 240,
         width: 306
      },
      title:{text: ''},
      credits: { enabled: false },
      xAxis: {
         categories: [
            ''
         ],
         labels: {
            enabled: false,
         },
      },
      yAxis: {
         min: 0,
         allowDecimals: false,
         title: { text: null },
         visible: false,
      },
      legend: {
         enabled: true,
         symbolRadius: 0,
         symbolHeight: 12,
         symbolWidth: 20,
         itemStyle: {},
      },
      plotOptions: {
         bar: {
            dataLabels: {
               enabled: true,
               overflow: 'none',
               crop: false
            },
         },
      },

      series: DynamicGraph
   };
   
   // Incidents values passing here
   return (
      <div className="card dashboard-card">
         <div className="card-header">
            <div className="text-primary">
               <b>Trending</b>
            </div>
         </div>
         <div className="card-body">
            <div className="d-flex justify-content-between align-items-center px-3 py-2 flex-wrap">
               <div style={{ flex: 1 }} className="tablehead-barchart">
                  <HighchartsReact highcharts={Highcharts} options={options} />
               </div>
            </div>
            <div className="table-wrapper-scroll-y thin-scrollbar mt-4 border-top ps-3">
               <table className="table table-hover">
                  <thead>
                     <tr>
                        <th scope="col">Type</th>
                        <th scope="col">{getDaysCount} day(s)</th>
                        <th scope="col">Previous {getDaysCount} day(s)</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr>
                        <td>Incidents</td>
                        <td>{last30Days.length}</td>
                        <td>{previousto30Days.length}</td>
                     </tr>
                     <tr>
                        <td>Logged Incident</td>
                        <td>{LoggedIncidents}</td>
                        <td>{PreviousLogInc}</td>
                     </tr>
                     <tr>
                        <td>Water Floods</td>
                        <td>{WaterFloodCount}</td>
                        <td>{PreviousWaterFld}</td>
                     </tr>
                     <tr>
                        <td>Water Leaks</td>
                        <td>{WaterLeakCount}</td>
                        <td>{PreviousLeakCount}</td>
                     </tr>
                     {/* <tr>
                        <td>Water Usage</td>
                        <td>{currentWaterUsage} gal</td>
                        <td>{PrevWaterUsage} gal</td>
                     </tr>
                     <tr>
                        <td>Cost of Water</td>
                        <td>$ {currentWaterCost}</td>
                        <td>$ {PrevWaterCost}</td>
                     </tr> */}
                  </tbody>
               </table>
            </div>
         </div>
         <div className="card-footer bg-white">
            <b>{getDaysCount}</b> days count
         </div>
      </div>
   );
}

const mapStateToProps = () =>
   createStructuredSelector({
      currentPortfolio: portfolioSelectors.selectCurrentPortfolio,
      userToken: userSelectors.selectUserToken,
      roles: userSelectors.userRoles,
   });

export default connect(mapStateToProps)(TrendingView);
