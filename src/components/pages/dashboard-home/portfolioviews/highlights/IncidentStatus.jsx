import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { subDays, differenceInDays } from 'date-fns';

// Calling redux here
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as portfolioSelectors from '../../../../../redux/portfolio/portfolio-selectors';
import * as userSelectors from '../../../../../redux/user/user-selectors';
import * as incidentSelectors from '../../../../../redux/incident/incident-selectors';
import * as incidentUtils from '../../../../../redux/incident/incident-dashboard-utils';
import { getDateOnly } from '../../../../../utils/dateUtils';

// // Percentage calculator
// import GetPercentage from './PercentageCalculator';

import './highlightsCharts.scss';
import './IncidentStatus.scss'

const GetIncidentStatus = props => {
  const { currentPortfolio, userToken, Data } = props;
  const startDate = Data['startDate'];
  const endDate = Data['endDate'];
  const getDaysCount = differenceInDays(endDate, startDate) + 1;
  const previousStartDate = subDays(Data['startDate'], getDaysCount);
  const previousEndDate = subDays(Data['startDate'], 1);
  const [dateRange, setDateRange] = useState({
    start: startDate,
    end: endDate,
    prevStart: previousStartDate,
    prevEnd: previousEndDate
  });
  // We are making this as array to call the API two time for getting the percentage value
  // To group by store the record of the data.
  const [newArrayLst, setNewArrayList] = useState({});
  const [oldArrayLst, setOldArrayLst] = useState({});
  const [realArrayLst, setRealArrayLst] = useState({});
  const [filteredDataLoading, setIsFilteredDataLoading] = useState(false);

  // This API call only for one time when page load
  const GetAllIncidentByCategory = async props => {
    var startDate = new Date('Jan 1, 1990 00:00:00');
    var endDate = new Date();
    const makeRequest = () => {
      return incidentUtils.fetchGetIncidentByCategory(
        currentPortfolio,
        getDateOnly(startDate),
        getDateOnly(endDate),
        userToken
      );
    };
    const res = incidentUtils.handleFilterLoadingAsync(makeRequest, setIsFilteredDataLoading);
    const incids = await res;
    setRealArrayLst(GetGroupByResult(incids));
  };

  // this API will be called whenever page got refereshed and calendar update
  const IncidentByCategory = async props => {
    const { Data, start, end, prevStart, prevEnd } = props;
    const makeRequest = () => {
      if (Data === 1) {
        return incidentUtils.fetchGetIncidentByCategory(
          currentPortfolio,
          getDateOnly(start),
          getDateOnly(end),
          userToken
        );
      } else if (Data === 2) {
        return incidentUtils.fetchGetIncidentByCategory(
          currentPortfolio,
          getDateOnly(prevStart),
          getDateOnly(prevEnd),
          userToken
        );
      }
    };
    const res = incidentUtils.handleFilterLoadingAsync(makeRequest, setIsFilteredDataLoading);
    const incids = await res;
    console.log(incids);
    if (Data === 1) {
      setNewArrayList(GetGroupByResult(incids));
    } else if (Data === 2) {
      setOldArrayLst(GetGroupByResult(incids));
    }
  };

  // This is to first update the date so that next useEffect of the dateRange will be triggered.
  useEffect(() => {
    setDateRange({
      start: startDate,
      end: endDate,
      prevStart: previousStartDate,
      prevEnd: previousEndDate
    });
  }, [startDate, endDate]);

  useEffect(() => {
    if (currentPortfolio) {
      // This two things to get the Data from API and groupby the count.
      IncidentByCategory({ Data: 1, ...dateRange });
      IncidentByCategory({ Data: 2, ...dateRange });
    }
  }, [dateRange, currentPortfolio?.portfolioHeaderId]);

  // this is for the one time calling for the GetAllIncidentByCategory
  useEffect(() => {
    if (currentPortfolio) GetAllIncidentByCategory();
  }, [currentPortfolio?.portfolioHeaderId]);

  // This is for group by based upon the incidentStatus
  const GetGroupByResult = props => {
    var results = props.reduce(function (r, a) {
      r[a.incidentStatus] = r[a.incidentStatus] || [];
      r[a.incidentStatus].push(a);
      return r;
    }, Object.create(null));
    const arrayList = {};
    var dummyCnt = 0;
    var overAllCnt = 0;
    for (var keys in results) {
      for (var ObjCnt = 0; ObjCnt < results[keys].length; ObjCnt++) {
        dummyCnt = results[keys][ObjCnt]['incidentCount'] + dummyCnt;
      }
      arrayList[keys] = dummyCnt;
      overAllCnt = overAllCnt + dummyCnt;
      dummyCnt = 0;
    }
    arrayList['count'] = overAllCnt;
    return arrayList;
  };

  // To render the data on the UI
  const RenderData = props => {
    const DynamicData = props.Data;
    const OldArrayLst = props.PrevData;
    var DynamicPost = [];
    for (var Data in realArrayLst) {
      if (Data !== 'count') {
        DynamicPost.push([
          <tr>
            <td>{Data}</td>
            <td>{realArrayLst[Data]}</td>
            <td>{DynamicData[Data]}</td>
            <td>{OldArrayLst[Data]}</td>
          </tr>
        ]);
      }
    }

    return DynamicPost;
  };
  // this is to render the graph part
  const GetGraphData = props => {
    var DynamicPost = [];
    for (var Data in newArrayLst) {
      if (Data !== 'count') {
        DynamicPost.push({
          name: Data,
          data: [newArrayLst[Data]],
          dataLabels: { enabled: true }
        });
      }
    }
    // Graph template and insert the DYnamicPost inside the series key
    const options = {
      chart: {
        type: 'bar',
        marginTop: 0,
        spacingTop: 0,
        spacingRight: 0,
        marginRight: 0,
        reflow: true,
        height: 240,
        width: 304
      },
      title: { text: null },
      subtitle: { text: null },
      xAxis: {
        categories: [''],
        title: { text: null },
        labels: { enabled: false }
      },
      yAxis: {
        min: 0,
        allowDecimals: false,
        title: { text: null },
        visible: false,
      },
      tooltip: { valueSuffix: ' counts' },
      legend: {
        enabled: true,
        symbolRadius: 0,
        symbolHeight: 12,
        symbolWidth: 20,
        itemStyle: {}
      },
      plotOptions: {
        bar: { 
          dataLabels: { 
            enabled: true,
            overflow:'none',
            crop: false

          } 
        }
      },

      credits: { enabled: false },
      series: DynamicPost
    };
    return options;
  };
  
  return (
    <>
      <div className='card dashboard-card'>
        <div className='card-header'>
          <div className='text-primary'>
            <b>Incident status</b>
          </div>
        </div>
        <div className='card-body'>
          <div className='d-flex justify-content-between px-3 py-2 align-items-center flex-wrap'>
            <div style={{ flex: 1 }} className='tablehead-barchart'>
              <HighchartsReact highcharts={Highcharts} options={GetGraphData()} />
            </div>
          </div>
          <div className='table-wrapper-scroll-y thin-scrollbar mt-4 border-top ps-3'>
            <table className='table table-hover'>
              <thead>
                <th scope='col'>Type</th>
                <th scope='col'>Current</th>
                <th scope='col'>{getDaysCount} day(s)</th>
                <th scope='col'>Previous {getDaysCount} day(s)</th>
              </thead>
              <tbody>
                <RenderData Data={newArrayLst} PrevData={oldArrayLst} />
              </tbody>
            </table>
          </div>
        </div>
        <div className='card-footer bg-white'>
          <b>{getDaysCount}</b> days count
        </div>
      </div>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  currentPortfolio: portfolioSelectors.selectCurrentPortfolio,
  incidentsLoading: incidentSelectors.selectIncidentLoading,
  userToken: userSelectors.selectUserToken
});

const mapDispatchToProps = dispatch => ({
  // getIncidents: (token, portfolio, timePeriod) => {
  //    dispatch(
  //       incidentCreators.getIncidents(token, portfolio, timePeriod, {
  //          reduxSave: false
  //       })
  //    );
  // }
});

export default connect(mapStateToProps, mapDispatchToProps)(GetIncidentStatus);
