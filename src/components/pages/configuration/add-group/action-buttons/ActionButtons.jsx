import React from 'react';
import BoostrapSpinner from 'react-bootstrap/Spinner';

function ActionButtons({ isAddingGroup, close }) {
   const btnSaveHTML = !isAddingGroup ? (
      'Save'
   ) : (
      <div className="d-flex align-items-center" style={{ gap: '10px' }}>
         Saving <BoostrapSpinner animation="border" size="sm" />
      </div>
   );

   return (
      <>
         <button
            type="submit"
            className="rounded btn btn-primary"
            data-dismiss="modal"
            aria-label="Close"
            disabled={isAddingGroup}
         >
            {btnSaveHTML}
         </button>
         <button
            type="button"
            className="rounded btn btn-outline-dark"
            data-dismiss="modal"
            aria-label="Close"
            onClick={close}
         >
            Cancel
         </button>
      </>
   );
}

export default ActionButtons;
