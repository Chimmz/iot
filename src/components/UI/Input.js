import React, { useEffect } from 'react';
import useInput from '../../hooks/useInput';

function Input({ type, value, handleChange, ...restProps }) {
   return (
      <input type={type} value={value} onChange={handleChange} {...restProps} />
   );
}

export default Input;
