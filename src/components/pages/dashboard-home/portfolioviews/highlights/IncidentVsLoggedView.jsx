import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Accordion from 'react-bootstrap/Accordion';

import { subDays, differenceInDays } from 'date-fns';
import GetPercentage from './PercentageCalculator';

//CSS style
import '../Portfolioviews.scss';
import './highlightsCharts.scss';

function IncVsLogView(props) {
   const { Dates, incidents } = props;
   const startDate = Dates['startDate'];
   const endDate = Dates['endDate'];
   const getDaysCount = differenceInDays(endDate, startDate) + 1;
   const increaseStartDate = subDays(startDate, getDaysCount);
   // First it will default take last 30 days for this and in calendar change the data will get update
   // automatically based upon the date range
   // Current incidents filter and previous incidents filter
   var last30Days = incidents.filter(
      item => new Date(item.startTime) >= startDate
   );
   // Get the count for the incidents and previous incidents
   var IncCount = last30Days.length;
   // This is for count the logged incidents count current and previous.
   var LogIncCount = last30Days.filter(
      item => item.incidentRecordHeaderName !== null
   ).length;

   // This is for getting the floorname unique value
   const GetFloorDetails = [...new Map(last30Days.map(item =>[item["floorName"], item.floorName])).values()];
   var TempData = ""
   // This is to get the unique room name based on the floor name as category
   var ArrayTag = {}
   for (var z=0; z < GetFloorDetails.length; z++){
      TempData = last30Days.filter(item => item["floorName"] === GetFloorDetails[z])
      ArrayTag[GetFloorDetails[z]] = [...new Map(TempData.map(item =>[item["roomName"], item.roomName])).values()];
   }
   // this is to make the map of logged incidents and incidents count for each unique room.
   var GetEachCount  = {}
   var GetCount = ""
   var GetlggCount = ""
   var TempName = ""
   for (var firstArray in ArrayTag){
      for(var secondArr = 0; secondArr < ArrayTag[firstArray].length; secondArr++){
         // Get the count for the room and logged incidents of the room.
         GetCount = last30Days.filter(item => item["floorName"] === firstArray && item["roomName"] === ArrayTag[firstArray][secondArr]).length
         GetlggCount = last30Days.filter(item => item["floorName"] === firstArray && 
         item["roomName"] === ArrayTag[firstArray][secondArr] && item.incidentRecordHeaderName !== null ).length
         TempName = ArrayTag[firstArray][secondArr]
         GetEachCount[firstArray] = {...GetEachCount[firstArray], TempName:{}}
         GetEachCount[firstArray][TempName] = {inc: GetCount, lgg: GetlggCount}
      }
      // getting the TempName as empty key so removing that.
      delete GetEachCount[firstArray].TempName
   }

   // this is for sorting the data by lgg
   const sortArray = (type, Data) => {
      const types = {
         Name: 'Name',
         inc: 'inc',
         lgg: 'lgg',
      };
      const sortProperty = types[type];
      const sorted = [...Data].sort(
         (a, b) => b[sortProperty] - a[sortProperty]
      );
      return sorted;
   };

   // render data with sorting of high logged incident and display only 10 counts
   const RenderData = props => {
      var NewArray = [];
      var DynamicPost = [];

      // To create the proper format to sorting and showing the data in the UI
      for (var DyData in GetEachCount) {
         for (var InternalData in GetEachCount[DyData]) {
            NewArray.push({
               Name: DyData + ' ' + InternalData,
               ...GetEachCount[DyData][InternalData],
            });
         }
      }
      // Call the sorted array data
      var SortedLggData = sortArray('lgg', NewArray);
      // Just show only 10 highest logged incidents and when the sortedlggdata is loaded.
      if (SortedLggData.length > 0) {
         var totalCount = 10;
         // Condition is due to if the length of logged incidents is less than 10 means
         // it need to run the loop until the total count intsead of default 10 times.
         if (SortedLggData.length < 10) {
            totalCount = SortedLggData.length;
         }
         // Run N times if less then 10 or else cap at 10 counts.
         for (var count = 0; count < totalCount; count++) {
            DynamicPost.push([
               <tr>
                  <td>{SortedLggData[count]['Name']}</td>
                  <td className="text-center">{SortedLggData[count]['inc']}</td>
                  <td className="text-center">{SortedLggData[count]['lgg']}</td>
               </tr>,
            ]);
         }
      }
      return DynamicPost;
   };

   // const incidentPercent =

   const options = {
      chart: {
         type: 'bar',
         reflow: true,
         marginTop: 0,
         spacingTop: 0,
         spacingRight: 0,
         marginRight: 0,
         height: 150,
         width: 304
      },
      colors: ['#0073e6', '#aac9e3'],
      title: { text: '' },
      subtitle: { text: '' },
      xAxis: {
         categories: [''],
         title: { text: '' },
         labels: { enabled: false },
      },
      yAxis: {
         min: 0,
         title: { text: '' },
         visible: false,
         labels: { enabled: false },
         width: 150,
      },
      tooltip: { valueSuffix: ' counts' },
      plotOptions: {
         bar: {
            dataLabels: {
               enabled: true,
               overflow: 'none',
               crop: false,
            },
         },
      },
      legend: {
         enabled: true,
         symbolRadius: 0,
         symbolHeight: 12,
         symbolWidth: 20,
         itemStyle: {},
      },

      credits: { enabled: false },
      series: [
         {
            name: 'Logged',
            data: [LogIncCount],
            dataLabels: {
               enabled: true,
            },
         },
         {
            name: 'Incidents',
            data: [IncCount],
            dataLabels: {
               enabled: true,
            },
         },
      ],
   };

   // Incidents values passing here
   return (
      <>
         <div className="card dashboard-card">
            <div className="card-header">
               <div className="text-primary">
                  <b>Incidents vs Logged</b>
               </div>
            </div>
            <div className="card-body">
               <div className="per-0">
               </div>
               
               <div className="d-flex align-items-center justify-content-between px-3 py-2 flex-wrap">
                  <div style={{ flex: 1 }} className="tablehead-barchart">
                     <HighchartsReact
                        highcharts={Highcharts}
                        options={options}
                     />
                  </div>
               </div>
               <div className="table-wrapper-scroll-y thin-scrollbar">
                  <table className="table table-hover">
                     <thead>
                        <tr>
                           <th scope="col">Location</th>
                           <th scope="col"> incidents</th>
                           <th scope="col"> Logged incidents</th>
                        </tr>
                     </thead>
                     <tbody>
                        <RenderData/>
                     </tbody>
                  </table>
               </div>
            </div>
            <div className="card-footer bg-white">
               <b>{getDaysCount}</b> days count
            </div>
         </div>
      </>
   );
}

export default IncVsLogView;
