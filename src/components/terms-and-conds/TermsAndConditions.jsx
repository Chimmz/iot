import React, { useState, useRef } from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as userSelectors from '../../redux/user/user-selectors';

// Hooks
import useToggle from '../../hooks/useToggle';

// Utils
import API from '../../utils/apiUtils';

// External components
import { Button } from 'react-bootstrap';
import Dialog from '../UI/dialog/Dialog';

import './TermsAndConditions.scss';

function TermsAndConditions(props) {
   const { legalUser, currentUser, userToken } = props;
   const [showModal, setShowModal] = useState(true);

   const checkboxRef = useRef();
   const [userAgreed, toggleUserAgreed] = useToggle(
      checkboxRef.current?.checked
   );

   const handleContinue = () => {
      if (!userAgreed) return;

      API.acceptTermsAndConditions(currentUser.userId, userToken)
         .then(res => setShowModal(false))
         .catch(err => setShowModal(false));
   };

   if (!showModal) return <></>;

   return (
      <Dialog>
         <Dialog.Header canClose={false}>
            <h3>Terms & Conditions</h3>
         </Dialog.Header>

         <Dialog.Body>
            <p>{legalUser?.description || ''}</p>
            <p>{legalUser?.extendedDescription || ''}</p>
         </Dialog.Body>

         <Dialog.Footer>
            <div className="i-accept">
               <input
                  type="checkbox"
                  onChange={toggleUserAgreed}
                  ref={checkboxRef}
                  id="agree"
               />
               <label htmlFor="agree">I accept</label>
            </div>

            <Button
               type="submit"
               className="btn btn-success btn-block shadow border-0 py-2 text-uppercase"
               disabled={!userAgreed}
               onClick={handleContinue}
            >
               Continue
            </Button>
         </Dialog.Footer>
      </Dialog>
   );
}

const mapStateToProps = createStructuredSelector({
   currentUser: userSelectors.selectCurrentUser,
   userToken: userSelectors.selectUserToken
});

export default connect(mapStateToProps)(TermsAndConditions);
