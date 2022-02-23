import React from 'react';
import Form from 'react-bootstrap/Form';

function InputField({ validationErrors, children, ...restProps }) {
   // console.log(validationErrors);
   const errorExists = Boolean(validationErrors.length);

   return (
      <>
         <Form.Control {...restProps} isInvalid={errorExists} />

         {errorExists && (
            <Form.Control.Feedback type='invalid' tooltip>
               {validationErrors[0].msg}
            </Form.Control.Feedback>
         )}
      </>
   );
}

export default InputField;
