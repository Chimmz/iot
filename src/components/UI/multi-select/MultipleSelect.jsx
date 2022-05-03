import React, { useEffect } from 'react';
import { MultiSelect } from 'react-multi-select-component';

function MultipleSelect({ options, value, onChange, validationErrors }) {
   useEffect(() => {
      const allErrors = document.querySelectorAll('.app-error');

      allErrors.forEach(error => {
         const parent = error.parentElement;
         if (parent.classList.contains('multi-select'))
            parent.classList.add('border-error', 'form-control', 'is-invalid');
      });
   });
   return (
      <>
         <MultiSelect
            options={options}
            value={value}
            onChange={onChange}
            labelledBy={'Select'}
         />
         <p className="app-error">{validationErrors?.[0]?.msg}</p>
      </>
   );
}

export default MultipleSelect;
