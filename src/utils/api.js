class API {
   #makeRequest = async ({ url, ...rest }) => {
      try {
         const res = await fetch(url, { ...rest });
         return await res.json();
      } catch (err) {
         console.log(err.message);
      }
   };

   loginUser = function (username, password) {
      return this.#makeRequest({
         method: 'POST',
         url: 'https://ams-iot-dev.azurewebsites.net/api/Auth/login',
         body: JSON.stringify({ username, password }),
         headers: { 'Content-Type': 'application/json' }
      });
   };

   changePassword = async function (...details) {
      const [userId, currentPassword, newPassword, userToken] = details;

      return this.#makeRequest({
         method: 'POST',
         url: 'https://ams-iot-dev.azurewebsites.net/api/Auth/ChangePassword',
         body: JSON.stringify({ userId, currentPassword, newPassword }),
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`
         }
      });
   };

   resetPassword = async function (email) {
      return this.#makeRequest({
         method: 'POST',
         url: `https://ams-iot-dev.azurewebsites.net/api/Auth/ResetPassword?emailId=${email}`,
         headers: { 'Content-Type': 'application/json' }
      });
   };

   getLegalUser = async function (userId, userToken) {
      return this.#makeRequest({
         method: 'POST',
         url: `https://ams-iot-dev.azurewebsites.net/api/Auth/getLegal?UserId=${userId}`,
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`
         }
      });
   };
}

export default new API();
