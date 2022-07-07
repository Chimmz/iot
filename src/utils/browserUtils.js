export const createCookie = function (key, value, durationInDays) {
   const today = new Date();
   const expiry = new Date();
   expiry.setTime(today.getTime() + 3600000 * 24 * durationInDays);
   document.cookie = `${key}=${value};expires=${expiry.toUTCString()}`;
};

export const getCookie = function (key) {
   const allCookies = document.cookie.split(';').map(pair => pair.trim());
   const cookie = allCookies.find(pair => pair.startsWith(key));
   if (!cookie) return '';
   const [_, value] = cookie.split('=');
   return value;
};
