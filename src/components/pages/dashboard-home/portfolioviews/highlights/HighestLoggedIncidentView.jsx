import React from "react";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { differenceInDays, subDays } from 'date-fns';

// Barchart template
import BarChart from "../ChartTemplates/HighestBarchartTemplate";


// This will provide the Data to the UI
const RenderData = (props) => {
   const incidents = props;
   // This function is to get the count of each duplicate value and return the highest duplicate value count
   const GetCount = (props) => {
      const {keyType, OnlyLogged} = props;
      // count the duplicate values
      if (incidents.length > 0){
         const Count = OnlyLogged.reduce((acc, cur) => {
            const count =  acc[cur[keyType]] || 0;
            acc[cur[keyType]] =  count + 1   ;
            return acc;
         }, {})
         if (Count.length !== 0){
            // Get the highest value in the return of duplicate value count
            const highest = Object.keys(Count).reduce((a, b) => Count[a] > Count[b] ? a : b);
            return {highest, count: Count[highest]}
         }
         else{
            return {highest: null, count: null}
         }
      }
      else{
         return {highest: null, count: null}
      }
   }
   // Filter the logged incidents only
   const OnlyLogged = incidents.filter(item => item.incidentRecordHeaderName !== null);
   // Assign the data as count zero and update if only data is there.
   var RoomHighest = {highest: "", count: 0}
   var FloorHighest = {highest: "", count: 0}
   var SensorHighest = {highest: "", count: 0}
   // Get the each count and display it in the Graph
   if (OnlyLogged.length > 0){
      RoomHighest = GetCount({keyType:"roomName", OnlyLogged})
      FloorHighest = GetCount({keyType:"floorName", OnlyLogged})
      SensorHighest = GetCount({keyType:"sensorName", OnlyLogged})
   }
   return {RoomHighest, FloorHighest, SensorHighest}
}


const HighestLoggedView = (props) => {
   // Get the days count between
   const daysCount= differenceInDays(props.Dates["endDate"], props.Dates["startDate"]) + 1;
   // Only provide differenceInDays count data from the incidents
   var last30Days = props.incidents.filter(item => new Date(item.startTime) >= props.Dates["startDate"])
   // Fetch the incidents record from the dashboardHighlights and incidents data will come from IncidentsAPI.jsx
   const Data = RenderData(last30Days);
   // this below two is for the x and y axis label title
   const xAxisTitle = "Highlighted Location";
   const yAxisTitle = "Logged Incident (in number)";
   const {RoomHighest, FloorHighest, SensorHighest} = Data
  // const xAxisData= null
   const xAxislabel = [SensorHighest["highest"], RoomHighest["highest"], FloorHighest["highest"]]
   const yAxisData = [SensorHighest["count"], RoomHighest["count"], FloorHighest["count"]]
   // This is for adding the $ in the yaxis leave emtpy if not required any prefix
   const yAxisPrefix = {}
   
   return (
       <>
       <div className='card'>
         <div className='card-header'>
            <div className='text-primary'><b>Highest Logged Incidents</b></div>
         </div>
          <div className='card-body device-overview-charts'>
               <HighchartsReact highcharts={Highcharts} options={BarChart({ type: 'online'
            , xAxisTitle, yAxisTitle, xAxislabel, yAxisData, yAxisPrefix})}/>
         </div>
         <div className='card-footer border-top bg-white'>
            <div className='text-secondary'><b>{daysCount}</b> days count</div>
         </div>
      </div>
      </>
    )
}

export default HighestLoggedView