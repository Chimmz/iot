const makeRequest = function ({ url, method, body, headers }) {
   return fetch(url, { method, body, headers })
      .then(response => response.json())
      .catch(console.log);
};

class API {
   loginUser = async function (username, password) {
      const res = await makeRequest({
         url: `https://dev-ams-core-api-app.azurewebsites.net/api/Auth/token`,
         method: 'POST',
         body: JSON.stringify({ username, password }),
         headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
         }
      });
      return res;
   };
}

export default new API();
