import React from 'react';
import Form from 'react-bootstrap/Form';

function InputField({ validationErrors, children, fieldType, ...restProps }) {
   // console.log(validationErrors);
   const errorExists = Boolean(validationErrors?.length);

   return (
      <>
         <Form.Control
            {...restProps}
            as={fieldType}
            isInvalid={errorExists}
            autoComplete="off"
         />

         {errorExists && (
            <Form.Control.Feedback type="invalid" tooltip>
               {validationErrors?.[0].msg}
            </Form.Control.Feedback>
         )}
      </>
   );
}

export default InputField;
