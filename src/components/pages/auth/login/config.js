export const loginValidators = {
   email: [
      // Key names (Ex: 'isRequired', 'isEmail') must match function names in /src/validators/inputValidator.js. (Pls check this file)
      { isRequired: [] }, // Uses default isRequired validation msg.
      { isEmail: ['Please enter a valid email'] },
      // The array elements will be passed as args to the matching function in the order that they're stated here
   ],
   password: [{ isRequired: [] }],
};

export const MAX_LOGIN_ATTEMPTS = 5;
