class API {
   #makeRequest = ({ url, ...rest }) => {
      return fetch(url, { ...rest })
         .then(response => response.json())
         .catch(console.log);
   };

   loginUser = async function (username, password) {
      return await this.#makeRequest({
         method: 'POST',
         url: 'https://ams-iot-dev.azurewebsites.net/api/Auth/login',
         body: JSON.stringify({ username, password }),
         headers: { 'Content-Type': 'application/json' }
      });
   };

   changePassword = async function (...details) {
      const [userId, currentPassword, newPassword, userToken] = details;

      return await this.#makeRequest({
         method: 'POST',
         url: 'https://ams-iot-dev.azurewebsites.net/api/Auth/ChangePassword',
         body: JSON.stringify({ userId, currentPassword, newPassword }),
         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` }
      });
   };
}

export default new API();
