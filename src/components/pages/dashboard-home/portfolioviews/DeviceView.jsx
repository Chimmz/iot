import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// Calling redux here
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as portfolioSelectors from '../../../../redux/portfolio/portfolio-selectors';
import * as userSelectors from '../../../../redux/user/user-selectors';
import * as incidentSelectors from '../../../../redux/incident/incident-selectors';
//import * as incidentUtils from '../../../../redux/incident/incident-dashboard-utils';
import * as deviceutils from '../../../../redux/iot-devices/iotDevice-utils';

// This trendingView function is for to fetch the data from the API and populate here.
function DeviceView(props) {
   // Here the startDate and endDate is already unpaked from Data
   const { currentPortfolio, userToken, Data } = props;
   //const [incidents, setIncidents] = useState([]);
   const [Devices, setDevices] = useState([]);
   const [filteredDataLoading, setIsFilteredDataLoading] = useState(false);

   const LoadDevices = async () => {
      const makeRequest = () => {
         return deviceutils.fetchIotDevices(currentPortfolio, userToken);
      };
      const res = deviceutils.handleFilterLoadingAsync(
         makeRequest,
         setIsFilteredDataLoading
      );
      const incids = await res;
      setDevices(incids);
   };

   // this useEffect will check if there is any date change happens in the calendar then
   // call the load incidents with new date and set the currentDatelst
   useEffect(() => {
      if (currentPortfolio) LoadDevices();
   }, [currentPortfolio?.portfolioHeaderId]);

   // Unknown devices are not included under the device overview list
   const totalDevices = Devices.filter(d => d.displayStatus !== 'Unknown');
   const online = totalDevices.filter(d => d.displayStatus === 'Online').length;
   const offline = totalDevices.filter(
      d => d.displayStatus === 'Offline'
   ).length;

   const NeverConnected = totalDevices.filter(
      d => d.displayStatus === 'Never connected'
   ).length;

   const Datas = [totalDevices.length, online, offline, NeverConnected];
   return Datas;
}

// This customized template is for the pie chart overview location. called by function PieChart => Data
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
         type: 'pie',
         backgroundColor: null,
         margin: [0, 0, 0, 0],
         spacing: [0, 0, 0, 0],
         height:  (20 / 18 * 100) + '%',
         width: 120,
      },
      title: { text: '' },
      credits: { enabled: false },
      plotOptions: {
         series: { enableMouseTracking: false },
         pie: {
            size: 120,
            showInLegend: false,
            innerSize: '80%',
            dataLabels: {
               enabled: false,
               distance: 0,
               color: 'white',
               style: { fontweight: 'bold', fontsize: 50 }
            }
         }
      }
   }
};

// This is for pie chart graph in the dashboard portolio used for devies overview
const PieChart = props => {
   // Dynamic data will be added and template will be append
   const Data = {
      subtitle: { text: props.text, style: { color: 'red' }, y: 70 },
      series: [
         {
            name: props.type,
            data: [
               { y: 100, color: '#D3D3D3' },
               { y: props.Value, color: 'gray' }
            ]
         }
      ],
      ...OverviewTemplate.userConfig
   };

   // Change the color for the text and graph plot
   switch (props.type) {
      case 'online':
         Data.subtitle.style.color = '#32CD32';
         Data.series[0].data[1].color = '#32CD32';
         break;
      case 'offline':
         Data.subtitle.style.color = 'red';
         Data.series[0].data[1].color = 'red';
         break;
      case 'NeverConnected':
         Data.subtitle.style.color = 'gray';
         Data.series[0].data[1].color = 'gray';
         break;
   }
   return Data;
};

const DeviceGraph = props => {
   // passing the props with incidents as dummy list as per workflow
   const Datas = DeviceView({ ...props });
   // Datas => will come as total incidents Datas[0], online: Datas[1], offline Datas[2], never connectedDatas[3]
   // formula for the each category multiple by 100 to get the ratio.
   const Data = {
      online: (Datas[1] / Datas[0]) * 100,
      offline: (Datas[2] / Datas[0]) * 100,
      NotConnected: (Datas[3] / Datas[0]) * 100
   };
   const OnlineStatus = '<b>' + Datas[1] + '</b><br> online';
   const OfflineStatus = '<b>' + Datas[2] + '</b><br>offline';
   const NotConnected = '<b>' + Datas[3] + '</b> never <br> connected';
   // Return the highchart to the DashboardHome.jsx
   return (
      <div className='card'>
         <div className='card-header'>
            <div className='text-primary'><b>Device overview</b></div>
         </div>
         <div className='card-body device-overview-charts'>
            <div className='d-flex flex-wrap align-items-center'>
               <HighchartsReact
                  highcharts={Highcharts}
                  options={PieChart({
                     type: 'online',
                     Value: Data['online'],
                     text: OnlineStatus
                  })}
               />
               <HighchartsReact
                  highcharts={Highcharts}
                  options={PieChart({
                     type: 'offline',
                     Value: Data['offline'],
                     text: OfflineStatus
                  })}
               />
               <HighchartsReact
                  highcharts={Highcharts}
                  options={PieChart({
                     type: 'NeverConnected',
                     Value: Data['NotConnected'],
                     text: NotConnected
                  })}
               />
            </div>
            <div class="card-footer">
               <b>{Datas[0]}</b> device count
            </div>
         </div>
         {/* <hr style={{ width: '100%', color: 'gray', size: '10' }} noshade />
         <div>{Datas[0]} device count</div> */}
      </div>
   );
};

const mapStateToProps = createStructuredSelector({
   currentPortfolio: portfolioSelectors.selectCurrentPortfolio,
   userToken: userSelectors.selectUserToken
});

export default connect(mapStateToProps)(DeviceGraph);
