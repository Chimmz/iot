import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import * as userSelectors from '../../../../redux/user/user-selectors';
import * as portfolioSelectors from '../../../../redux/portfolio/portfolio-selectors';
import * as notifCreators from '../../../../redux/notification/notification-action-creators';

import API from '../../../../utils/apiUtils';
import * as userUtils from '../../../../redux/user/user-utils';

import useList from '../../../../hooks/useList';
import useFetch from '../../../../hooks/useFetch';
import useMultiSelect from '../../../../hooks/useMultiSelect';
import useInput from '../../../../hooks/useInput';

import { useUsersListContext } from '../../../../contexts/usersListContext';

import InputField from '../../../UI/InputField';
import MultipleSelect from '../../../UI/multi-select/MultipleSelect';
import Backdrop from '../../../UI/backdrop/Backdrop';

import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import BoostrapSpinner from 'react-bootstrap/Spinner';
import Spinner from '../../../UI/spinner/Spinner';
import getRoleOptions from './getRoleOptions';

function AddNewUser(props) {
   // prettier-ignore
   const { currentUser, currentUserRoles, portfolios, currentPortfolio, userToken, dispatch } = props
   const [propertyOptions, setPropertyOptions] = useState(portfolios);
   const [roleTypes, setRoleTypes] = useState({ access: [], view: [] });
   const { sendRequest: sendManyRequests, loading: requestsLoading } =
      useFetch();
   const { sendRequest: sendAddUserRequest, loading: addUserRequestLoading } =
      useFetch();

   const navigate = useNavigate();
   const { setWasUpdated } = useUsersListContext();
   const isLoggedInUserSuperAdmin = currentUserRoles.some(
      ({ code }) => code === 'SUPER_ADMIN'
   );

   const {
      inputValue: firstName,
      handleChange: handleChangeFirstName,
      runValidators: runFirstNameValidators,
      validationErrors: firstNameValidationErrors,
      setValidationErrors: setFirstNameValidationErrors,
      pushError: pushFirstNameError,
   } = useInput({ init: '', validators: [{ isRequired: [] }] });

   const {
      inputValue: lastName,
      handleChange: handleChangeLastName,
      runValidators: runLastNameValidators,
      validationErrors: lastNameValidationErrors,
      setValidationErrors: setLastNameValidationErrors,
      pushError: pushLastNameError,
   } = useInput({ init: '', validators: [{ isRequired: [] }] });

   const {
      inputValue: propertyName,
      handleChange: handleChangePropertyName,
      runValidators: runPropertyNameValidators,
      validationErrors: propertyNameValidationErrors,
      setValidationErrors: setPropertyNameValidationErrors,
   } = useInput({
      init: '',
      validators: [
         { isRequired: [] },
         { isNotSameAs: ['Assign property', 'This field is required'] },
      ],
   });

   const {
      inputValue: email,
      handleChange: handleChangeEmail,
      runValidators: runEmailValidators,
      validationErrors: emailValidationErrors,
      setValidationErrors: setEmailValidationErrors,
      pushError: pushEmailError,
   } = useInput({
      init: '',
      validators: [{ isRequired: [] }, { isEmail: ['This is not an email'] }],
   });

   const {
      inputValue: phone,
      handleChange: handleChangePhone,
      runValidators: runPhoneValidators,
      validationErrors: phoneValidationErrors,
      setValidationErrors: setPhoneValidationErrors,
   } = useInput({ init: '', validators: [{ isRequired: [] }] });

   const {
      inputValue: accessRoleId,
      handleChange: handleChangeAccessRole,
      runValidators: runAccessRoleValidators,
      validationErrors: accessRoleValidationErrors,
      setValidationErrors: setAccessRoleErrors,
   } = useInput({
      init: '',
      validators: [
         { isRequired: [] },
         { isNotSameAs: ['Assign a role', 'This field is required'] },
      ],
   });

   const {
      inputValue: viewRoleId,
      handleChange: handleChangeViewRole,
      runValidators: runViewRoleValidators,
      validationErrors: viewRoleValidationErrors,
      setValidationErrors: setViewRoleErrors,
   } = useInput({
      init: '',
      validators: [
         { isRequired: [] },
         { isNotSameAs: ['Assign a role', 'This field is required'] },
      ],
   });

   const close = () => navigate(-1);

   const getRoleById = (id, type) => {
      return ['access', 'view'].includes(type)
         ? roleTypes[type].find(role => role.roleId == id)
         : null;
   };

   const createUser = async () => {
      const selectedProperty = propertyOptions.find(
         ({ name }) => name === propertyName
      );
      const body = {
         firstName: firstName.trim(),
         lastName: lastName.trim(),
         isDefaultPassword: true,
         portfolioName: propertyName,
         emailId: email.trim(),
         contactNumber: phone.trim(),
         isAccepted: false,
         roles: [
            getRoleById(accessRoleId, 'access'),
            getRoleById(viewRoleId, 'view'),
         ],
         portfolioHeaderID: selectedProperty.portfolioHeaderId,
         statusCode: 'INACTIVE',
         userStatusId: 2,
         status: 'Inactive',
         portfolioName: propertyName,
      };
      console.log(body);
      const req = sendAddUserRequest(
         API.createUser(JSON.stringify(body), currentUser.userId, userToken)
      );
      req.then(res => {
         console.log(res);
         const handleError = error => {
            switch (error.fieldName?.toLowerCase()) {
               case 'firstname':
                  pushFirstNameError(error.message);
                  break;
               case 'lastname':
                  pushLastNameError(error.message);
                  break;
               case 'emailid':
                  pushEmailError(error.message);
                  break;
            }
         };
         if (res?.errors) {
            res.errors.forEach(handleError);
            return;
         }
         dispatch(notifCreators.loadNewNotifs(currentPortfolio, userToken));
         setWasUpdated(true);
         close();
      });
      req.catch(err => {
         console.log(err);
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
         runAccessRoleValidators(),
         runViewRoleValidators(),
      ];
      if (!errors.flat().length) return createUser();
      [
         setFirstNameValidationErrors,
         setLastNameValidationErrors,
         setPropertyNameValidationErrors,
         setEmailValidationErrors,
         setPhoneValidationErrors,
         setAccessRoleErrors,
         setViewRoleErrors,
      ].forEach((set, i) => set(errors[i]));
   };

   const executeRequests = async requests => {
      const responses = await sendManyRequests(Promise.all(requests));
      const [accessTypes, viewTypes, allPortfolios] = responses;
      setRoleTypes({
         view: viewTypes,
         access: getRoleOptions(props.currentUserAccessRole, accessTypes),
      });
      // if (isLoggedInUserSuperAdmin) setPropertyOptions(allPortfolios);
   };

   useEffect(() => {
      const requests = [
         API.getRolesByType('access', userToken),
         API.getRolesByType('view', userToken),
      ];
      //if (!isLoggedInUserSuperAdmin) setPropertyOptions(portfolios);
      //else requests.push(API.getAllPortfolio(userToken));
      setPropertyOptions(portfolios);
      executeRequests(requests);
   }, []);

   if (requestsLoading) return <Spinner show noContent />;
   return (
      <>
         <div className="add-group thin-scrollbar">
            <h2 className="page-heading fw-600 mb-lg my-sm-5">Add New User</h2>
            <form onSubmit={handleSubmit} className="w-md-75">
               {/* prettier-ignore */}
               <InputGroup className='mb-4 row'>
                  <label
                     htmlFor={!firstName ? 'first name' : !lastName ? 'last name' : 'first name'}
                     className='col-sm-4 col-form-label'>
                     User Name
                  </label>
                  <>
                     <div className='col-6 col-sm-4' style={{ position: 'relative' }}>
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
                     <div className='col-6 col-sm-4' style={{ position: 'relative' }}>
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
               <InputGroup className="mb-4 row">
                  <label
                     htmlFor="property name"
                     className="col-sm-4 col-form-label"
                  >
                     Property Name
                  </label>
                  <div className="col-sm-8" style={{ position: 'relative' }}>
                     <Form.Select
                        id="property name"
                        className={
                           propertyNameValidationErrors.length && 'is-invalid'
                        }
                        onChange={handleChangePropertyName}
                        aria-label="Default select example"
                        value={propertyName}
                     >
                        <option>Assign property</option>
                        {portfolios.map(property => (
                           <option key={property.name} value={property.name}>
                              {property.name}
                           </option>
                        ))}
                     </Form.Select>
                     <span className="app-error position-absolute">
                        {propertyNameValidationErrors?.[0]?.msg}
                     </span>
                  </div>
               </InputGroup>

               <InputGroup className="mb-4 row">
                  <label htmlFor="email" className="col-sm-4 col-form-label">
                     Primary Email
                  </label>
                  <div className="col-sm-8" style={{ position: 'relative' }}>
                     <InputField
                        type="text"
                        id="email"
                        className=""
                        value={email}
                        onChange={handleChangeEmail}
                        validationErrors={emailValidationErrors}
                     />
                  </div>
               </InputGroup>

               <InputGroup className="mb-4 row">
                  <label htmlFor="phone" className="col-sm-4 col-form-label">
                     Phone
                  </label>
                  <div className="col-sm-8" style={{ position: 'relative' }}>
                     <InputField
                        type="number"
                        id="phone"
                        className=""
                        min="1"
                        value={phone}
                        onChange={handleChangePhone}
                        validationErrors={phoneValidationErrors}
                     />
                  </div>
               </InputGroup>

               {/* DEFINE ROLE */}
               <InputGroup className="mb-4 row">
                  <label
                     htmlFor="access role"
                     className="col-sm-4 col-form-label"
                  >
                     Define Role
                  </label>
                  <div className="col-sm-8" style={{ position: 'relative' }}>
                     <Form.Select
                        id="access role"
                        className={
                           accessRoleValidationErrors.length && 'is-invalid'
                        }
                        onChange={handleChangeAccessRole}
                        aria-label="Default select example"
                     >
                        <option>Assign a role</option>

                        {roleTypes?.access.map(({ roleId, name }) => (
                           <option key={roleId} value={roleId}>
                              {name}
                           </option>
                        ))}
                     </Form.Select>
                     <span className="app-error position-absolute">
                        {accessRoleValidationErrors?.[0]?.msg}
                     </span>
                  </div>
               </InputGroup>

               <InputGroup className="mb-4 row">
                  <label
                     htmlFor="view role"
                     className="col-sm-4 col-form-label"
                  >
                     Add Group
                  </label>
                  <div className="col-sm-8" style={{ position: 'relative' }}>
                     <Form.Select
                        id="view role"
                        onChange={handleChangeViewRole}
                        className={
                           viewRoleValidationErrors.length && 'is-invalid'
                        }
                        aria-label="Default select example"
                     >
                        <option>Assign a role</option>

                        {roleTypes.view.map(({ roleId, name }) => (
                           <option key={roleId} value={roleId}>
                              {name}
                           </option>
                        ))}
                     </Form.Select>
                     <span className="app-error position-absolute">
                        {viewRoleValidationErrors?.[0]?.msg}
                     </span>
                  </div>
               </InputGroup>

               <div className="actions col-sm-8 ms-auto">
                  <button
                     type="submit"
                     className="rounded btn btn-primary"
                     data-dismiss="modal"
                     aria-label="Close"
                     disabled={addUserRequestLoading}
                  >
                     <div
                        className="d-flex align-items-center"
                        style={{ gap: '10px' }}
                     >
                        Save
                        {addUserRequestLoading && (
                           <BoostrapSpinner
                              animation="border"
                              size="sm"
                           ></BoostrapSpinner>
                        )}
                     </div>
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
   currentPortfolio: portfolioSelectors.selectCurrentPortfolio,
   currentUserAccessRole: userSelectors.selectUserAccessRole,
   userToken: userSelectors.selectUserToken,
});

export default connect(mapStateToProps)(AddNewUser);
