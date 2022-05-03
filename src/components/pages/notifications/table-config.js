import * as dateUtils from '../../../utils/dateUtils';
import * as strUtils from '../../../utils/stringUtils';

export const tableFields = [
   'time stamp',
   'type',
   'message'
];

export const tableColumns = tableFields.map(field => {
   const column = {
      name: strUtils.toCamelCase(field),
      label: strUtils.toTitleCase(field)
   };
   return column;
});

export const getTableData = notifications => {
   if (!notifications?.length) return [];

   return notifications.map(notif => ({
      'timeStamp':dateUtils.getDateAndTime(notif.generatedDateTime),

        'type':notif.category,
        'message':notif.message,
   }));
};

// prettier-ignore
export const dateFilterPeriods = ['1-week', '1-month', '3-month', '6-month', '9-month', '1-year'];

export const sortByStartTime = (notifications, sortOrder = 'ascend') => {
   if (!notifications?.length) return [];
   if (!sortOrder) return notifications;

   const sortedData = notifications?.sort((currRow, nextRow) => {
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
