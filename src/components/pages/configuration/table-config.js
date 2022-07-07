import { toCamelCase, toTitleCase } from '../../../utils/stringUtils';
import GroupActions from './group-action/GroupActions';
import GroupToggle from './group-toggle/GroupToggle';

// The column names of the configuration page table
const tableFields = [
   'group name',
   'incident types',
   'user count',
   'notification types',
   'availability',
   'turn on / off',
   'action',
];

export const getTableData = function (groups, userToken) {
   if (!groups?.length) return [];

   // Each row of the table data is described as an object
   return groups.map(g => ({
      groupName: g.name,
      incidentTypes: g.incidentTypes,
      userCount: `${g.userCount}`?.padStart(2, '0'), // Prepends 0 to single-digits
      notificationTypes: g.notificationTypes,
      availability: g.availabilityTypes,
      action: <GroupActions key={g.groupId} group={g} />,
      'turnOn/Off': JSON.stringify(g) + '/' + userToken,
   }));
};

// Custom cell render handlers
const customRenderHandlers = {
   'incident types': currValue => {
      return (
         <div
            className="overflow-x-scroll thin-scrollbar"
            style={{ maxWidth: '15ch' }}
         >
            {currValue}
         </div>
      );
   },

   'turn on / off': currValue => {
      let [group, userToken] = currValue.split('/');
      group = JSON.parse(group);
      return (
         <>
            <span className="d-none">{group.groupStatusCode}</span>
            <GroupToggle
               key={group.groupId}
               group={group}
               userToken={userToken}
            />
         </>
      );
   },
};

// The table columns will be gotten here as an array
export const tableColumns = tableFields.map(field => {
   const column = { name: toCamelCase(field), label: toTitleCase(field) };

   switch (field) {
      case 'incident types':
      case 'turn on / off':
         column.options = { customCellRender: customRenderHandlers[field] };
         break;
      default:
         break;
   }
   return column;
});

export const tableOptions = { search: false };
