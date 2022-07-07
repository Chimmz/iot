import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { addDays, differenceInDays } from 'date-fns';
import { getDateOnly } from '../../../../../utils/dateUtils';

// Calling redux here
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as portfolioSelectors from '../../../../../redux/portfolio/portfolio-selectors';
import * as userSelectors from '../../../../../redux/user/user-selectors';
import * as WaterAPIUtils from '../../CallAPI/telemetry-utils';

// Barchart template
import { WaterCost, WaterUsage } from '../ChartTemplates/WaterUsageVsCostTemplate';

const WaterCostUsageview = props => {
  const CostPerGalon = 0.0132;
  const { currentPortfolio, userToken, Dates } = props;
  // Get the days count between
  const startDate = Dates['startDate'];
  const endDate = Dates['endDate'];
  // This is for the days count to show in the UI in days
  const getDaysCount = differenceInDays(endDate, startDate) + 1;
  // Water usage and leak state.
  const [waterStateUsage, setWaterStateUsage] = useState({});
  const [leakQty, setLeakQty] = useState({});
  const [filteredDataLoading, setIsFilteredDataLoading] = useState(false);

  /** This is for the water consumes API and preprocessing fetch */
  const fetchWaterConsume = async () => {
    const makeRequest = () => {
      return WaterAPIUtils.fetchWaterConsumption(
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
      // this is for the temp
      var TempDate = '';
      // Remove those keys before preprocessing it is not required for the current component work.
      JsonContent.forEach((value, key, JsonContent) => {
        delete JsonContent[key]['day'];
        delete JsonContent[key]['month'];
        delete JsonContent[key]['year'];
        // Change the timeStamp to standard format from YYYY-MM-DD
        JsonContent[key]['dateTimeStamp'] = new Date(JsonContent[key]['dateTimeStamp']);
        // this is for removing the zero on the month prefix.
        TempDate = new Date(JsonContent[key]['dateTimeStamp']);
        TempDate =
          TempDate.getFullYear() + '-' + (TempDate.getMonth() + 1) + '-' + TempDate.getDate();
        JsonContent[key]['dateOnly'] = TempDate;
        // Convert the Liter to Galon
        JsonContent[key]['galon'] = parseFloat((JsonContent[key]['reading'] * 0.264172).toFixed(2));
        JsonContent[key]['cost'] = parseFloat(
          (JsonContent[key].reading * 0.264172 * CostPerGalon).toFixed(2)
        );
      });
    }
    setWaterStateUsage(JsonContent);
  };
  /** End of the water consumes */

  /** water leak qty API and preprocessing fetch*/
  const fetchLeakQty = async () => {
    const makeRequest = () => {
      return WaterAPIUtils.fetchLeakDayWise(
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
      // this is for the temp
      var TempDate = '';
      // Remove those keys before preprocessing it is not required for the current component work.
      JsonContent.forEach((value, key, JsonContent) => {
        delete JsonContent[key]['day'];
        delete JsonContent[key]['month'];
        delete JsonContent[key]['year'];
        // Change the timeStamp to standard format from YYYY-MM-DD
        JsonContent[key]['dateTimeStamp'] = new Date(JsonContent[key]['dateTimeStamp']);
        // this is for removing the zero on the month prefix.
        TempDate = new Date(JsonContent[key]['dateTimeStamp']);
        TempDate =
          TempDate.getFullYear() + '-' + (TempDate.getMonth() + 1) + '-' + TempDate.getDate();
        JsonContent[key]['dateOnly'] = TempDate;
        // Convert the Liter to Galon
        JsonContent[key]['galon'] = parseFloat((JsonContent[key]['reading'] * 0.264172).toFixed(2));
        JsonContent[key]['cost'] = parseFloat(
          (JsonContent[key].reading * 0.264172 * CostPerGalon).toFixed(2)
        );
      });
    }
    setLeakQty(JsonContent);
  };

  /**End of the water leak qty*/

  useEffect(() => {
    if (currentPortfolio) {
      fetchWaterConsume();
      fetchLeakQty();
    }
  }, [startDate, endDate, currentPortfolio?.portfolioHeaderId]);

  const GenerateData = () => {
    // Generate Date Array by start and end date using that check whether data is available
    // on that date or not if not then make it as zero
    var DateArray = [];
    var tempDate = '';
    var OnlyDay = '';
    for (var x = 0; x < getDaysCount; x++) {
      tempDate = addDays(startDate, x);
      OnlyDay = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();
      DateArray.push(OnlyDay);
    }
    // for (var cnt = 0; )
    var XLabel = [],
      YWaterUsage = [],
      YWaterCost = [],
      YLeakQty = [],
      YLeakCost = [];
    var tempWater = {},
      tempLeak = {};
    for (var DaysCnt = 0; DaysCnt < DateArray.length; DaysCnt++) {
      XLabel.push(new Date(DateArray[DaysCnt]).getDate());
    }
    // This is for the water usage
    if (waterStateUsage.length > 0) {
      for (var WaterCnt = 0; WaterCnt < DateArray.length; WaterCnt++) {
        tempWater = waterStateUsage.filter(item => item.dateOnly === DateArray[WaterCnt]);
        // this is for the water if not zero
        if (tempWater.length !== 0) {
          YWaterCost.push({ y: tempWater[0].cost });
          YWaterUsage.push({ y: tempWater[0].galon });
        } else {
          YWaterCost.push({ y: 0 });
          YWaterUsage.push({ y: 0 });
        }
      }
    }
    // This is for the leak wastage
    if (leakQty.length) {
      for (var LeakCnt = 0; LeakCnt < DateArray.length; LeakCnt++) {
        tempLeak = leakQty.filter(item => item.dateOnly === DateArray[LeakCnt]);
        // this is for the leak if not zero
        if (tempLeak.length !== 0) {
          YLeakCost.push({ y: tempLeak[0].cost });
          YLeakQty.push({ y: tempLeak[0].galon });
        } else {
          YLeakQty.push({ y: 0 });
          YLeakCost.push({ y: 0 });
        }
      }
    }
    return { XLabel, YWaterUsage, YWaterCost, YLeakQty, YLeakCost };
  };

  // This is for the water cost
  const xAxisCostTitle = '';
  const yAxisCostTitle = 'Water / Leak Cost (dollars)';
  const yAxisCostPrefix = {
    formatter: function () {
      return '$' + this.axis.defaultLabelFormatter.call(this);
    }
  };

  // This is for the water usage
  const xAxisUsageTitle = '';
  const yAxisUsageTitle = 'Water / Leak Usages (gallons)';
  const yAxisUsagePrefix = {
    formatter: function () {
      return this.axis.defaultLabelFormatter.call(this) + ' Gal';
    }
  };

  // const xAxisData= null
  const { XLabel, YWaterUsage, YWaterCost, YLeakQty, YLeakCost } = GenerateData();
  const xAxislabel = XLabel;
  // This is for the width auto working.
  for (var i = 0; i < Highcharts.charts.length; i++) {
    if (Highcharts.charts[i] !== undefined) {
      Highcharts.charts[i].reflow();
    }
  }
  return (
    <>
      <div className='card'>
        <div className='card-header'>
          <div className='text-primary'>
            <b>Water Cost vs Usages</b>
          </div>
        </div>
        <div className='card-body device-overview-charts'>
          {/* This is for the cost bar graph */}
          <HighchartsReact
            highcharts={Highcharts}
            options={WaterCost({
              xAxisCostTitle,
              yAxisCostTitle,
              xAxislabel,
              YWaterCost,
              yAxisCostPrefix,
              YLeakCost
            })}
          />
        </div>
        <div className='text-secondary text-center'>
          <b>{getDaysCount}</b> days count
        </div>
        <div className='boder-dashed border-primary mx-2 mb-2'></div>
        <div className='card-body device-overview-charts'>
          {/* This is for the usage line graph */}
          <HighchartsReact
            highcharts={Highcharts}
            options={WaterUsage({
              xAxisUsageTitle,
              yAxisUsageTitle,
              xAxislabel,
              YWaterUsage,
              yAxisUsagePrefix,
              YLeakQty
            })}
          />
        </div>
        <div className='card-footer border-top bg-white rounded-bottom'>
          <div className='text-secondary text-center'>
            <b>{getDaysCount}</b> days count
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  currentPortfolio: portfolioSelectors.selectCurrentPortfolio,
  userToken: userSelectors.selectUserToken
});

export default connect(mapStateToProps)(WaterCostUsageview);
