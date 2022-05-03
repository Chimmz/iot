import React, { useState, createContext } from 'react';

export const incidentFormContext = createContext();

export function IncidentFormContextProvider(props) {
   const [answers, setAnswers] = useState({}); // Will hold user's response to questions
   const [validationErrors, setValidationErrors] = useState({}); // Will hold validation errors
   const [currentIncident, setCurrentIncident] = useState(null); // // Will hold selected incident type

   // This will handle onChange for text, radio, select inputs
   const handleChangeInput = function (ev) {
      const { target } = ev;

      setAnswers(prevState => ({
         ...prevState,
         [target.name]: target.value
      }));
   };

   // I mean answerQuestion to be a verb
   const answerQuestion = (queOrder, answer) => {
      setAnswers(answers => ({ ...answers, [queOrder]: answer }));
   };

   const setFieldErrors = (field, errors) => {
      setValidationErrors(errs => ({ ...errs, [field]: errors }));
   };

   const pushFieldError = (field, newError) => {
      let errors = validationErrors[field]; // Current errors in this field

      if (errors?.length)
         errors = [...errors, newError]; // Append feedback error
      else errors = [newError];

      setFieldErrors(field, errors);
   };

   const clearFieldError = field => setFieldErrors(field, []);

   const resetAnswers = () => setAnswers({});
   const clearAnswers = () => setAnswers({}); // Clear all user's input response

   return (
      <incidentFormContext.Provider
         value={{
            answers,
            setAnswers,
            answerQuestion,
            resetAnswers,
            clearAnswers,
            handleChangeInput,
            validationErrors,
            pushFieldError,
            clearFieldError,
            setValidationErrors,
            currentIncident,
            setCurrentIncident
         }}
      >
         {props.children}
      </incidentFormContext.Provider>
   );
}
