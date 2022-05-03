import * as strUtils from '../../../utils/stringUtils';

const fields = [
   'group name',
   'incident types',
   // 'turn on / off',
   // 'action',
   'user count',
   'notification types',
   'availability',
   'turn on / off',
   'action'
];

export const tableColumns = fields.map(field => {
   const column = {
      name: strUtils.toCamelCase(field),
      label: strUtils.toTitleCase(field)
   };
   return column;
});

export const tableOptions = {
   selectRows: false,
   search: false
};
