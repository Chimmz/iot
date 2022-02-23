export const createCookie = function (key, value, durationInDays) {
   const today = new Date();
   const expiry = new Date();

   expiry.setTime(today.getTime() + 3600000 * 24 * durationInDays);
   document.cookie = `${key}=${value};expires=${expiry.toUTCString()}`;
};

export const getCookieValue = function (key) {
   const cookiePairs = document.cookie.split(';').map(pair => pair.trim());
   const rememberMe = cookiePairs.find(pair =>
      pair.startsWith('_itek-remember')
   );

   if (!rememberMe) return null;

   const [_, value] = rememberMe.split('=');
   return value === 'true';
};
