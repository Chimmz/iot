import React, { useState, useEffect, useRef } from 'react';

function Input(props) {
   const inputRef = useRef();
   const [userInput, setUserInput] = useState(props.initValue ?? '');

   useEffect(() => props.uponChange?.(props.name, userInput), [userInput]);

   const handleChange = ev => setUserInput(inputRef.current.value);
   const reset = () => setUserInput('');

   return (
      <input
         type={props.type || 'text'}
         id={props.id}
         className={props.className}
         placeholder={props.placeholder}
         value={userInput}
         onChange={handleChange}
         ref={inputRef}
      />
   );
}

export default Input;
