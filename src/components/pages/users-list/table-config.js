import * as dateUtils from '../../../utils/dateUtils';
import * as strUtils from '../../../utils/stringUtils';

const tableFields = [
   'user name',
   'property name',
   'primary email',
   'phone',
   'group',
   'active',
   'action'
];

export const tableColumns = tableFields.map(field => {
   const column = {
      name: strUtils.toCamelCase(field),
      label: strUtils.toTitleCase(field)
   };
   return column;
});
