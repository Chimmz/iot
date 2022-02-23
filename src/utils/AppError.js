class AppError extends Error {
   // from could be: 'client' || 'server'
   constructor(errMsg, errCode, from) {
      super(errMsg);
      this.errCode = errCode;
      this.from = from;
   }
}

export default AppError;
