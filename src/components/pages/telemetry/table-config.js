import * as dateUtils from '../../../utils/dateUtils';
import * as strUtils from '../../../utils/stringUtils';
import { IncidentRecordResponsePage } from '../incident-form/IncidentRecordResponse';

export const tableFields = [
  'alert type',
  'status',
  'location',
  'floor',
  'start time',
  'end time',
  'status',
  'incident record'
];

// const customCellRenderHandlers = {}

export const getTableColumns = props =>
  tableFields.map(field => {
    const column = {
      name: strUtils.toCamelCase(field),
      label: strUtils.toTitleCase(field)
    };

    switch (field) {
      case 'incident record': {
        column.options = {
          /* display only the RecordHeaderName by getting the value before last index of '-'
               and send te record Id and REcordHeaderName to <IncidentRecordResponsePage> component */
          customCellRender: (value, record, metadata) => {
            const recordName = value.substring(0, value.lastIndexOf('-'));
            const recordId = value
              .substring(value.lastIndexOf('-') + 1, value.length)
              .trim();

            const recordDiv =
              value === '-' ? (
                '-'
              ) : (
                <IncidentRecordResponsePage
                  recordName={recordName}
                  recordId={recordId}
                  userToken={props.userToken}
                />
              );
            return recordDiv;
          }
        };
        break;
      }
      case 'start time': {
        column.options = {
          customCellRender: (value, record, metadata) => {
            return value === '-' ? (
              '-'
            ) : (
              <div className='startTime'>
                <span style={{ display: 'none' }}>
                  {parseInt(+new Date(value))}
                </span>
                {dateUtils.getDateAndTime(value)}
              </div>
            );
          }
        };
        break;
      }
      case 'end time': {
        column.options = {
          customCellRender: (value, record, metadata) => {
            return value === '-' ? (
              '-'
            ) : (
              <div className='endTime'>
                <span style={{ display: 'none' }}>
                  {parseInt(+new Date(value))}
                </span>
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

export const getTableData = incidents => {
  if (!incidents?.length) return [];
  return incidents.map(incid => ({
    alertType: <div className='displayName'>{incid.displayName}</div>,
    location: <div className='roomName'>{incid.roomName + ' - ' + incid.zoneName}</div>,
    floor: <div className='floorName'>{incid.floorName.split(' ')[1]}</div>,
    startTime: incid.startTime,
    endTime: !incid.endTime ? '-' : incid.endTime,
    status: <div className='incStatus'>{incid.incidentStatus}</div>,
    // send the ID of the record as well as HeaderName for the IncientRecord details to be fetched later
    incidentRecord: incid.incidentRecordHeaderName
      ? incid.incidentRecordHeaderName + '-' + incid.incidentId
      : '-'
  }));
};

// prettier-ignore
export const dateFilterPeriods = ['1-week', '1-month', '3-month', '6-month', '9-month', '1-year'];

export const sortByStartTime = (incidents, sortOrder = 'ascend') => {
  if (!incidents?.length) return [];

  const sortedData = incidents.sort((currRow, nextRow) => {
    const currStartTime = +new Date(currRow.startTime);
    const nextStartTime = +new Date(nextRow.startTime);

    if (sortOrder === 'ascend') {
      if (currStartTime < nextStartTime) return -1;
      return 1;
    }
    if (currStartTime < nextStartTime) return 1;
    return -1;
  });
  return sortedData;
};
