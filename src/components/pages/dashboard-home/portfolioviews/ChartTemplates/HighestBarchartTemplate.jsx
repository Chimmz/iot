import React from "react";

// Template for the graph starts here 
const OverviewTemplate = {
    userConfig: {
       legend: {
          align: 'right',
          verticalAlign: 'middle',
          layout: 'vertical',
          itemStyle: {
             fontSize: 14,
             fontWeight: 400,
             color: '#525252',
             padding: 5
          },
          x: 0
       },
       chart: {
          type: 'column',
          height:  345,
   
       },
       title: { text: '' },
       credits: { enabled: false },
       plotOptions: {
          series: { enableMouseTracking: false },
          column:{
            showInLegend: false,
          }
       }
    }
 };


 const BarChart = props => {
    // Dynamic data will be added and template will be append
    const Data = {
       xAxis: {
         categories: props.xAxislabel,
         title: { text: props.xAxisTitle }
       },
       yAxis: {
         title: { text: props.yAxisTitle },
         labels: props.yAxisPrefix,
       },
       series: [
          {
             name: props.type,
             data: [
                {y: props.yAxisData[0], color: '#AAC9E3'},
                {y: props.yAxisData[1], color: '#27AAE1'},
                {y: props.yAxisData[2], color: '#AAC9E3'}
             ]
          }
       ],
       ...OverviewTemplate.userConfig
    };

    return Data;
 } 



export default BarChart;