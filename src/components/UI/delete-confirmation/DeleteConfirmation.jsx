import React, { useState } from 'react';
import Dialog from '../dialog/Dialog';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

function DeleteConfirmation(props) {
   const { show, bodyText, onDelete, close, onDeleteLoading } = props;
   if (!show) return <></>;

   const handleDelete = () => onDelete().then(close);

   const deleteBtnText = !onDeleteLoading ? (
      'Yes, delete'
   ) : (
      <div className='d-flex align-items-center'>
         Deleting...
         <Spinner animation='border' size='sm' />
      </div>
   );

   return (
      <Dialog show={show}>
         <Dialog.Header>
            <h2>Delete Confirmation</h2>
         </Dialog.Header>
         <Dialog.Body>
            {bodyText || 'Are you sure you want to delete?'}
         </Dialog.Body>
         <Dialog.Footer>
            <Button
               variant='danger'
               onClick={handleDelete}
               disabled={onDeleteLoading}
               style={{ color: 'red' }}>
               {deleteBtnText}
            </Button>
            <Button variant='outline-dark ' onClick={close}>
               Cancel
            </Button>
         </Dialog.Footer>
      </Dialog>
   );
}

export default DeleteConfirmation;
