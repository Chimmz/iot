import React, { useState } from 'react';
import Dialog from '../dialog/Dialog';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

function DeleteConfirmation(props) {
   const { show, confirmMsg, deleteAction, close, isDeleting } = props;

   const deleteBtnJSX = isDeleting ? (
      <div className="d-flex align-items-center">
         Deleting...
         <Spinner animation="border" size="sm" />
      </div>
   ) : (
      'Yes, delete'
   );

   if (!show) return <></>;
   return (
      <Dialog show={show} close={close} closable>
         <Dialog.Header>
            <h2>Delete Confirmation</h2>
         </Dialog.Header>
         <Dialog.Body>
            {confirmMsg || 'Are you sure you want to delete?'}
         </Dialog.Body>
         <Dialog.Footer>
            <Button
               variant="danger"
               onClick={deleteAction}
               disabled={isDeleting}
            >
               {deleteBtnJSX}
            </Button>
            <Button variant="outline-dark " onClick={close}>
               Cancel
            </Button>
         </Dialog.Footer>
      </Dialog>
   );
}

export default DeleteConfirmation;
