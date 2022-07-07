import React, { useState } from 'react';
import Dialog from '../dialog/Dialog';
import Button from 'react-bootstrap/Button';

function ErrorModal({ errorTitle, errorMsg, show, close }) {
   return (
      <Dialog show={show} close={close} closable>
         <Dialog.Header>
            <h2>{errorTitle || 'Error'}</h2>
         </Dialog.Header>
         <Dialog.Body>{errorMsg || 'Bad request'}</Dialog.Body>
      </Dialog>
   );
}

export default ErrorModal;
