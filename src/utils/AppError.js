// THIS APP ERROR IS NOT IN USE YET.
// IT WILL BE USED TO HANDLE ERRORS AFTER THE APP HAS BEEN ROUNDED UP

class AppError extends Error {
   // 'from' could be: 'client' || 'server'
   constructor(errMsg, errCode, from) {
      super(errMsg);
      this.errCode = errCode;
      this.from = from;
   }
}

export default AppError;
