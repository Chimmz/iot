import React from 'react';

const Form = function ({ submitHandler, children, ...others }) {
   return (
      <form onSubmit={submitHandler} {...others}>
         {children}
      </form>
   );
};

export default Form;
