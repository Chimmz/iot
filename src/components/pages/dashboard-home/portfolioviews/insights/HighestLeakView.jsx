import React, {useState, useEffect} from "react";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { differenceInDays } from 'date-fns';


// Barchart template
import BarChart from "../ChartTemplates/HighestBarchartTemplate";


// This will provide the Data to the UI
const RenderData = (props) => {
   //const incidents = FetchIncidentData(props)
   const incidents = props
   // This function is to get the count of each duplicate value and return the highest duplicate value count
   const GetCount = (props) => {
      const {keyType, incidents} = props;
      // count the duplicate values
      if (incidents.length > 0){
         const Count = incidents.reduce((acc, cur) => {
            const count =  acc[cur[keyType]] || 0;
            acc[cur[keyType]] =  count + 1   ;
            return acc;
         }, {})
         // Get the highest value in the return of duplicate value count
         const highest = Object.keys(Count).reduce((a, b) => Count[a] > Count[b] ? a : b);
         return {highest, count: Count[highest]}
      }
      else{
         return {highest: null, count: null}
      }
   }
   //const OnlyLogged = incidents.filter(item => item.incidentRecordHeaderName !== null);
   const RoomHighest = GetCount({keyType:"roomName", incidents})
   const FloorHighest = GetCount({keyType:"floorName", incidents})
   const SensorHighest = GetCount({keyType:"sensorName", incidents})
   return {RoomHighest, FloorHighest, SensorHighest}
}


const HighestleakView = (props) => {
   //const Data = RenderData(props);
   // Get the days count between
   const daysCount= differenceInDays(props.Dates["endDate"], props.Dates["startDate"]) + 1;
   // this below two is for the x and y axis label title
   const xAxisTitle = "Highlighted Location";
   const yAxisTitle = "Water Cost (dollars)";
   //const {RoomHighest, FloorHighest, SensorHighest} = Data
  // const xAxisData= null
   const xAxislabel = ["Sensor", "Room", "Floor"]
   const yAxisData = [0, 0, 0]
   
   // This is for adding the $ in the yaxis
   const yAxisPrefix = {formatter: function (){ return '$' + this.axis.defaultLabelFormatter.call(this); }}

   return (
       <>
       <div className='card'>
         <div className='card-header'>
            <div className='text-primary'><b>Highest Leak Cost</b></div>
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



export default HighestleakView;