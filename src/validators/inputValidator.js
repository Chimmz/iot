const getFeedback = (status, msg) => ({ status, msg });

export const statusTypes = { passed: 'passed', failed: 'failed' };

export const isRequired = (userInput, errMsg = 'Field cannot be empty') => {
   const error = typeof userInput === 'string' && !userInput;

   return getFeedback(
      statusTypes[error ? 'failed' : 'passed'],
      error && errMsg
   );
};

export const minSixChars = (userInput, errMsg) => {
   const error = userInput.length < 6;

   return getFeedback(
      statusTypes[error ? 'failed' : 'passed'],
      error && errMsg
   );
};

export const isEmail = (email, errMsg = 'Invalid email entered') => {
   const error = !String(email)
      .toLowerCase()
      .match(
         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );

   return getFeedback(
      statusTypes[error ? 'failed' : 'passed'],
      error && errMsg
   );
};

export const isStrongPassword = (userInput, errMsg) => {
   const strongPassword = new RegExp(
      '((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))'
   );

   const error = !strongPassword.test(userInput);

   return getFeedback(
      statusTypes[error ? 'failed' : 'passed'],
      error && errMsg
   );
};

// export const isAtLeast = (userInput, minValue) => {

// }
