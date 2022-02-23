import { useState, useEffect } from 'react';
import * as inputValidators from '../validators/inputValidator';

const useInput = function ({ init: initValue, validators }) {
   const [inputValue, setInputValue] = useState(initValue);
   const [validationErrors, setValidationErrors] = useState([]);

   const clearInput = () => setInputValue('');
   const handleChange = ev => setInputValue(ev.target.value);

   const runValidators = () => {
      if (!validators?.length) return;

      const getFeedback = validator => {
         const [validatorName, errMsg] = Object.entries(validator).flat();
         return inputValidators[validatorName]?.(inputValue, errMsg);
      };

      const isFeedbackError = feedback =>
         feedback?.status === inputValidators.statusTypes.failed;

      // For each validator, get a corresponding feedback and filter error-based feedbacks
      const errors = validators.map(getFeedback).filter(isFeedbackError);
      setValidationErrors(errors);
   };

   // Also run validators upon input change event
   useEffect(() => runValidators(), [inputValue]);

   return [
      inputValue,
      handleChange,
      runValidators,
      validationErrors,
      setValidationErrors,
      clearInput
   ];
};

export default useInput;
