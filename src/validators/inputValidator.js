export const getFeedback = (status, msg) => ({ status, msg });
export const statusTypes = { passed: 'passed', failed: 'failed' };

// Actual validators
export const isRequired = function (errMsg = 'This field is required') {
   const error = !this.userInput;

   return getFeedback(
      statusTypes[error ? 'failed' : 'passed'],
      error && errMsg
   );
};

export const isSameAs = function (compareText, errMsg) {
   const error = this.userInput !== compareText;

   return getFeedback(
      statusTypes[error ? 'failed' : 'passed'],
      error && errMsg
   );
};

export const isNotSameAs = function (compareText, errMsg) {
   const error = this.userInput === compareText;

   return getFeedback(
      statusTypes[error ? 'failed' : 'passed'],
      error && errMsg
   );
};

export function minLength(minLength, errMsg = `Must be at least ${minLength}`) {
   let error = this.userInput?.length < minLength;
   if (!this.userInput) error = true;

   return getFeedback(
      statusTypes[error ? 'failed' : 'passed'],
      error && errMsg
   );
}

export function containsUpperCase(
   errMsg = 'Please include an uppercase letter'
) {
   const isAlphabet = char => /[a-zA-Z]/.test(char);
   const hasUpperCase = this.userInput
      .split('')
      .some(char => isAlphabet(char) && char === char.toUpperCase());

   const error = !hasUpperCase;
   return getFeedback(
      statusTypes[error ? 'failed' : 'passed'],
      error && errMsg
   );
}

export function containsDigit(errMsg = 'Please include a digit') {
   const hasDigit = this.userInput.split('').some(char => !isNaN(char));
   const error = !hasDigit;

   return getFeedback(
      statusTypes[error ? 'failed' : 'passed'],
      error && errMsg
   );
}

export const isEmail = function (errMsg = 'Invalid email entered') {
   const error = !String(this.userInput)
      .toLowerCase()
      .match(
         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );

   return getFeedback(
      statusTypes[error ? 'failed' : 'passed'],
      error && errMsg
   );
};

export const isStrongPassword = function (errMsg) {
   const strongPassword = new RegExp(
      '((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))'
   );
   const error = !strongPassword.test(this.userInput);

   return getFeedback(
      statusTypes[error ? 'failed' : 'passed'],
      error && errMsg
   );
};

export const hasPasswordExceptions = function (errMsg) {
   const exceptions = ['-', '%'];
   const inputHasExceptions = exceptions.some(exc =>
      this.userInput.includes(exc)
   );
   return getFeedback(
      statusTypes[inputHasExceptions ? 'failed' : 'passed'],
      inputHasExceptions && errMsg
   );
};

export const isValidDate = function (errMsg = 'Invalid date entered') {
   console.log(this.userInput);
   const yr = new Date(this.userInput).getFullYear().toString();
   const error =
      yr.startsWith('0') ||
      yr.length != 4 ||
      +new Date(this.userInput) > Date.now();

   return getFeedback(
      statusTypes[error ? 'failed' : 'passed'],
      error && errMsg
   );
};
