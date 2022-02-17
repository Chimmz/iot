import React from 'react';

const Form = function ({ submitHandler, children, ...others }) {
   const handleSubmit = ev => {
      ev.preventDefault();
      submitHandler();
   };

   return (
      <form onSubmit={handleSubmit} {...others}>
         {children}
      </form>
   );
};

export default Form;
