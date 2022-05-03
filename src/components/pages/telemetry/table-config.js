import * as dateUtils from '../../../utils/dateUtils';
import { toCamelCase, toTitleCase } from '../../../utils/stringUtils';
import { IncidentRecordResponsePage } from '../incident-form/IncidentRecordResponse';

export const tableFields = [
   'alert type',
   'location',
   'floor',
   'start time',
   'end time',
   'status',
   'incident record'
];

const customCellRenderHandlers = {
   'start time': (currValue, record, metadata) => {
      // console.log(currValue);
      return dateUtils.getDateAndTime(currValue);
   }
};

export const getTableColumns = props =>
   tableFields.map(field => {
      const column = { name: toCamelCase(field), label: toTitleCase(field) };

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

         case 'start time':
            column.options = {
               customCellRender: customCellRenderHandlers[field]
            };
      }
      return column;
   });

export const getTableData = incidents => {
   if (!incidents?.length) return [];

   return incidents.map(incid => ({
      alertType: incid.displayName,
      location: incid.roomName + ' - ' + incid.zoneName,
      floor: incid.floorName.split(' ')[1],
      startTime: incid.startTime,
      endTime: !incid.endTime ? '-' : dateUtils.getDateAndTime(incid.endTime),
      status: incid.incidentStatus,
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
