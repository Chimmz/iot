import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'; // To connect this component to Redux
import { createStructuredSelector } from 'reselect';
// The Redux user state selectors
import * as userSelectors from '../../../../redux/user/user-selectors';
import * as portfolioSelectors from '../../../../redux/portfolio/portfolio-selectors';
import * as notifCreators from '../../../../redux/notification/notification-action-creators';
// Hooks
import useInput from '../../../../hooks/useInput'; // To control text input fields
import useFetch from '../../../../hooks/useFetch'; // To control API fetches within components
import useList from '../../../../hooks/useList'; // To control the array of added users to a group
import useMultiSelect from '../../../../hooks/useMultiSelect'; // To control multiple selections
import { useConfigurationContext } from '../../../../contexts/configurationContext';

import API from '../../../../utils/apiUtils'; // Import of API calls

import {
   getIncidentTypeOptions, // To config the incident types into multiselect options
   getNotificationOptions, // To config the notif types array into multiselect options
   getAvailabilityOptions,
   getSelectedValues,
} from './utils';

import InputGroup from 'react-bootstrap/InputGroup';
import InputField from '../../../UI/InputField'; // Text field that can show validation errors
import MultipleSelect from '../../../UI/multi-select/MultipleSelect';
import Spinner from '../../../UI/spinner/Spinner';
import BoostrapSpinner from 'react-bootstrap/Spinner';
import Backdrop from '../../../UI/backdrop/Backdrop';
import SearchUserResults from './SearchUserResults'; // Results of users searched for to be added

