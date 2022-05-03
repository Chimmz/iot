import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import * as userSelectors from '../../../../redux/user/user-selectors';
import * as portfolioSelectors from '../../../../redux/portfolio/portfolio-selectors';

import API from '../../../../utils/apiUtils';
import * as userUtils from '../../../../redux/user/user-utils';

import useInput from '../../../../hooks/useInput';
import useMultiSelect from '../../../../hooks/useMultiSelect';
import useFetch from '../../../../hooks/useFetch';
import { useUsersListContext } from '../../../../contexts/usersListContext';

import { getRoleOptions } from './utils';
import InputGroup from 'react-bootstrap/InputGroup';
import MultipleSelect from '../../../UI/multi-select/MultipleSelect';
import Spinner from '../../../UI/spinner/Spinner';
// Bootstrap imports
import BoostrapSpinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Backdrop from '../../../UI/backdrop/Backdrop';
import InputField from '../../../UI/InputField';

function UserInfo({ user, show, close, currentUser, userToken }) {
   const { wasUpdated, setWasUpdated } = useUsersListContext();
   const [fieldsEditable, setFieldsEditable] = useState(false);
   // Current values
   const currentFullName = userUtils.getFullName(user);
   const [currentFirstName, currentLastName] = currentFullName.split(' ');

   const userCurrentRoles = {
      access: user?.roles?.find(({ roleType }) => roleType === 'ACCESS'),
      view: user?.roles?.find(({ roleType }) => roleType === 'VIEW')
   };

   const { sendRequest: sendRoleRequests, loading: roleRequestsLoading } =
      useFetch();
   const { sendRequest: sendUpdateRequest, loading: updateRequestLoading } =
      useFetch();

   const [roleTypes, setRoleTypes] = useState({ access: [], view: [] });

   const getRoleById = (id, type) => {
      const isValidType = ['access', 'view'].includes(type);
      if (!isValidType) return null;

      const role = roleTypes[type].find(role => role.roleId == id);
      return role;
   };

   const {
      inputValue: firstName,
      handleChange: handleChangeFirstName,
      runValidators: runFirstNameValidators,
      validationErrors: firstNameValidationErrors,
      setValidationErrors: setFirstNameValidationErrors
   } = useInput({
      init: currentFirstName.trim(),
      validators: [{ isRequired: [] }]
   });

   const {
      inputValue: lastName,
      handleChange: handleChangeLastName,
      runValidators: runLastNameValidators,
      validationErrors: lastNameValidationErrors,
      setValidationErrors: setLastNameValidationErrors
   } = useInput({
      init: currentLastName.trim(),
      validators: [{ isRequired: [] }]
   });

   const {
      inputValue: propertyName,
      handleChange: handleChangePropertyName,
      runValidators: runPropertyNameValidators,
      validationErrors: propertyNameValidationErrors,
      setValidationErrors: setPropertyNameValidationErrors
   } = useInput({ init: user.portfolioName, validators: [{ isRequired: [] }] });

   const {
      inputValue: email,
      handleChange: handleChangeEmail,
      runValidators: runEmailValidators,
      validationErrors: emailValidationErrors,
      setValidationErrors: setEmailValidationErrors
   } = useInput({ init: user.emailId, validators: [{ isRequired: [] }] });

   const {
      inputValue: phone,
      handleChange: handleChangePhone,
      runValidators: runPhoneValidators,
      validationErrors: phoneValidationErrors,
      setValidationErrors: setPhoneValidationErrors
   } = useInput({ init: user.contactNumber, validators: [{ isRequired: [] }] });

   const {
      inputValue: accessRole,
      handleChange: handleChangeAccessRole,
      runValidators: runAccessRoleValidators,
      validationErrors: accessRoleErrors,
      setValidationErrors: setAccessRoleErrors
   } = useInput({
      init: userCurrentRoles.access.roleId,
      validators: [{ isRequired: [] }]
   });

   const {
      inputValue: viewRole,
      handleChange: handleChangeViewRole,
      runValidators: runViewRoleValidators,
      validationErrors: viewRoleErrors,
      setValidationErrors: setViewRoleErrors
   } = useInput({
      init: userCurrentRoles.view.roleId,
      validators: [{ isRequired: [] }]
   });

   const updateUser = () => {
      const body = {
         ...user,
         firstName,
         lastName,
         portfolioName: propertyName,
         emailId: email,
         contactNumber: phone,
         roles: [
            getRoleById(accessRole, 'access'),
            getRoleById(viewRole, 'view')
         ]
      };
      const request = sendUpdateRequest(
         API.updateUser(
            JSON.stringify(body),
            +currentUser.userId,
            +user.userId,
            userToken
         )
      );
      request.then(res => {
         if (res?.errors) return; // Handle errors here
         setWasUpdated(true);
         close();
      });
      request.catch(console.log);
   };

   const handleSubmit = ev => {
      ev.preventDefault();
      !fieldsEditable ? setFieldsEditable(true) : updateUser();
   };

   useEffect(async () => {
      const requests = [
         API.getRolesByType('access', userToken),
         API.getRolesByType('view', userToken)
      ];

      const [accessTypes, viewTypes] = await sendRoleRequests(
         Promise.all([...requests])
      );

      setRoleTypes(currState => ({
         ...currState,
         access: accessTypes,
         view: viewTypes
      }));
   }, []);

   const containerClassName = `add-group thin-scrollbar ${
      show ? 'show' : 'fade'
   }`;
   return (
      <>
         <div className={containerClassName}>
            <h2 className='page-heading fw-600 mb-lg my-sm-5'>User Info</h2>
            <form className='w-md-75' onSubmit={handleSubmit}>
               {/* USERNAME */}
               <InputGroup className='mb-4 row'>
                  <label
                     htmlFor={firstName}
                     className='col-sm-4 col-form-label'>
                     User Name
                  </label>
                  {!fieldsEditable ? (
                     <div className='col-sm-8' style={{ position: 'relative' }}>
                        <span>{currentFullName}</span>
                     </div>
                  ) : (
                     <>
                        <div
                           className='col-sm-4'
                           style={{ position: 'relative' }}>
                           <InputField
                              type='text'
                              id={firstName}
                              className=''
                              value={firstName}
                              onChange={handleChangeFirstName}
                              validationErrors={firstNameValidationErrors}
                           />
                        </div>
                        <div
                           className='col-sm-4'
                           style={{ position: 'relative' }}>
                           <InputField
                              type='text'
                              id={lastName}
                              className=''
                              value={lastName}
                              onChange={handleChangeLastName}
                              validationErrors={lastNameValidationErrors}
                           />
                        </div>
                     </>
                  )}
               </InputGroup>

               {/* LASTNAME */}

               {/* PROPERTY NAME */}
               <InputGroup className='mb-4 row'>
                  <label
                     htmlFor={user.portfolioName}
                     className='col-sm-4 col-form-label'>
                     Property Name
                  </label>
                  <div className='col-sm-8' style={{ position: 'relative' }}>
                     {!fieldsEditable ? (
                        <span>{user.portfolioName}</span>
                     ) : (
                        <Form.Select
                           onChange={handleChangePropertyName}
                           aria-label='Default select example'
                           value={user.portfolioName}>
                           <option value={user.portfolioName}>
                              {user.portfolioName}
                           </option>
                        </Form.Select>
                     )}
                  </div>
               </InputGroup>

               {/* EMAIL */}
               <InputGroup className='mb-4 row'>
                  <label
                     htmlFor={user.emailId}
                     className='col-sm-4 col-form-label'>
                     Primary Email
                  </label>
                  <div className='col-sm-8' style={{ position: 'relative' }}>
                     {!fieldsEditable ? (
                        <span>{user.emailId}</span>
                     ) : (
                        <InputField
                           type='text'
                           id={user.emailId}
                           className=''
                           value={email}
                           onChange={handleChangeEmail}
                           validationErrors={emailValidationErrors}
                        />
                     )}
                  </div>
               </InputGroup>

               {/* PHONE NUMBER */}
               <InputGroup className='mb-4 row'>
                  <label
                     htmlFor={user.contactNumber}
                     className='col-sm-4 col-form-label'>
                     Phone
                  </label>
                  <div className='col-sm-8' style={{ position: 'relative' }}>
                     {!fieldsEditable ? (
                        <span>{user.contactNumber}</span>
                     ) : (
                        <InputField
                           type='number'
                           id={user.contactNumber}
                           className=''
                           value={phone}
                           onChange={handleChangePhone}
                           validationErrors={phoneValidationErrors}
                        />
                     )}
                  </div>
               </InputGroup>

               {/* DEFINE ROLE */}
               <InputGroup className='mb-4 row'>
                  <label
                     htmlFor='groupName'
                     className='col-sm-4 col-form-label'>
                     Define Role
                  </label>
                  <div className='col-sm-8' style={{ position: 'relative' }}>
                     {!fieldsEditable ? (
                        <span>{userCurrentRoles.access.name}</span>
                     ) : (
                        <Form.Select
                           onChange={handleChangeAccessRole}
                           aria-label='Default select example'
                           value={accessRole}>
                           <option>Select a role</option>

                           {roleTypes.access.map(({ roleId, name }) => (
                              <option key={roleId} value={roleId}>
                                 {name}
                              </option>
                           ))}
                        </Form.Select>
                     )}
                  </div>
               </InputGroup>

               <InputGroup className='mb-4 row'>
                  <label
                     htmlFor='groupName'
                     className='col-sm-4 col-form-label'>
                     Add Group
                  </label>
                  <div className='col-sm-8' style={{ position: 'relative' }}>
                     <span>{user.roleName}</span>
                     {!fieldsEditable ? (
                        <span>{userCurrentRoles.view.name}</span>
                     ) : (
                        <Form.Select
                           onChange={handleChangeViewRole}
                           aria-label='Default select example'
                           value={viewRole}>
                           <option>Select a role</option>

                           {roleTypes.view.map(({ roleId, name }) => (
                              <option key={roleId} value={roleId}>
                                 {name}
                              </option>
                           ))}
                        </Form.Select>
                     )}
                  </div>
               </InputGroup>

               <div className='actions'>
                  <button
                     type='submit'
                     className='rounded btn btn-primary'
                     data-dismiss='modal'
                     aria-label='Close'
                     // disabled={addGroupRequestLoading}
                  >
                     {updateRequestLoading ? (
                        <div className='d-flex align-items-center'>
                           Saving...
                           <BoostrapSpinner
                              animation='border'
                              size='sm'></BoostrapSpinner>
                        </div>
                     ) : !fieldsEditable ? (
                        'Edit'
                     ) : (
                        'Save'
                     )}
                  </button>
                  <button
                     type='button'
                     className='rounded btn btn-outline-dark'
                     data-dismiss='modal'
                     aria-label='Close'
                     onClick={close}>
                     Cancel
                  </button>
               </div>
            </form>
         </div>

         <Backdrop show={show} />
      </>
   );
}

const mapStateToProps = createStructuredSelector({
   currentUser: userSelectors.selectCurrentUser,
   currentUserRoles: userSelectors.selectCurrentUserRoles,
   userToken: userSelectors.selectUserToken
});

export default connect(mapStateToProps)(UserInfo);
