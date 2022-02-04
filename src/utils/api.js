const makeRequest = function ({ url, method, body, headers }) {
   return fetch(url, { method, body, headers })
      .then(response => response.json())
      .catch(console.log);
};

class API {
   loginUser = async function (username, password) {
      const url = `https://dev-ams-core-api-app.azurewebsites.net/api/Auth/token?username=${username}&password=${password}`;

      const res = await makeRequest({
         url,
         method: 'POST',
         headers: { 'Content-Type': 'application/json' }
      });
      console.log('RES: ', res);
   };
}

export default new API();
