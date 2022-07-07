import * as dateUtils from '../../../utils/dateUtils';
import * as strUtils from '../../../utils/stringUtils';

// prettier-ignore
export const dateFilterPeriods = ['1-week', '1-month', '3-month', '6-month', '9-month', '1-year'];
export const tableFields = ['time stamp', 'type', 'message'];

export const tableColumns = tableFields.map(field => {
   const column = {
      name: strUtils.toCamelCase(field),
      label: strUtils.toTitleCase(field)
   };

   if (field === 'time stamp') {
      column.options = {
         customCellRender: (value, record, metadata) => {
            return value === '-' ? (
               '-'
            ) : (
               <div className='notifyTime'>
                  <span style={{ display: 'none' }}>
                     {parseInt(+new Date(value))}
                  </span>
                  {dateUtils.getDateAndTime(value)}
               </div>
            );
         }
      };
   }

   if (field === 'message') {
      column.options = {
         customCellRender: (value, record, metadata) => {
            return <div style={{ maxWidth: '56ch' }}>{value}</div>;
         }
      };
   }
   return column;
});

export const getTableData = notifications => {
   if (!notifications?.length) return [];

   const notifs = notifications.map(notif => ({
      timeStamp: !notif.generatedDateTime ? '-' : notif.generatedDateTime,
      type: <div className='notifyType'>{notif.category}</div>,
      message: <div className='notifyMsg'>{notif.message}</div>
   }));
   return notifs;
};

export const sortByStartTime = (notifications, sortOrder = 'ascend') => {
   if (!notifications?.length) return [];

   const sortedData = notifications?.sort((currRow, nextRow) => {
      const currStartTime = +new Date(currRow.generatedDateTime);
      const nextStartTime = +new Date(nextRow.generatedDateTime);

      if (sortOrder === 'ascend') {
         if (currStartTime < nextStartTime) return -1;
         return 1;
      }
      if (currStartTime < nextStartTime) return 1;
      return -1;
   });
   return sortedData;
};
