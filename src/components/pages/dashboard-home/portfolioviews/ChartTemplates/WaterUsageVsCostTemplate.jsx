import React from "react";

const WaterCostTemplate = {
   userConfig: {
      legend: {
         symbolRadius:0,
         symbolHeight:12,
         symbolWidth:20,
         itemStyle: {
            fontSize: 12,
            fontWeight: 400,
            color: '#525252',
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
         series: { 
            enableMouseTracking: true,
            grouping: false
          },
         column:{
           showInLegend: true,
         }
      }
   }
};

export const WaterCost = (props) => {
   // Dynamic data will be added and template will be append
   const Data = {
      xAxis: {
      categories: props.xAxislabel,
      title: { text: props.xAxisCostTitle }
      },
      yAxis: {
      title: { text: props.yAxisCostTitle },
      labels: props.yAxisCostPrefix,
      },
      series: [
         {
            name: 'Water Cost $',
            data: props.YWaterCost,
            color:'#27AAE1'
         },
         {
            type: 'column',
            name:"Leak Cost $",
            data: props.YLeakCost,
            color: "#97DC21"
          }
      ],
      ...WaterCostTemplate.userConfig
   };

   return Data;
 }



const WaterUsageTemplate = {
   userConfig: {
      legend: {
         itemStyle: {
            fontSize: 12,
            fontWeight: 400,
            color: '#525252',
            padding: 0
         },
         x: 0
      },
      chart: {
         height:  345,
      },
      title: { text: '' },
      credits: { enabled: false },
      plotOptions: {
         series: { 
            enableMouseTracking: true,  
            showInLegend: true 
         },
      }
   }
};


export const WaterUsage = (props) => {
   // Dynamic data will be added and template will be append
   const Data = {
      xAxis: {
      categories: props.xAxislabel,
      title: { text: props.xAxisUsageTitle }
      },
      yAxis: {
      title: { text: props.yAxisUsageTitle },
      labels: props.yAxisUsagePrefix,
      },
      series: [
         {
            name: "Water Gal",
            data: props.YWaterUsage,
            color:'#27AAE1'
         },
         {
            name: "Leak Gal",
            data: props.YLeakQty,
            color: "#97DC21"
         }
      ],
      ...WaterUsageTemplate.userConfig
   };

   return Data;
 }