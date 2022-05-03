class API {
   #makeRequest = async ({ path, ...options }) => {
      const url = process.env.REACT_APP_API_BASE_URL + path;

      try {
         const res = await fetch(url, options);
         // console.log(res); // Handle errors on API calls with 'res'
         return await res.json();
      } catch (err) {
         console.log(err.message);
      }
   };

   // Login user
   loginUser(username, password) {
      return this.#makeRequest({
         method: 'POST',
         path: '/api/Auth/login',
         body: JSON.stringify({ username, password }),
         headers: { 'Content-Type': 'application/json' }
      });
   }

   // Change password
   changePassword(...details) {
      const [userId, currentPassword, newPassword, userToken] = details;

      return this.#makeRequest({
         method: 'POST',
         path: '/api/Auth/ChangePassword',
         body: JSON.stringify({ userId, currentPassword, newPassword }),
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`
         }
      });
   }

   // Reset password
   resetPassword(email) {
      return this.#makeRequest({
         method: 'POST',
         path: `/api/Auth/ResetPassword?emailId=${email}`,
         headers: { 'Content-Type': 'application/json' }
      });
   }

   // Get legal user
   getLegalUser(userId, userToken) {
      return this.#makeRequest({
         method: 'POST',
         path: `/api/Auth/getLegal?UserId=${userId}`,
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`
         }
      });
   }

   // Accept terms & conditions
   acceptTermsAndConditions(userId, userToken) {
      return this.#makeRequest({
         method: 'POST',
         path: `/api/Auth/TermsandConditions?UserId=${userId}`,
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
            mode: 'no-cors'
         }
      });
   }

   // Get all user portfolios
   getUserPortfolio(userId, userToken) {
      return this.#makeRequest({
         method: 'GET',
         path: `/api/Portfolio/getPortfolioByUserId?UserId=${userId}`,
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`
         }
      });
   }

   // Get all incidents in portfolio
   getIncidentsByPortfolio(userToken, ...reqQuery) {
      const [portfolioId, fromDate, toDate] = reqQuery;
      return this.#makeRequest({
         method: 'GET',
         path: `/api/Incident/GetIncidentsByPortfolio?portfolioId=${portfolioId}&fromDate=${fromDate}&toDate=${toDate}`,
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
            mode: 'no-cors'
         }
      });
   }

   // Get all active incidents in portfolio
   getActiveIncidentsByPortfolio(userToken, ...reqQuery) {
      const [portfolioId, fromDate, toDate] = reqQuery;
      return this.#makeRequest({
         method: 'GET',
         path: `/api/Incident/GetActiveIncidentsByPortfolio?portfolioId=${portfolioId}&fromDate=${fromDate}&toDate=${toDate}`,
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
            mode: 'no-cors'
         }
      });
   }

   // Get response time by portfolio
   getResponseTimeByPortfolio(userToken, ...reqQuery) {
      const [portfolioId, fromDate, toDate] = reqQuery;
      return this.#makeRequest({
         method: 'GET',
         path: `/api/Incident/GetResponseTimeByPortfolio?portfolioId=${portfolioId}&fromDate=${fromDate}&toDate=${toDate}`,
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
            mode: 'no-cors'
         }
      });
   }

   // Get incident types
   getIncidentRecordTypes(userToken) {
      return this.#makeRequest({
         method: 'GET',
         path: `/api/IncidentRecord/GetIncidentRecordTypes`,
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`
         }
      });
   }

   // Get incident record questions
   getIncidentRecordQuestions(headerId, userToken) {
      return this.#makeRequest({
         method: 'GET',
         path: `/api/IncidentRecord/GetIncidentRecordQuestions?IncidentRecordHeaderID=${headerId}`,
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
            mode: 'no-cors'
         }
      });
   }

   // Post user's answers to incident questions
   submitIncidentQuestions(body, userToken) {
      return this.#makeRequest({
         path: `/api/IncidentRecord/IncidentRecordResponse`,
         method: 'POST',
         body: JSON.stringify(body),
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`
         }
      });
   }

   // Update incident status
   updateIncidentStatus(statusId, incidentId, userId, userToken) {
      return this.#makeRequest({
         path: `/api/Incident/UpdateStatus?IncidentID=${incidentId}&statusId=${statusId}&userId=${userId}`,
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${userToken}`
         }
      });
   }

   // get a specific record response for incident
   getIncidentRecordResponse(userToken, incidentId) {
      return this.#makeRequest({
         method: 'GET',
         path: `/api/IncidentRecord/IncidentRecordResponse?IncidentID=${incidentId}`,
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
            mode: 'no-cors'
         }
      });
   }

   // Get all in groups
   groupsGetAll(userToken) {
      return this.#makeRequest({
         path: `/api/Group/GetAll`,
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`
         }
      });
   }

   // Get group details
   getGroupDetails(groupId, userToken) {
      return this.#makeRequest({
         path: `/api/Group/GetGroupDetails?groupId=${groupId}`,
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`
         }
      });
   }

   getIncidentTypes(userToken) {
      return this.#makeRequest({
         path: `/api/IncidentType/GetAll`,
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`
         }
      });
   }

   getAvailabilities(userToken) {
      return this.#makeRequest({
         path: `/api/Availability/GetAll`,
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`
         }
      });
   }

   getNotificationTypes(userToken) {
      return this.#makeRequest({
         path: `/api/Notification/GetAll`,
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`
         }
      });
   }

   createGroup(body, userToken) {
      return this.#makeRequest({
         path: `/api/Group/Create`,
         method: 'POST',
         body: JSON.stringify(body),
         headers: {
            mode: 'cors',
            'Content-Type': 'application/json',
            // Accept: 'application/json',
            Authorization: `Bearer ${userToken}`
         }
      });
   }

   toggleGroupStatus(groupId, userToken) {
      return this.#makeRequest({
         path: `/api/Group/ToggleStatus?groupId=${groupId}`,
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`
         }
      });
   }

   getUsersInPortfolio(portfolioId, userToken) {
      return this.#makeRequest({
         path: `/api/User/GetAllInPortfolio?portfolioId=${portfolioId}`,
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`
         }
      });
   }

   deleteGroup(groupId, userId, userToken) {
      return this.#makeRequest({
         path: `/api/Group/Delete?groupId=${groupId}&userId=${userId}`,
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`
         }
      });
   }

   getNotifications(userToken, ...reqQuery) {
      const [portfolioId, fromDate, toDate] = reqQuery;
      return this.#makeRequest({
         method: 'GET',
         path: `/api/ActivityLog/GetAllInPortfolio?portfolioId=${portfolioId}&fromDate=${fromDate}&toDate=${toDate}`,
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
            mode: 'no-cors'
         }
      });
   }

   getIotDevices(userToken, ...reqQuery) {
      const [portfolioId] = reqQuery;

      return this.#makeRequest({
         method: 'GET',
         path: `/api/Sensor/ListByPortfolio?portfolioId=${portfolioId}`,
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
            mode: 'no-cors'
         }
      });
   }

   // ---------- FOR THE USERS LIST PAGE -------------

   getUsersList(userToken) {
      return this.#makeRequest({
         path: `/api/User/GetUsers`,
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`
         }
      });
   }

   getAllUsersInPortfolio(portfolioId, userToken) {
      return this.#makeRequest({
         path: `/api/User/GetAllInPortfolio?portfolioId=${portfolioId}`,
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`
         }
      });
   }

   toggleUserStatus(userId, adminToken) {
      return this.#makeRequest({
         path: `/api/User/ToggleUserStatus?UserID=${userId}`,
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`
         }
      });
   }

   deleteUser(userId, userToken) {
      return this.#makeRequest({
         path: `/api/User/DeleteUser?UserID=${userId}`,
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`
         }
      });
   }

   getRolesByType(roleType, userToken) {
      return this.#makeRequest({
         path: `/api/Role/GetRolesByType?roleType=${roleType}`,
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`
         }
      });
   }

   //  Update user details in user info modal
   updateUser(body, modifiedBy, userId, adminUserToken) {
      return this.#makeRequest({
         path: `/api/User/UpdateUser?ModifiedBy=${modifiedBy}&UserId=${userId}`,
         method: 'POST',
         body,
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminUserToken}`
         }
      });
   }

   getAllPortfolio(adminUserToken) {
      return this.#makeRequest({
         path: `/api/Portfolio/GetAllPortfolio`,
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminUserToken}`
         }
      });
   }

   createUser(body, createdBy, adminUserToken) {
      return this.#makeRequest({
         path: `/api/User/CreateUser?createdBy=${createdBy}`,
         method: 'POST',
         body,
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminUserToken}`
         }
      });
   }
}

export default new API();
