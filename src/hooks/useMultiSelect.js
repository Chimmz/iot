import { useState, useEffect } from 'react';
import useValidator from './useValidator';

function useMultiSelect({ init = [], validators }) {
   const [selections, setSelections] = useState(init);

   const { runValidators, validationErrors, setValidationErrors, pushError } =
      useValidator({ inputValue: selections, validators });

   const clearInput = () => setSelections([]);

   useEffect(() => {
      if (selections?.length) setValidationErrors([]);
   }, [selections?.length]);

   return {
      selections,
      setSelections,
      runValidators,
      validationErrors,
      setValidationErrors,
      clearInput
   };
}

export default useMultiSelect;
