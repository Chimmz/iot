import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import * as userSelectors from '../../../../redux/user/user-selectors';
import * as portfolioSelectors from '../../../../redux/portfolio/portfolio-selectors';

import API from '../../../../utils/apiUtils';

import useList from '../../../../hooks/useList';
import useFetch from '../../../../hooks/useFetch';
import useMultiSelect from '../../../../hooks/useMultiSelect';
import useInput from '../../../../hooks/useInput';

import { useUsersListContext } from '../../../../contexts/usersListContext';

import InputField from '../../../UI/InputField';
import MultipleSelect from '../../../UI/multi-select/MultipleSelect';
import Spinner from '../../../UI/spinner/Spinner';
import Backdrop from '../../../UI/backdrop/Backdrop';

import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import BoostrapSpinner from 'react-bootstrap/Spinner';

function AddNewUser({ currentUser, currentUserRoles, portfolios, userToken }) {
   const navigate = useNavigate();
   const isLoggedInUserSuperAdmin = currentUserRoles.some(
      ({ code }) => code === 'SUPER_ADMIN'
   );

   const { wasUpdated, setWasUpdated } = useUsersListContext();
   const { sendRequest: sendManyRequests, loading: manyRequestsLoading } =
      useFetch();
   const { sendRequest: sendAddUserRequest, loading: addUserRequestLoading } =
      useFetch();

   const [propertyOptions, setPropertyOptions] = useState([]);
   const [roleTypes, setRoleTypes] = useState({ access: [], view: [] });

   const {
      inputValue: firstName,
      handleChange: handleChangeFirstName,
      runValidators: runFirstNameValidators,
      validationErrors: firstNameValidationErrors,
      setValidationErrors: setFirstNameValidationErrors
   } = useInput({ init: '', validators: [{ isRequired: [] }] });

   const {
      inputValue: lastName,
      handleChange: handleChangeLastName,
      runValidators: runLastNameValidators,
      validationErrors: lastNameValidationErrors,
      setValidationErrors: setLastNameValidationErrors
   } = useInput({ init: '', validators: [{ isRequired: [] }] });

   const {
      inputValue: propertyName,
      handleChange: handleChangePropertyName,
      runValidators: runPropertyNameValidators,
      validationErrors: propertyNameValidationErrors,
      setValidationErrors: setPropertyNameValidationErrors
   } = useInput({ init: '', validators: [{ isRequired: [] }] });

   const {
      inputValue: email,
      handleChange: handleChangeEmail,
      runValidators: runEmailValidators,
      validationErrors: emailValidationErrors,
      setValidationErrors: setEmailValidationErrors
   } = useInput({ init: '', validators: [{ isRequired: [] }] });

   const {
      inputValue: phone,
      handleChange: handleChangePhone,
      runValidators: runPhoneValidators,
      validationErrors: phoneValidationErrors,
      setValidationErrors: setPhoneValidationErrors
   } = useInput({ init: '', validators: [{ isRequired: [] }] });

   const {
      inputValue: accessRoleId,
      handleChange: handleChangeAccessRole,
      runValidators: runAccessRoleValidators,
      validationErrors: accessRoleErrors,
      setValidationErrors: setAccessRoleErrors
   } = useInput({ init: '', validators: [{ isRequired: [] }] });

   const {
      inputValue: viewRoleId,
      handleChange: handleChangeViewRole,
      runValidators: runViewRoleValidators,
      validationErrors: viewRoleErrors,
      setValidationErrors: setViewRoleErrors
   } = useInput({ init: '', validators: [{ isRequired: [] }] });

   const close = () => navigate(-1);

   const getRoleById = (id, type) => {
      const validTypes = ['access', 'view'];
      if (!validTypes.includes(type)) return null;
      return roleTypes[type].find(role => role.roleId == id);
   };

   const createUser = async () => {
      const assignedRoles = [getRoleById(accessRoleId, 'access')];
      if (viewRoleId) assignedRoles.push(getRoleById(viewRoleId, 'view'));

      const selectedProperty = propertyOptions.find(
         ({ name }) => name === propertyName
      );
      const body = {
         firstName,
         lastName,
         isDefaultPassword: true,
         portfolioName: propertyName,
         emailId: email,
         contactNumber: phone,
         isAccepted: false,
         roles: [...assignedRoles],
         portfolioHeaderID: selectedProperty.portfolioHeaderId,
         statusCode: 'INACTIVE',
         userStatusId: 2,
         status: 'Inactive',
         portfolioName: propertyName
      };
      console.log(body);

      const req = sendAddUserRequest(
         API.createUser(JSON.stringify(body), currentUser.userId, userToken)
      );

      req.then(res => {
         console.log(res);
         if (res == 1) {
            setWasUpdated(true);
            close();
         }
      });
   };

   const handleSubmit = ev => {
      ev.preventDefault();

      // Each items in this array returns an array of errors
      const errors = [
         runFirstNameValidators(),
         runLastNameValidators(),
         runPropertyNameValidators(),
         runEmailValidators(),
         runPhoneValidators(),
         runAccessRoleValidators()
      ];

      if (!errors.flat().length) return createUser();
      [
         setFirstNameValidationErrors,
         setLastNameValidationErrors,
         setPropertyNameValidationErrors,
         setEmailValidationErrors,
         setPhoneValidationErrors,
         setAccessRoleErrors
      ].forEach((set, i) => set(errors[i]));
   };

   const executeRequests = async requests => {
      const responses = await sendManyRequests(Promise.all(requests));
      const [accessTypes, viewTypes, allPortfolios] = responses;
      // prettier-ignore
      setRoleTypes(state => ({ ...state, access: accessTypes, view: viewTypes }));
      if (isLoggedInUserSuperAdmin) setPropertyOptions(allPortfolios);
   };

   useEffect(() => {
      const requests = [
         API.getRolesByType('access', userToken),
         API.getRolesByType('view', userToken)
      ];

      if (!isLoggedInUserSuperAdmin) setPropertyOptions(portfolios);
      else requests.push(API.getAllPortfolio(userToken));
      executeRequests(requests);
   }, []);

   return (
      <>
         <div className='add-group thin-scrollbar'>
            <h2 className='page-heading fw-600 mb-lg my-sm-5'>Add New User</h2>
            <form onSubmit={handleSubmit} className='w-md-75'>
               {/* prettier-ignore */}
               <InputGroup className='mb-4 row'>
                  <label
                     htmlFor={!firstName ? 'first name' : !lastName ? 'last name' : 'first name'}
                     className='col-sm-4 col-form-label'>
                     User Name
                  </label>
                  <>
                     <div className='col-sm-4' style={{ position: 'relative' }}>
                        <InputField
                           type='text'
                           placeholder='First name'
                           id='first name'
                           className=''
                           value={firstName}
                           onChange={handleChangeFirstName}
                           validationErrors={firstNameValidationErrors}
                        />
                     </div>
                     <div className='col-sm-4' style={{ position: 'relative' }}>
                        <InputField
                           type='text'
                           placeholder='Last name'
                           id='last name'
                           className=''
                           value={lastName}
                           onChange={handleChangeLastName}
                           validationErrors={lastNameValidationErrors}
                        />
                     </div>
                  </>
               </InputGroup>

               {/* PROPERTY NAME */}
               <InputGroup className='mb-4 row'>
                  <label
                     htmlFor='property name'
                     className='col-sm-4 col-form-label'>
                     Property Name
                  </label>
                  <div className='col-sm-8' style={{ position: 'relative' }}>
                     <Form.Select
                        id='property name'
                        onChange={handleChangePropertyName}
                        aria-label='Default select example'
                        value={propertyName}>
                        <option>Assign property</option>
                        {propertyOptions.map(property => (
                           <option key={property.name} value={property.name}>
                              {property.name}
                           </option>
                        ))}
                     </Form.Select>
                  </div>
               </InputGroup>

               <InputGroup className='mb-4 row'>
                  <label htmlFor='email' className='col-sm-4 col-form-label'>
                     Primary Email
                  </label>
                  <div className='col-sm-8' style={{ position: 'relative' }}>
                     <InputField
                        type='text'
                        id='email'
                        className=''
                        value={email}
                        onChange={handleChangeEmail}
                        validationErrors={emailValidationErrors}
                     />
                  </div>
               </InputGroup>

               <InputGroup className='mb-4 row'>
                  <label htmlFor='phone' className='col-sm-4 col-form-label'>
                     Phone
                  </label>
                  <div className='col-sm-8' style={{ position: 'relative' }}>
                     <InputField
                        type='number'
                        id='phone'
                        className=''
                        min='1'
                        value={phone}
                        onChange={handleChangePhone}
                        validationErrors={phoneValidationErrors}
                     />
                  </div>
               </InputGroup>

               {/* DEFINE ROLE */}
               <InputGroup className='mb-4 row'>
                  <label
                     htmlFor='access role'
                     className='col-sm-4 col-form-label'>
                     Define Role
                  </label>
                  <div className='col-sm-8' style={{ position: 'relative' }}>
                     <Form.Select
                        id='access role'
                        onChange={handleChangeAccessRole}
                        aria-label='Default select example'>
                        <option>Assign a role</option>

                        {roleTypes.access.map(({ roleId, name }) => (
                           <option key={roleId} value={roleId}>
                              {name}
                           </option>
                        ))}
                     </Form.Select>
                  </div>
               </InputGroup>

               <InputGroup className='mb-4 row'>
                  <label
                     htmlFor='view role'
                     className='col-sm-4 col-form-label'>
                     Add Group
                  </label>
                  <div className='col-sm-8' style={{ position: 'relative' }}>
                     <Form.Select
                        id='view role'
                        onChange={handleChangeViewRole}
                        aria-label='Default select example'>
                        <option>Assign a role</option>

                        {roleTypes.view.map(({ roleId, name }) => (
                           <option key={roleId} value={roleId}>
                              {name}
                           </option>
                        ))}
                     </Form.Select>
                  </div>
               </InputGroup>

               <div className='actions'>
                  <button
                     type='submit'
                     className='rounded btn btn-primary'
                     data-dismiss='modal'
                     aria-label='Close'
                     style={{ width: 'fit-content' }}
                     disabled={addUserRequestLoading}>
                     <div
                        className='d-flex align-items-center'
                        style={{ gap: '10px' }}>
                        Create new user
                        {addUserRequestLoading && (
                           <BoostrapSpinner
                              animation='border'
                              size='sm'></BoostrapSpinner>
                        )}
                     </div>
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
         <Backdrop show={true} />
      </>
   );
}

const mapStateToProps = createStructuredSelector({
   currentUser: userSelectors.selectCurrentUser,
   currentUserRoles: userSelectors.selectCurrentUserRoles,
   portfolios: portfolioSelectors.selectPortfolioItems,
   userToken: userSelectors.selectUserToken
});

export default connect(mapStateToProps)(AddNewUser);
