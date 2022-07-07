import React, { useState, useEffect } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import * as userSelectors from '../../../../redux/user/user-selectors';
import * as userCreators from '../../../../redux/user/user-action-creators';
import * as portfolioSelectors from '../../../../redux/portfolio/portfolio-selectors';

import API from '../../../../utils/apiUtils';
import * as userUtils from '../../../../redux/user/user-utils';
import getRoleOptions from '../add-new-user/getRoleOptions';

import useInput from '../../../../hooks/useInput';
import useFetch from '../../../../hooks/useFetch';
import { useUsersListContext } from '../../../../contexts/usersListContext';

import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from '../../../UI/spinner/Spinner';
// Bootstrap imports
import BoostrapSpinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Backdrop from '../../../UI/backdrop/Backdrop';
import InputField from '../../../UI/InputField';

function UserInfo(props) {
   const { user, show, currentUser, dispatch } = props;
   const { setWasUpdated } = useUsersListContext();
   const [fieldsEditable, setFieldsEditable] = useState(false);
   const [roleTypes, setRoleTypes] = useState({ access: [], view: [] });

   const { sendRequest: sendRoleRequests, loading: roleRequestsLoading } =
      useFetch();
   const { sendRequest: sendUpdateRequest, loading: updateRequestLoading } =
      useFetch();
   // Current values
   const currentFullName = userUtils.getFullName.call(user);
   const [currentFirstName, currentLastName] = currentFullName.split(' ');
   const initialUserRoles = {
      access: userUtils.getUserAccessRole.call(user),
      view: userUtils.getUserViewRole.call(user),
   };
   // This is a Util function
   const getRoleById = (id, type) => {
      const validRoleTypes = ['access', 'view'];
      return !validRoleTypes.includes(type)
         ? null
         : roleTypes[type].find(role => +role.roleId === +id);
   };

   const {
      inputValue: firstName,
      handleChange: handleChangeFirstName,
      runValidators: runFirstNameValidators,
      validationErrors: firstNameValidationErrors,
      setValidationErrors: setFirstNameValidationErrors,
   } = useInput({
      init: currentFirstName.trim(),
      validators: [{ isRequired: [] }], // Uses default 'isRequired' error msg
   });

   const {
      inputValue: lastName,
      handleChange: handleChangeLastName,
      runValidators: runLastNameValidators,
      validationErrors: lastNameValidationErrors,
      setValidationErrors: setLastNameValidationErrors,
   } = useInput({
      init: currentLastName.trim(),
      validators: [{ isRequired: [] }], // Uses default 'isRequired' error msg
   });

   const {
      inputValue: propertyName,
      handleChange: handleChangePropertyName,
      runValidators: runPropertyNameValidators,
      validationErrors: propertyNameValidationErrors,
      setValidationErrors: setPropertyNameValidationErrors,
   } = useInput({ init: user.portfolioName, validators: [{ isRequired: [] }] });

   const {
      inputValue: email,
      handleChange: handleChangeEmail,
      runValidators: runEmailValidators,
      validationErrors: emailValidationErrors,
      setValidationErrors: setEmailValidationErrors,
   } = useInput({ init: user.emailId, validators: [{ isRequired: [] }] });

   const {
      inputValue: phone,
      handleChange: handleChangePhone,
      runValidators: runPhoneValidators,
      validationErrors: phoneValidationErrors,
      setValidationErrors: setPhoneValidationErrors,
   } = useInput({ init: user.contactNumber, validators: [{ isRequired: [] }] });

   const {
      inputValue: accessRole,
      handleChange: handleChangeAccessRole,
      runValidators: runAccessRoleValidators,
      validationErrors: accessRoleValidationErrors,
      setValidationErrors: setAccessRoleErrors,
   } = useInput({
      init: initialUserRoles.access.roleId,
      validators: [
         { isRequired: [] },
         { isNotSameAs: ['Select a role', 'This field is required'] },
      ],
   });

   const {
      inputValue: viewRole,
      handleChange: handleChangeViewRole,
      runValidators: runViewRoleValidators,
      validationErrors: viewRoleValidationErrors,
      setValidationErrors: setViewRoleErrors,
   } = useInput({
      init: initialUserRoles.view.roleId,
      validators: [
         { isRequired: [] },
         { isNotSameAs: ['Select a role', 'This field is required'] },
      ],
   });

   const runValidators = () => {
      const status = { errorExists: false };

      const errors = [
         runFirstNameValidators(),
         runLastNameValidators(),
         runPropertyNameValidators(),
         runEmailValidators(),
         runPhoneValidators(),
         runAccessRoleValidators(),
         runViewRoleValidators(),
      ];
      console.log(errors);
      if (!errors.flat().length) return status;

      [
         setFirstNameValidationErrors,
         setLastNameValidationErrors,
         setPropertyNameValidationErrors,
         setEmailValidationErrors,
         setPhoneValidationErrors,
         setAccessRoleErrors,
         setViewRoleErrors,
      ].forEach((set, i) => set(errors[i]));

      status.errorExists = true;
      return status;
   };

   const updateUser = () => {
      const { errorExists } = runValidators();
      if (errorExists) return;

      const body = {
         ...user,
         firstName,
         lastName,
         portfolioName: propertyName,
         emailId: email,
         contactNumber: phone,
         roles: [
            getRoleById(accessRole, 'access'),
            getRoleById(viewRole, 'view'),
         ],
      };
      const request = sendUpdateRequest(
         API.updateUser(
            JSON.stringify(body),
            +currentUser.userId,
            +user.userId,
            props.userToken
         )
      );

      request.then(res => {
         if (res?.errors) return console.log(res.errors);
         setWasUpdated(true);
         if (user.userId !== currentUser.userId) return props.close();

         const [accessRoleModified, viewRoleModified] = [
            +initialUserRoles.access.roleId !== +accessRole,
            +initialUserRoles.view.roleId !== +viewRole,
         ];
         if (accessRoleModified)
            return dispatch(
               userCreators.changeUserRole(
                  'access',
                  getRoleById(accessRole, 'access')
               )
            );
         if (viewRoleModified)
            dispatch(
               userCreators.changeUserRole(
                  'view',
                  getRoleById(viewRole, 'view')
               )
            );
         props.close();
      });
      request.catch(console.log);
   };

   const handleSubmit = ev => {
      ev.preventDefault();
      if (!props.isAuthorizedToEdit) return;
      fieldsEditable ? updateUser() : setFieldsEditable(true);
   };

   useEffect(() => {
      if (!fieldsEditable) return;
      const requests = [
         API.getRolesByType('access', props.userToken),
         API.getRolesByType('view', props.userToken),
      ];
      Promise.all([...requests]).then(responses => {
         const [accessTypes, viewTypes] = responses;
         setRoleTypes({
            access: getRoleOptions(props.currentUserAccessRole, accessTypes),
            view: viewTypes,
         });
      });
   }, [fieldsEditable]);

   const containerClassName = `add-group thin-scrollbar ${
      show ? 'show' : 'fade'
   }`;
   return (
      <>
         <Spinner show={roleRequestsLoading} noContent />
         <div className={containerClassName}>
            <h2 className="page-heading fw-600 mb-lg my-sm-5">User Info</h2>
            <form className="w-md-75 user-info" onSubmit={handleSubmit}>
               {/* USERNAME */}
               <InputGroup className="mb-4 row">
                  <label
                     htmlFor={firstName}
                     className="col-sm-4 col-form-label"
                  >
                     User Name
                  </label>
                  {!fieldsEditable ? (
                     <div className="col-sm-8" style={{ position: 'relative' }}>
                        <span>{currentFullName}</span>
                     </div>
                  ) : (
                     <>
                        <div
                           className="col-sm-4"
                           style={{ position: 'relative' }}
                        >
                           <InputField
                              type="text"
                              id={firstName}
                              className=""
                              value={firstName}
                              onChange={handleChangeFirstName}
                              validationErrors={firstNameValidationErrors}
                           />
                        </div>

                        {/* LASTNAME */}
                        <div
                           className="col-sm-4"
                           style={{ position: 'relative' }}
                        >
                           <InputField
                              type="text"
                              id={lastName}
                              className=""
                              value={lastName}
                              onChange={handleChangeLastName}
                              validationErrors={lastNameValidationErrors}
                           />
                        </div>
                     </>
                  )}
               </InputGroup>

               {/* PROPERTY NAME */}
               <InputGroup className="mb-4 row">
                  <label
                     htmlFor={user.portfolioName}
                     className="col-sm-4 col-form-label"
                  >
                     Property Name
                  </label>
                  <div className="col-sm-8" style={{ position: 'relative' }}>
                     {!fieldsEditable ? (
                        <span>{user.portfolioName}</span>
                     ) : (
                        <Form.Select
                           onChange={handleChangePropertyName}
                           aria-label="Default select example"
                           value={user.portfolioName}
                        >
                           <option value={user.portfolioName}>
                              {user.portfolioName}
                           </option>
                        </Form.Select>
                     )}
                  </div>
               </InputGroup>

               {/* EMAIL */}
               <InputGroup className="mb-4 row">
                  <label
                     htmlFor={user.emailId}
                     className="col-sm-4 col-form-label"
                  >
                     Primary Email
                  </label>
                  <div className="col-sm-8" style={{ position: 'relative' }}>
                     {!fieldsEditable ? (
                        <span>{user.emailId}</span>
                     ) : (
                        <InputField
                           type="text"
                           id={user.emailId}
                           className=""
                           value={email}
                           onChange={handleChangeEmail}
                           validationErrors={emailValidationErrors}
                        />
                     )}
                  </div>
               </InputGroup>

               {/* PHONE NUMBER */}
               <InputGroup className="mb-4 row">
                  <label
                     htmlFor={user.contactNumber}
                     className="col-sm-4 col-form-label"
                  >
                     Phone
                  </label>
                  <div className="col-sm-8" style={{ position: 'relative' }}>
                     {!fieldsEditable ? (
                        <span>{user.contactNumber}</span>
                     ) : (
                        <InputField
                           type="number"
                           id={user.contactNumber}
                           className=""
                           value={phone}
                           onChange={handleChangePhone}
                           validationErrors={phoneValidationErrors}
                        />
                     )}
                  </div>
               </InputGroup>

               {/* DEFINE ROLE */}
               <InputGroup className="mb-4 row">
                  <label
                     htmlFor="groupName"
                     className="col-sm-4 col-form-label"
                  >
                     Define Role
                  </label>
                  <div className="col-sm-8" style={{ position: 'relative' }}>
                     {!fieldsEditable ? (
                        <span>{initialUserRoles.access.name}</span>
                     ) : (
                        <Form.Select
                           onChange={handleChangeAccessRole}
                           aria-label="Default select example"
                           className={
                              accessRoleValidationErrors?.[0] && 'is-invalid'
                           }
                           value={accessRole}
                        >
                           <option>Select a role</option>
                           {roleTypes.access.map(({ roleId, name }) => (
                              <option key={roleId} value={roleId}>
                                 {name}
                              </option>
                           ))}
                        </Form.Select>
                     )}
                     <div className="invalid-tooltip">
                        {accessRoleValidationErrors?.[0]?.msg || ''}
                     </div>
                  </div>
               </InputGroup>

               <InputGroup className="mb-4 row">
                  <label
                     htmlFor="groupName"
                     className="col-sm-4 col-form-label"
                  >
                     Add Group
                  </label>
                  <div className="col-sm-8" style={{ position: 'relative' }}>
                     <span>{user.roleName}</span>
                     {!fieldsEditable ? (
                        <span>{initialUserRoles.view.name}</span>
                     ) : (
                        <Form.Select
                           onChange={handleChangeViewRole}
                           aria-label="Default select example"
                           value={viewRole}
                           className={
                              viewRoleValidationErrors?.[0] && 'is-invalid'
                           }
                        >
                           <option>Select a role</option>

                           {roleTypes.view.map(({ roleId, name }) => (
                              <option key={roleId} value={roleId}>
                                 {name}
                              </option>
                           ))}
                        </Form.Select>
                     )}
                     <div className="invalid-tooltip">
                        {viewRoleValidationErrors?.[0]?.msg || ''}
                     </div>
                  </div>
               </InputGroup>

               <div className="actions">
                  {props.isAuthorizedToEdit && (
                     <button
                        type="submit"
                        className="rounded btn btn-primary"
                        data-dismiss="modal"
                        aria-label="Close"
                        // disabled={addGroupRequestLoading}
                     >
                        {updateRequestLoading ? (
                           <div className="d-flex align-items-center">
                              Saving...
                              <BoostrapSpinner
                                 animation="border"
                                 size="sm"
                              ></BoostrapSpinner>
                           </div>
                        ) : !fieldsEditable ? (
                           'Edit'
                        ) : (
                           'Save'
                        )}
                     </button>
                  )}
                  <button
                     type="button"
                     className="rounded btn btn-outline-dark"
                     data-dismiss="modal"
                     aria-label="Close"
                     onClick={props.close}
                  >
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
   currentUserAccessRole: userSelectors.selectUserAccessRole,
   currentUserRoles: userSelectors.selectCurrentUserRoles,
   userToken: userSelectors.selectUserToken,
});

export default connect(mapStateToProps)(UserInfo);
