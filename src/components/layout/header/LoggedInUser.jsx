import React, { useState } from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import * as userSelectors from '../../../redux/user/user-selectors';
import * as userCreators from '../../../redux/user/user-action-creators';

// Hooks
import useToggle from '../../../hooks/useToggle';

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import AccountSetting from '../../pages/account-settings/AccountSetting';
import { getFullName } from '../../../redux/user/user-utils';

function LoggedInUser({ currentUser, logout, portfolios }) {
   const [showDropdown, toggleShowDropdown] = useToggle(false);
   const [displayPasswordModal, setDisplayPasswordModal] = useState(false);
   const [accountSetting, setAccountSetting] = useState(false);
   const [displayPasswordSuccessModal, setDisplayPasswordSuccessModal] =
      useState(false);
   const handleClose = () => setAccountSetting(false);

   const handleToggleDisplayPasswordModal = displayPasswordSuccessModal => {
      setDisplayPasswordModal(!displayPasswordModal);
      if (
         typeof displayPasswordSuccessModal == 'boolean' &&
         displayPasswordModal
      ) {
         setDisplayPasswordSuccessModal(true);
         setTimeout(() => {
            setDisplayPasswordSuccessModal(false);
         }, 5000);
      }
   };

   return (
      <>
         <li className="nav-item dropdown profileDrop">
            <DropdownButton
               title={
                  <>
                     {/* <img
                        src={process.env.PUBLIC_URL + '/images/user.png'}
                        className='rounded'
                        width='45'
                        height='45'
                        alt='admin-user-img'
                        // onClick={toggleShowDropdown}
                     /> */}
                     <span className="d-block rounded">
                        {getFullName.call(currentUser)}
                     </span>
                  </>
               }
               id="input-group-dropdown-2"
               align="end"
               variant="none"
               // aria-expanded={showDropdown}
            >
               <p className="dropdown-item mb-0">
                  <small>Welcome !</small>
               </p>
               <Dropdown.Item
                  href="#"
                  onClick={() => {
                     setAccountSetting(true);
                  }}
               >
                  <img
                     src={process.env.PUBLIC_URL + '/images/icons/setting.svg'}
                     alt="setting-icon"
                  />{' '}
                  Account Setting
               </Dropdown.Item>

               <Dropdown.Divider />
               <Dropdown.Item href="#" onClick={logout}>
                  <img
                     src={process.env.PUBLIC_URL + '/images/icons/logout.svg'}
                     alt="logout-icon"
                  />{' '}
                  Signout
               </Dropdown.Item>
            </DropdownButton>
         </li>
         {accountSetting && (
            <AccountSetting
               currentUser={currentUser}
               portfolios={portfolios}
               accountSetting={accountSetting}
               handleClose={handleClose}
               displayPasswordModal={displayPasswordModal}
               handleToggleDisplayPasswordModal={
                  handleToggleDisplayPasswordModal
               }
               displayPasswordSuccessModal={displayPasswordSuccessModal}
            />
         )}
      </>
   );
}

const mapStateToProps = createStructuredSelector({
   currentUser: userSelectors.selectCurrentUser,
});

const mapDispatchToProps = dispatch => ({
   logout: () => dispatch(userCreators.logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoggedInUser);