function EditGroup({ groupDetails, groupDetailsLoading, ...otherProps }) {
   const { currentUser, currentPortfolio, dispatch, userToken } = otherProps; // Redux props
   // 'setGroupsUpdated' notifies changes (group creation/update/delettion) in the configuration page
   const { setGroupsUpdated } = useConfigurationContext();

   // The below 4 are for handling the multiselects in the form
   const [incidentTypes, setIncidentTypes] = useState([]);
   const [notifTypes, setNotifTypes] = useState([]);
   const [availabilities, setAvailabilities] = useState([]);
   const [users, setUsers] = useState([]);

   const { sendRequest: sendManyRequests, loading: manyRequestsLoading } =
      useFetch(); // To fetch incidentTypes, notifTypes, availabilities, users
   const { sendRequest: sendUpdateRequest, loading: updateRequestLoading } =
      useFetch(); // To make the final update request

   // The group name field controller
   const {
      inputValue: groupName,
      handleChange: handleChangeGroupName,
      runValidators: runGroupNameValidators,
      validationErrors: groupNameValidationErrors,
      setValidationErrors: setGroupNameValidationErrors,
   } = useInput({
      init: groupDetails?.group?.name,
      validators: [{ isRequired: ['This field cannot be empty'] }],
   });

   // The incident types multiselect field controller
   const {
      selections: selectedIncidentTypes,
      setSelections: setSelectedIncidentTypes,
      runValidators: runIncidentTypeValidators,
      validationErrors: incidentTypeValidationErrors,
      setValidationErrors: setIncidentTypeValidationErrors,
   } = useMultiSelect({
      init: getIncidentTypeOptions(groupDetails?.incidentType),
      validators: [
         // Each object below is independently a validator...
         // 'minLength' and other validator names must match any function name in /src/validators/inputValidators.js. The matching func will be executed.
         // The array elements below are passed as args to the matching function in the exact same order
         { minLength: [1, 'No incident type selected'] },
      ],
   });

   // The notification types multiselect field controller
   const {
      selections: selectedNotifs,
      setSelections: setSelectedNotifs,
      runValidators: runNotifsValidators,
      validationErrors: notifValidationErrors,
      setValidationErrors: setNotifsValidationErrors,
   } = useMultiSelect({
      init: getNotificationOptions(groupDetails?.notificationType),
      validators: [{ minLength: [1, 'No notification type selected'] }],
   });

   // The search query input field controller
   const {
      inputValue: searchUserQuery,
      handleChange: handleChangeSearchUserQuery,
   } = useInput({ init: '', validators: [{ isRequired: [] }] });

   // The list of user ids that will be group members controller
   const {
      items: addedUsers,
      addItem: includeUser,
      removeItem: excludeUser,
   } = useList(groupDetails?.users?.map(u => u.userId));

   // prettier-ignore
   // The availability types multiselect field controller
   const {
      selections: selectedAvailabs,
      setSelections: setSelectedAvailabs,
      runValidators: runAvailabilityValidators,
      validationErrors: availabilityValidationErrors,
      setValidationErrors: setAvailabilityValidationErrors
   } = useMultiSelect({
      init: getAvailabilityOptions(groupDetails?.availability), // Giving default selected values
      validators: [{ minLength: [1, 'No availability type selected'] }]
   });

   const close = () => otherProps.close();

   const updateGroup = function () {
      // The request body
      const body = {
         groupId: groupDetails.group.groupId,
         groupName,
         userId: currentUser.userId,
         userIds: [...addedUsers],
         incidentTypeIdList: [...getSelectedValues(selectedIncidentTypes)],
         availabilityIdList: [...getSelectedValues(selectedAvailabs)],
         notificationTypeIdList: [...getSelectedValues(selectedNotifs)],
      };
      console.log(body);

      // 'sendUpdateRequest' receives a promise
      const request = sendUpdateRequest(API.updateGroup(body, userToken)); // Returns a promise

      const handleUpdateSuccess = res => {
         dispatch(notifCreators.loadNewNotifs(currentPortfolio, userToken));
         setGroupsUpdated(true);
         close();
      };
      request.then(res => {
         handleUpdateSuccess();
      });
      request.catch(console.log);
   };

   const handleSubmit = function (ev) {
      ev.preventDefault();
      // EACH item here returns an array of error objects if any.
      const errors = [
         runGroupNameValidators(),
         runIncidentTypeValidators(),
         runNotifsValidators(),
         runAvailabilityValidators(),
      ];

      console.log(errors);
      if (!errors.flat().length) return updateGroup();

      [
         setGroupNameValidationErrors,
         setIncidentTypeValidationErrors,
         setNotifsValidationErrors,
         setAvailabilityValidationErrors,
      ].forEach((set, i) => set(errors[i]));
   };

   const includeOrExcludeUser = (user, { target: { checked } }) => {
      const handler = checked ? includeUser : excludeUser;
      handler(user.userId);
   };

   useEffect(() => {
      const requests = [
         API.getIncidentTypes(userToken),
         API.getNotificationTypes(userToken),
         API.getAvailabilities(userToken),
         API.getUsersInPortfolio(
            currentPortfolio?.portfolioHeaderId,
            userToken
         ),
      ];
      // 'sendManyRequests' receives a single request
      const results = sendManyRequests(Promise.all(requests));
      // Map response to state
      const handleResponses = responses => {
         [setIncidentTypes, setNotifTypes, setAvailabilities, setUsers].forEach(
            (set, i) => set(responses[i])
         );
      };
      results.then(handleResponses).catch(console.log);
      return () => console.log('Cleaned up EditGroup');
   }, []);

   if (!otherProps.show) return <></>;
   const containerClassName = `add-group thin-scrollbar ${
      otherProps.show ? 'show' : 'fade'
   }`;
   if (manyRequestsLoading || groupDetailsLoading)
      return <Spinner show noContent />;
   return (
      <>
         <div className={containerClassName}>
            <h2 className="page-heading fw-600 my-sm-4">Edit Group</h2>
            <form onSubmit={handleSubmit} className="w-md-75">
               <InputGroup className="mb-4 row">
                  <label
                     htmlFor="groupName"
                     className="col-sm-4 col-form-label"
                  >
                     Group Name
                  </label>
                  <div className="col-sm-8" style={{ position: 'relative' }}>
                     <InputField
                        type="text"
                        id="groupName"
                        className=""
                        value={groupName}
                        onChange={handleChangeGroupName}
                        validationErrors={groupNameValidationErrors}
                     />
                  </div>
               </InputGroup>

               {/* ---------------- Availability types field ----------------------*/}
               <InputGroup className="row">
                  <label className="col-sm-4 col-form-label">
                     Incident Type
                  </label>
                  <div className="col-sm-8" style={{ position: 'relative' }}>
                     <MultipleSelect
                        options={getIncidentTypeOptions(incidentTypes)}
                        value={selectedIncidentTypes}
                        onChange={setSelectedIncidentTypes}
                        validationErrors={incidentTypeValidationErrors}
                     />
                  </div>
               </InputGroup>

               {/* ---------------- Communication Types field ----------------------*/}
               <InputGroup className="row">
                  <label
                     htmlFor="incidentType"
                     className="col-sm-4 col-form-label"
                  >
                     Communication Type
                  </label>
                  {/* Communication Types multiselect field */}
                  <div className="col-sm-8" style={{ position: 'relative' }}>
                     <MultipleSelect
                        options={getNotificationOptions(notifTypes)}
                        value={selectedNotifs}
                        onChange={setSelectedNotifs}
                        validationErrors={notifValidationErrors}
                     />
                  </div>
               </InputGroup>

               {/* ---------------- Search User field ----------------------*/}
               <InputGroup className="row mb-4">
                  <label
                     htmlFor="searchUser"
                     className="col-sm-4 col-form-label"
                  >
                     Search User
                  </label>
                  <div className="col-sm-8" style={{ position: 'relative' }}>
                     <InputField
                        type="text"
                        id="searchUser"
                        className=""
                        value={searchUserQuery}
                        onChange={handleChangeSearchUserQuery}
                        validationErrors={[]}
                     />
                  </div>
                  <div className="col-sm-4 col-form-label"></div>
                  {/* Search User Results */}
                  <div
                     className="col-sm-8 search thin-scrollbar"
                     style={{ position: 'relative' }}
                  >
                     <SearchUserResults
                        query={searchUserQuery}
                        users={users}
                        addedUsers={addedUsers}
                        onCheckResult={includeOrExcludeUser}
                     />
                  </div>
               </InputGroup>

               {/* ---------------- Availability types field ----------------------*/}
               <InputGroup className="row">
                  <label
                     htmlFor="incidentType"
                     className="col-sm-4 col-form-label"
                  >
                     Availability
                  </label>
                  {/* The Availability types mutiselect field */}
                  <div className="col-sm-8" style={{ position: 'relative' }}>
                     <MultipleSelect
                        options={getAvailabilityOptions(availabilities)}
                        value={selectedAvailabs}
                        onChange={setSelectedAvailabs}
                        validationErrors={availabilityValidationErrors}
                     />
                  </div>
               </InputGroup>

               {/* The action buttons */}
               <div
                  className="action col-sm-8 ms-auto my-3"
                  style={{ gap: '10px' }}
               >
                  {/* prettier-ignore */}
                  <button
                     type="submit"
                     className="rounded btn btn-primary"
                     data-dismiss="modal"
                     aria-label="Close"
                     disabled={updateRequestLoading}
                  >
                     {updateRequestLoading ? (
                        <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                           Saving... <BoostrapSpinner animation='border' size='sm' />
                        </div>
                     ) : 'Save'
                     }
                  </button>

                  <button
                     type="button"
                     className="rounded btn btn-outline-dark"
                     onClick={close}
                  >
                     Cancel
                  </button>
               </div>
            </form>
         </div>
         <Backdrop show={otherProps.show} />
      </>
   );
}

const mapStateToProps = createStructuredSelector({
   currentUser: userSelectors.selectCurrentUser,
   currentPortfolio: portfolioSelectors.selectCurrentPortfolio,
   userToken: userSelectors.selectUserToken,
});

export default connect(mapStateToProps)(EditGroup);
