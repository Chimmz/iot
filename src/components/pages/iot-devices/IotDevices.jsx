import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import withPageHeader from '../../HOC/withPageHeader';
import PageHeader from '../../page-header/PageHeader';

import * as iotDeviceUtils from '../../../redux/iot-devices/iotDevice-utils';
import * as iotDeviceSelectors from '../../../redux/iot-devices/iot-device-selectors';
import * as portfolioSelectors from '../../../redux/portfolio/portfolio-selectors';
import * as userSelectors from '../../../redux/user/user-selectors';

import Spinner from '../../UI/spinner/Spinner';
import IotTable from '../../iot-table/IotTable';
import './IotDevices.scss';

import {
  tableColumns,
  getTableData,
  getFilterPeriods,
  formattedFloorName
} from './table-config.js';

function IotDevices(props) {
  const { currentPortfolio, userToken } = props;
  const [filteredDataLoading, setIsFilteredDataLoading] = useState(false);

  const [allIotDevices, setAllIotDevices] = useState({
    filterSelected: 'All', // for initial API fetch when filter is set to None or All; value of Filter dropdown
    allData: [], // all data from API
    filteredData: [] // filtered set of data from API; initially equal to allData, changed only when filter is applied in {handleFilter}
  });

  const handleFilter = evKey => {
    const optionSelected = evKey;
    if (optionSelected === allIotDevices.filterSelected) return; // in case same seleced option is seleced again
    /* 
      If selected dropdown filter is 'All', use allData for filteredData, otherwise check for respective rows.
      On changing filter, apply the condition to check for equality of floor column
      and check for equality with formatted floor data. Original state has floor = <integer>,
      which needs to be formatted to <n-th floor> for equality check. Invoking formattedFloorName
      from table-config.js does the change.
      TODO: add in addtional formatting to handle other columns and their individual formats.
      */
    const newFilteredDevices =
      optionSelected !== 'All'
        ? allIotDevices.allData.filter(device => {
            if (device.floor === optionSelected) return device;
          })
        : allIotDevices.allData;
    setAllIotDevices({
      ...allIotDevices,
      filterSelected: evKey,
      filteredData: newFilteredDevices
    });
  };

  const loadIotDevices = async () => {
    // function to fetch IotDevices from api/Sensor/GetCountByPortfolio?portfolioId=<portfolioHeaderId>
    const makeRequest = () => {
      return iotDeviceUtils.fetchIotDevices(currentPortfolio, userToken);
    };
    const res = iotDeviceUtils.handleFilterLoadingAsync(makeRequest, setIsFilteredDataLoading);
    const devices = getTableData(await res);
    setAllIotDevices({
      allData: devices,
      filteredData: devices,
      filterSelected: 'All'
    });
  };
  useEffect(() => {
    if (currentPortfolio) loadIotDevices();

    return () => {};
  }, [currentPortfolio?.portfolioHeaderId]);

  let devicesToShow =
    allIotDevices.filterSelected !== false ? allIotDevices.filteredData : allIotDevices.allData;
  return (
    <>
      <Spinner show={filteredDataLoading} message='Getting records...' />
      <PageHeader location={useLocation()} />
      <div id='iotDeviceTable' className='card px-3 py-5 flex-grow data-card telemetry'>
        <h2 className='page-heading fw-600 mb-lg'>IoT Devices</h2>

        <IotTable
          columns={tableColumns}
          data={devicesToShow}
          currentTimePeriod={allIotDevices.filterSelected}
          dateFilterPeriods={getFilterPeriods(allIotDevices.allData)}
          onDateFilter={handleFilter}
        />
      </div>
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  currentPortfolio: portfolioSelectors.selectCurrentPortfolio,
  iotDevicesLoading: iotDeviceSelectors.selectIotDeviceLoading,
  userToken: userSelectors.selectUserToken
});

export default connect(mapStateToProps)(IotDevices);
