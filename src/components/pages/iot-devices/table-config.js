import * as strUtils from '../../../utils/stringUtils';
import * as dateUtils from '../../../utils/dateUtils';

export const tableFields = [
  'floor',
  'location',
  'serial number',
  'device type',
  'status',
  'last status update'
];

export const formattedFloorName = floorId => {
  let s = ['th', 'st', 'nd', 'rd'];
  let v = floorId % 100;
  return floorId + (s[(v - 20) % 10] || s[v] || s[0]) + ' Floor';
};

const formattedDeviceState = statusId => {
  let statusDesc, color;
  switch (statusId) {
    case 1: {
      color = 'green';
      statusDesc = 'Online';
      break;
    }
    case 2: {
      color = 'red';
      statusDesc = 'Offline';
      break;
    }
    case 3: {
      color = 'grey';
      statusDesc = 'Unknown';
      break;
    }
    case 4: {
      color = 'grey';
      statusDesc = 'Never Connected';
      break;
    }
    default:
      return '';
  }
  let html_element = (
    <>
      <div className='deviceSensor'><i className='bi bi-circle-fill' style={{ color: `${color}` }}></i>&nbsp;&nbsp;{statusDesc}</div>
    </>
  );
  return html_element;
};

export const tableColumns = tableFields.map(field => {
  const column = {
    name: strUtils.toCamelCase(field),
    label: strUtils.toTitleCase(field)
  };
  switch (field) {
    // case 'floor': {
    //   column.options = {
    //     customCellRender: (value, record, metadata) => {
    //       return formattedFloorName(value);
    //     }
    //   };
    //   break;
    // }
    case 'location': {
      column.options = {
        customCellRender: (value, record, metadata) => {
          return <div className='overflow-x-scroll thin-scrollbar'>{value}</div>;
        }
      };
      break;
    }
    case 'status': {
      column.options = {
        customCellRender: (value, record, metadata) => {
          return formattedDeviceState(value);
        }
      };
      break;
    }
    case 'last status update': {
      column.options = {
        customCellRender: (value, record, metadata) => {
          return value === '-' ? (
            '-'
          ) : (
            <div className='updatedTime'>
              <span style={{ display: 'none' }}>{parseInt(+new Date(value))}</span>
              {dateUtils.getDateAndTime(value)}
            </div>
          );
        }
      };
      break;
    }
  }
  return column;
});
export const getTableData = iotDevices => {
  if (!iotDevices?.length) return [];
  return iotDevices.map(device => ({
    floor: `${
      ((device.floorName !== null || device.floorName.trim() !== '') && device.floorName) ||
      device.buildingName
    }`,
    location: <div className='IOTroomName'>{[device.roomName, device.zoneName]
      .filter(item => (item.trim() !== '') & (item !== null))
      .join(' / ')}</div>,
    serialNumber: <div className='serialNumber'>{device.serialNumber}</div>,
    deviceType: <div className='deviceModel'>{device.model}</div>,
    status: device.sensorStatusId,
    lastStatusUpdate: !device.lastUpdatedDatetime ? '-' : device.lastUpdatedDatetime
  }));
};

export const getFilterPeriods = devices => {
  let filterOptions = [];
  const filterColumn = 'floor';
  devices.map(device => {
    if (!filterOptions.includes(device[filterColumn])) filterOptions.push(device[filterColumn]);
    return () => {};
  });
  filterOptions = filterOptions
    .sort(function (a, b) {
      return a - b;
    })
    .map(floor => floor);
  return ['All', ...filterOptions];
};
