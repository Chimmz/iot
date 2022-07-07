import React, { useEffect, useRef } from 'react';
import { MultiSelect } from 'react-multi-select-component';
import './MultipleSelect.scss';

function MultipleSelect({ options, value, onChange, validationErrors }) {
   const multiSelectRef = useRef();

   useEffect(() => {
      if (!validationErrors.length) return;
      multiSelectRef.current
         .querySelector('.dropdown-heading')
         .classList.add('form-control', 'is-invalid');
   }, [validationErrors.length]);

   return (
      <div ref={multiSelectRef}>
         <MultiSelect
            options={options}
            value={value}
            onChange={onChange}
            labelledBy={'Select'}
         />
         <p className="app-error">{validationErrors?.[0]?.msg}</p>
      </div>
   );
}

export default MultipleSelect;
