import React from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import * as userSelectors from '../../../../redux/user/user-selectors';
import * as userCreators from '../../../../redux/user/user-action-creators';

// Hooks
import useToggle from '../../../../hooks/useToggle';

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

function LoggedInUser({ currentUser, logout }) {
   const [showDropdown, toggleShowDropdown] = useToggle(false);

   const { firstName, lastName } = currentUser;
   const fullName = firstName + ' ' + lastName;

   return (
      <li className='nav-item dropdown profileDrop'>
         <DropdownButton
            title={
               <>
                  <img
                     src={process.env.PUBLIC_URL + '/images/user.png'}
                     className='rounded'
                     width='45'
                     height='45'
                     alt='admin-user-img'
                     // onClick={toggleShowDropdown}
                  />
                  <span className='d-block rounded'>{fullName}</span>
               </>
            }
            id='input-group-dropdown-2'
            align='end'
            variant='none'
            aria-expanded={showDropdown}>
            <Dropdown.Item href='#'>
               <img
                  src={process.env.PUBLIC_URL + '/images/icons/setting.svg'}
                  alt='setting-icon'
               />{' '}
               Account Setting
            </Dropdown.Item>

            <Dropdown.Divider />
            <Dropdown.Item href='#' onClick={logout}>
               <img
                  src={process.env.PUBLIC_URL + '/images/icons/logout.svg'}
                  alt='logout-icon'
               />{' '}
               Signout
            </Dropdown.Item>
         </DropdownButton>
      </li>
   );
}

const mapStateToProps = createStructuredSelector({
   currentUser: userSelectors.selectCurrentUser
});

const mapDispatchToProps = dispatch => ({
   logout: () => dispatch(userCreators.logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(LoggedInUser);
