import { useState } from 'react';

const useInput = function (initValue) {
   const [value, setValue] = useState(initValue);

   const handleChange = ev => setValue(ev.target.value);
   const clearValue = () => setValue('');

   return [value, handleChange, setValue, clearValue];
};

export default useInput;
