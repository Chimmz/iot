import GroupActions from './group-action/GroupActions';
import GroupToggle from './group-toggle/GroupToggle';
import { toCamelCase, toTitleCase } from '../../../utils/stringUtils';

const tableFields = [
   'group name',
   'incident types',
   'user count',
   'notification types',
   'availability',
   'turn on / off',
   'action'
];

const customCellRenderHandlers = {
   'incident types': (currValue, record, metadata) => (
      <div
         className='overflow-x-scroll thin-scrollbar'
         style={{ maxWidth: '15ch' }}>
         {currValue}
      </div>
   )
};

export const tableColumns = tableFields.map(field => {
   const column = { name: toCamelCase(field), label: toTitleCase(field) };

   switch (field) {
      case 'incident types':
         column.options = { customCellRender: customCellRenderHandlers[field] };
   }
   return column;
});

export const getTableData = function (groups, userToken) {
   if (!groups?.length) return [];

   return groups.map(g => ({
      groupName: g.name,
      incidentTypes: g.incidentTypes,
      userCount: `${g.userCount}`?.padStart(2, '0'), // Appends 0 to single-digits
      notificationTypes: g.notificationTypes,
      availability: g.availabilityTypes,
      action: <GroupActions group={g} />,

      'turnOn/Off': (
         <GroupToggle
            key={g.groupId}
            groupId={g.groupId}
            userToken={userToken}
         />
      )
   }));
};

export const tableOptions = { search: false };
