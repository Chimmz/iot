import React, { useState, useEffect } from 'react';
import { subDays, differenceInDays } from 'date-fns';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as portfolioSelectors from '../../../../../redux/portfolio/portfolio-selectors';
import * as userSelectors from '../../../../../redux/user/user-selectors';

import * as WaterAPIUtils from '../../CallAPI/telemetry-utils';
import { getDateOnly } from '../../../../../utils/dateUtils';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// Percentage calculator
import GetPercentage from '../highlights/PercentageCalculator';

const WatervsCost = props => {
  const CostPerGalon = 0.15;
  const { currentPortfolio, userToken, Dates } = props;
  const CurrentStartDate = Dates['startDate'];
  const endDate = Dates['endDate'];
  const getDaysCount = differenceInDays(endDate, CurrentStartDate);
  const [startDate, setStartDate] = useState(subDays(CurrentStartDate, getDaysCount));
  // We are making this as array to call the API two time for getting the percentage value
  // To group by store the record of the data.
  const [waterTrends, setwaterTrends] = useState({});
  const [filteredDataLoading, setIsFilteredDataLoading] = useState(false);
  const fetchWaterTrendings = async () => {
    const makeRequest = () => {
      return WaterAPIUtils.fetchWaterTrends(
        currentPortfolio,
        getDateOnly(startDate),
        getDateOnly(endDate),
        userToken
      );
    };
    const res = WaterAPIUtils.handleFilterLoadingAsync(makeRequest, setIsFilteredDataLoading);
    const JsonContent = await res;
    //
    if (JsonContent.length > 0) {
      // Remove those keys before preprocessing it is not required for the current component work.
      JsonContent.forEach((value, key, JsonContent) => {
        delete JsonContent[key]['day'];
        delete JsonContent[key]['month'];
        delete JsonContent[key]['year'];
        delete JsonContent[key]['portfolioHeaderID'];
        delete JsonContent[key]['buildingHeaderID'];
        delete JsonContent[key]['floorHeaderID'];
        delete JsonContent[key]['roomHeaderID'];
        delete JsonContent[key]['zoneHeaderID'];
        delete JsonContent[key]['uom'];
        delete JsonContent[key]['type'];
        // Change the timeStamp to standard format from YYYY-MM-DD
        JsonContent[key]['datetimestamp'] = new Date(JsonContent[key]['datetimestamp']);
        // Convert the Liter to Galon
        JsonContent[key]['galon'] = parseFloat((JsonContent[key]['reading'] * 0.264172).toFixed(2));
      });
    }
    setwaterTrends(JsonContent);
  };
  // Due to we are increasing the start date fetchWaterTrendings getting looped.
  // so that we are making the changes on the startDate using useEffect.
  useEffect(() => {
    const getDaysCount = differenceInDays(endDate, CurrentStartDate);
    setStartDate(subDays(CurrentStartDate, getDaysCount));
  }, [CurrentStartDate]);

  useEffect(() => {
    if (currentPortfolio) fetchWaterTrendings();
  }, [startDate, endDate, currentPortfolio?.portfolioHeaderId]);

  //Sort algorithm for the Water vs cost
  const sortArray = (type, Data) => {
    const types = {
      buildingName: 'buildingName',
      datetimestamp: 'datetimestamp',
      floorName: 'floorName',
      galon: 'galon',
      reading: 'reading',
      roomName: 'roomName',
      zoneName: 'zoneName'
    };
    const sortProperty = types[type];
    const sorted = [...Data].sort((a, b) => b[sortProperty] - a[sortProperty]);
    return sorted;
  };

  // Used for sum the galon
  const getSumByKey = (arr, key) => {
    return arr.reduce((accumulator, current) => accumulator + Number(current[key]), 0);
  };

  // Preprocessing the for current / previous range and sort based on galon for current data
  // and Calculate the total sum of galon with adding the cost for the each 1 galon
  const ProcessAPIData = () => {
    var CurrentData = [],
      PreviousData = [],
      SortedData = [];
    var totalGalon = 0,
      totalWatercost = 0,
      PreviousGal = 0,
      PerviousCost = 0;
    if (waterTrends.length > 0) {
      // This is for the current date range.
      CurrentData = waterTrends.filter(item => item.datetimestamp >= CurrentStartDate);
      // this is for the previous date range from current date range.
      PreviousData = waterTrends.filter(item => item.datetimestamp < CurrentStartDate);
      //Sort the data based upon galon usage.
      SortedData = sortArray('galon', CurrentData);
      // Sum all the galon
      totalGalon = getSumByKey(SortedData, 'galon').toFixed(2);
      // Add 0.20 cents as water per galon.
      totalWatercost = (totalGalon * CostPerGalon).toFixed(2);

      // This is to take the previous data galon sum and total water cost for percentage calculation.
      // Sum all the galon
      PreviousGal = getSumByKey(PreviousData, 'galon').toFixed(2);
      // Add 0.20 cents as water per galon.
      PerviousCost = (PreviousGal * CostPerGalon).toFixed(2);
    }
    return {
      SortedData,
      totalGalon,
      totalWatercost,
      PreviousGal,
      PerviousCost
    };
  };

  // Calling the processAPIData which will do all the basic need of the data like data,
  // total galon used for the particular days and total water usage cost.
  const { SortedData, totalGalon, totalWatercost, PreviousGal, PerviousCost } = ProcessAPIData();
  const RenderHighestData = props => {
    const DynamicPost = [];
    const Data = props.Data;
    // this is set to display only 10 datas
    var totalCount = 10;
    // if the data is less than 10 count then change to length of the data
    if (Data.length < 10) {
      totalCount = Data.length;
    }
    // Check whether data length is there or not to render the table.
    if (Data.length > 0) {
      var CurrentCost = 0;
      for (var count = 0; count < totalCount; count++) {
        // this is used to calculate each index galon with price
        CurrentCost = (Data[count]['galon'] * CostPerGalon).toFixed(2);
        DynamicPost.push([
          <tr>
            <td>
              {Data[count]['floorName']} {Data[count]['roomName']}
            </td>
            <td>{Data[count]['galon']} gal</td>
            <td>$ {CurrentCost}</td>
          </tr>
        ]);
      }
    }
    return DynamicPost;
  };

  const options = {
    chart: {
      type: 'bar',
      reflow: true,
      marginTop: 0,
      spacingTop: 0,
      spacingRight: 0,
      marginRight: 0,
      height: 150
    },
    colors: ['#0073e6', '#aac9e3'],
    title: { text: null },
    subtitle: { text: null },
    xAxis: {
      categories: [],
      title: { text: null },
      labels: { enabled: false }
    },
    yAxis: {
      min: 0,
      title: { text: null },
      visible: false,
      labels: { enabled: false },
      width: 200
    },
    plotOptions: {
      bar: { dataLabels: { enabled: true, overflow: 'none', crop: false } }
    },
    legend: {
      enabled: true,
      symbolRadius: 0,
      symbolHeight: 12,
      symbolWidth: 20,
      itemStyle: {}
    },

    credits: { enabled: false },
    series: [
      {
        name: 'Water',
        // data: [20],
        data: [+totalGalon],
        tooltip: { valueSuffix: ' Gallons' },

        dataLabels: {
          enabled: true,
          formatter: function () {
            let percent = GetPercentage({
              Current: totalGalon,
              Previous: PreviousGal,
              withoutGreenIcon: true
            });
            if (!isNaN(percent)) percent += '%';
            console.log(percent);
            return (
              Highcharts.numberFormat(this.y) +
              '   ' +
              `<span style="color: orange; position: relative; top: 20px">${percent}</span>`
            );
          }
        }
      },
      {
        name: 'Cost',
        // data: [7],
        data: [+totalWatercost],
        tooltip: { valuePrefix: '$' },

        dataLabels: {
          enabled: true,
          formatter: function () {
            let percent = GetPercentage({
              Current: totalWatercost,
              Previous: PerviousCost,
              withoutGreenIcon: true
            });

            if (!isNaN(percent)) percent += '%';
            console.log(percent);
            return (
              Highcharts.numberFormat(this.y, 0) +
              '   ' +
              `<span style="color: orange; position: relative; top: 20px">${percent}</span>`
            );
          }
        }
      }
    ]
  };

  console.log('VALUES: ', totalGalon, totalWatercost);
  // 3. Display on 10 highest galon usage with calculate with $$
  return (
    <>
      <div class='card dashboard-card'>
        <div class='card-header'>
          <div className='text-primary'>
            <b>Water vs Cost</b>
          </div>
        </div>
        <div className='card-body'>
          <div className='d-flex justify-content-between px-3 py-2'>
            <div style={{ flex: 1 }} className='tablehead-barchart'>
              <HighchartsReact highcharts={Highcharts} options={options} />
            </div>
            <div>
              {/* <div className="h4">
                        {totalGalon} gal / ${totalWatercost}
                     </div> */}
              {/* <div>
                        {GetPercentage({
                           Current: totalGalon,
                           Previous: PreviousGal
                        })}{' '}
                        /
                        {GetPercentage({
                           Current: totalWatercost,
                           Previous: PerviousCost
                        })}
                     </div> */}
            </div>
            {/* <img
                     src={
                        process.env.PUBLIC_URL + '/images/dashboard/droplet.png'
                     }
                  /> */}
          </div>
          <div className='table-wrapper-scroll-y thin-scrollbar'>
            <table className='table table-hover'>
              <thead>
                <tr>
                  <th scope='col'>Location</th>
                  <th scope='col'> water</th>
                  <th scope='col'> costs</th>
                </tr>
              </thead>
              <tbody>
                <RenderHighestData Data={SortedData} />
              </tbody>
            </table>
          </div>
        </div>
        <div className='card-footer'>
          <b>{getDaysCount + 1}</b> days count
        </div>
      </div>
    </>
  );
};

const mapStateToProps = () =>
  createStructuredSelector({
    currentPortfolio: portfolioSelectors.selectCurrentPortfolio,
    userToken: userSelectors.selectUserToken,
    roles: userSelectors.userRoles
  });

export default connect(mapStateToProps)(WatervsCost);
