import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
// The Redux user state selectors
import * as userSelectors from '../../../../redux/user/user-selectors';
import * as portfolioSelectors from '../../../../redux/portfolio/portfolio-selectors';
import * as notifCreators from '../../../../redux/notification/notification-action-creators';
// Hooks
import useInput from '../../../../hooks/useInput';
import useFetch from '../../../../hooks/useFetch';
import useList from '../../../../hooks/useList';
import useMultiSelect from '../../../../hooks/useMultiSelect';

import { configurationContext } from '../../../../contexts/configurationContext';
import {
   getIncidentTypeOptions,
   getNotificationOptions,
   getAvailabilityOptions,
   getSelectionValues,
} from './utils';
import * as userUtils from '../../../../redux/user/user-utils';
import API from '../../../../utils/apiUtils';

import SearchUserResults from './search-user-results/SearchUserResults';
import ActionButtons from './action-buttons/ActionButtons';
import InputGroup from 'react-bootstrap/InputGroup';
import InputField from '../../../UI/InputField';
import MultipleSelect from '../../../UI/multi-select/MultipleSelect';

import Backdrop from '../../../UI/backdrop/Backdrop';
import Spinner from '../../../UI/spinner/Spinner';
import './AddGroup.scss';

function AddGroup(props) {
   const { currentUser, currentPortfolio, userToken, dispatch } = props;
   const navigate = useNavigate();

   const { setGroupsUpdated } = useContext(configurationContext);
   const [users, setUsers] = useState([]);

   const [incidentTypes, setIncidentTypes] = useState([]);
   const [notifTypes, setNotifTypes] = useState([]);
   const [availabilities, setAvailabilities] = useState([]);

   const { sendRequest: sendManyRequests, loading: getAllTypesLoading } =
      useFetch();
   const { sendRequest: sendAddGroupRequest, loading: addGroupRequestLoading } =
      useFetch();

   // To control the list of user ids that will be added to the group
   const {
      items: addedUsers,
      addItem: includeUser,
      removeItem: excludeUser,
   } = useList();

   // To control the group name input
   const {
      inputValue: groupName,
      handleChange: handleChangeGroupName,
      runValidators: runGroupNameValidators,
      validationErrors: groupNameValidationErrors,
      setValidationErrors: setGroupNameValidationErrors,
   } = useInput({ init: '', validators: [{ isRequired: [] }] });

   // To control the selected incident types
   // prettier-ignore
   const {
      selections: selectedIncidentTypes,
      setSelections: setSelectedIncidentTypes,
      runValidators: runIncidentTypeValidators,
      validationErrors: incidentTypeValidationErrors,
      setValidationErrors: setIncidentTypeValidationErrors
   } = useMultiSelect({
      init: [],
      validators: [{
         // 'minLength' and other validator names must match any function name in /src/validators/inputValidators.js. This matching function will be executed.
         // The array elements below are passed as args to the matching function in the exact same order
         minLength: [1, 'No incident type selected']
      }]
   });

   // prettier-ignore
   const {
      selections: selectedNotifs,
      setSelections: setSelectedNotifs,
      runValidators: runNotifsValidators,
      validationErrors: notifValidationErrors,
      setValidationErrors: setNotifsValidationErrors
   } = useMultiSelect({
      init: [],
      validators: [{
         minLength: [1, 'No notification type selected']
      }]
   });

   const {
      inputValue: searchUserQuery,
      handleChange: handleChangeSearchUserQuery,
   } = useInput({ init: '', validators: [{ isRequired: [] }] });

   // prettier-ignore
   const {
      selections: selectedAvailabs,
      setSelections: setSelectedAvailabs,
      runValidators: runAvailabilityValidators,
      validationErrors: availabilityValidationErrors,
      setValidationErrors: setAvailabilityValidationErrors
   } = useMultiSelect({
      init: [],
      validators: [{
         minLength: [1, 'No availability type selected']
      }]
   });

   const close = () => navigate(-1); // Unmount the component by navigating back

   // This handles the change to check buttons on each search user result
   const includeOrExcludeUser = (user, { target: { checked } }) => {
      const handler = checked ? includeUser : excludeUser;
      handler(user.userId);
   };

   // This creates the group by contacting the API
   const createGroup = () => {
      const body = {
         groupId: 0,
         groupName,
         userId: currentUser.userId,
         userIds: [...addedUsers],
         incidentTypeIdList: [...getSelectionValues(selectedIncidentTypes)],
         availabilityIdList: [...getSelectionValues(selectedAvailabs)],
         notificationTypeIdList: [...getSelectionValues(selectedNotifs)],
      };
      console.log(body);
      const request = sendAddGroupRequest(API.createGroup(body, userToken)); // Returns a promise

      request.then(res => {
         dispatch(notifCreators.loadNewNotifs(currentPortfolio, userToken));
         setGroupsUpdated(true);
         close();
      });
      request.catch(console.log);
   };

   const handleSubmit = async function (ev) {
      ev.preventDefault();
      // Each item here returns an array of error objects if any.
      const errors = [
         runGroupNameValidators(),
         runIncidentTypeValidators(),
         runNotifsValidators(),
         runAvailabilityValidators(),
      ];
      if (!errors.flat().length) return createGroup();

      [
         setGroupNameValidationErrors,
         setIncidentTypeValidationErrors,
         setNotifsValidationErrors,
         setAvailabilityValidationErrors,
      ].forEach((set, i) => set(errors[i]));
   };

   useEffect(() => {
      const reqs = [
         API.getIncidentTypes(userToken),
         API.getNotificationTypes(userToken),
         API.getAvailabilities(userToken),
         API.getUsersInPortfolio(
            currentPortfolio?.portfolioHeaderId,
            userToken
         ),
      ];
      const requests = sendManyRequests(Promise.all(reqs));

      const handleResponses = responses => {
         [setIncidentTypes, setNotifTypes, setAvailabilities, setUsers].forEach(
            (set, i) => set(responses[i])
         );
      };
      requests.then(handleResponses).catch(console.log);
   }, []);

   if (getAllTypesLoading) return <Spinner show noContent />;
   const containerClassName = `add-group thin-scrollbar ${
      props.show ? 'show' : 'fade'
   }`;
   return (
      <>
         <Backdrop show={props.show} />
         <div className={containerClassName}>
            <h2 className="page-heading fw-600 my-sm-4">Add New User Group</h2>
            <form onSubmit={handleSubmit} className="w-md-75">
               {/* ----------------- Group Name field ----------------------*/}
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
               <div className="col-sm-8 ms-auto">
                  <hr className="my-3" style={{ width: '93%' }}></hr>
               </div>
               {/* ---------------- Incident Type field --------------*/}
               <InputGroup className="row">
                  <label
                     htmlFor="incidentType"
                     className="col-sm-4 col-form-label"
                  >
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

               {/* ---------------- Communication Type field ----------------------*/}
               <InputGroup className="row">
                  <label
                     htmlFor="incidentType"
                     className="col-sm-4 col-form-label"
                  >
                     Communication Type
                  </label>
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
                     <br />
                     (Optional)
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
                  {/* ----- Search User results -----*/}
                  <div
                     className="col-sm-8 search thin-scrollbar"
                     style={{ position: 'relative' }}
                  >
                     <SearchUserResults
                        query={searchUserQuery}
                        users={users}
                        addedUsers={addedUsers}
                        onSelectResult={includeOrExcludeUser}
                     />
                  </div>
               </InputGroup>

               {/* ---------------- Availability field ----------------------*/}
               <InputGroup className="row">
                  <label
                     htmlFor="incidentType"
                     className="col-sm-4 col-form-label"
                  >
                     Availability
                  </label>
                  <div className="col-sm-8" style={{ position: 'relative' }}>
                     <MultipleSelect
                        options={getAvailabilityOptions(availabilities)}
                        value={selectedAvailabs}
                        onChange={setSelectedAvailabs}
                        validationErrors={availabilityValidationErrors}
                     />
                  </div>
               </InputGroup>

               {/* ---------------- Action buttons ----------------------*/}
               <div className="actions col-sm-8 ms-auto">
                  <ActionButtons
                     isAddingGroup={addGroupRequestLoading}
                     close={close}
                  />
               </div>
            </form>
         </div>
      </>
   );
}

const mapStateToProps = createStructuredSelector({
   currentUser: userSelectors.selectCurrentUser,
   currentPortfolio: portfolioSelectors.selectCurrentPortfolio,
   userToken: userSelectors.selectUserToken,
});

export default connect(mapStateToProps)(AddGroup);
