import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// Calling redux here
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as portfolioSelectors from '../../../../../redux/portfolio/portfolio-selectors';
import * as userSelectors from '../../../../../redux/user/user-selectors';
import * as incidentSelectors from '../../../../../redux/incident/incident-selectors';
import * as deviceutils from '../../../../../redux/iot-devices/iotDevice-utils';

// this is calling from the DashboardHome.jsx file
// This suppressedDevice function is for to fetch the data from the API and populate here.


const FetchSuppressedDevice = (props) =>{
    const { currentPortfolio, userToken, Data } = props;
    const [Suppressed, setSuppressed] = useState([]);
    const [filteredDataLoading, setIsFilteredDataLoading] = useState(false);

   // This is to fetch the data from the API 
   const LoadDevices = async () => {
       // Make request to the suppressed device url
       const makeRequest = () => {
            return deviceutils.fetchSuppressedDevice(currentPortfolio, userToken);
        };
        const res = deviceutils.handleFilterLoadingAsync(
        makeRequest,
        setIsFilteredDataLoading
        );
        const incids = await res;
        setSuppressed(incids);
    };
 
   // This is the useEffect will be fecth only one time when the page fot loaded
   useEffect(() => {
    if (currentPortfolio) LoadDevices();
    }, [currentPortfolio?.portfolioHeaderId]);

    console.log(Suppressed)
    // Unknown devices are not included under the device overview list
    const Flood = Suppressed.filter(d => d.name === 'Flood');
    const Leak = Suppressed.filter(d => d.name === 'Leak');
    var totalDeviceCount = 0;
    var Datas = ['0', '0', '0'];
    if (Suppressed.length > 0) {
        if (Flood.length > 0) {
            totalDeviceCount = Flood[0]['totalCount'] + totalDeviceCount;
            Datas[1] = Flood[0]['totalCount'];
        }
        if (Leak.length > 0) {
            totalDeviceCount = Leak[0]['totalCount'] + totalDeviceCount;
            Datas[2] = Leak[0]['totalCount'];
         }
        Datas[0] = totalDeviceCount;
    }
    return Datas;
}



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
          height: (20 / 18) * 100 + '%',
          width: 120
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
       subtitle: { text: props.text, style: { color: '#177EBE' }, y: 70 },
       series: [
          {
             name: props.type,
             data: [
                { y: props.OverAllValue, color: '#D3D3D3' },
                { y: props.Value, color: 'gray' }
             ]
          }
       ],
       ...OverviewTemplate.userConfig
    };
 
    // Change the color for the text and graph plot
    switch (props.type) {
       case 'Flood':
          Data.subtitle.style.color = '#177EBE';
          Data.series[0].data[1].color = '#177EBE';
          break;
       case 'Leaks':
          Data.subtitle.style.color = '#42C3E4';
          Data.series[0].data[1].color = '#42C3E4';
          break;
    }
    return Data;
 };





const SuppressedDevice = (props) => {
    const Datas = FetchSuppressedDevice ({...props })
    // Datas => will come as total incidents Datas[0], online: Datas[1], offline Datas[2], never connectedDatas[3]
    // formula for the each category multiple by 100 to get the ratio.
    const Data = {
        Flood: (Datas[1] / Datas[0]) * 100,
        Leak: (Datas[2] / Datas[0]) * 100,
    };
    // This is for the device subtitle display
    const FloodStatus = '<b>' + Datas[1] + '</b><br> Flood';
    const LeakStatus = '<b>' + Datas[2] + '</b><br>Leak';

    return (
        <div className="card">
           <div className="card-header">
              <div className="text-primary">
                 <b>Suppressed Devices</b>
              </div>
           </div>
           <div className="card-body device-overview-charts">
              <div className="d-flex flex-wrap align-items-center px-5">
                 <HighchartsReact
                    highcharts={Highcharts}
                    options={PieChart({
                       type: 'Flood',
                       Value: Data["Flood"],
                       OverAllValue:  100 - Data['Flood'],
                       text: FloodStatus
                    })}
                 />
                 <HighchartsReact
                    highcharts={Highcharts}
                    options={PieChart({
                       type: 'Leaks',
                       Value: Data["Leak"],
                       OverAllValue: 100 - Data['Leak'],
                       text: LeakStatus
                    })}
                 />
              </div>
              <div class="card-footer">
                 <b>{Datas[0]}</b> device count
              </div>
           </div>
        </div>
     );

}


const mapStateToProps = createStructuredSelector({
    currentPortfolio: portfolioSelectors.selectCurrentPortfolio,
    userToken: userSelectors.selectUserToken
 });

 
 export default connect(mapStateToProps)(SuppressedDevice);