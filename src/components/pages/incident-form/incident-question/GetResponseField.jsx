import React, { useState, useContext, useEffect, useRef } from 'react';
import { incidentFormContext } from '../../../../contexts/incidentFormContext';

import InputField from '../../../UI/InputField';
import IncidentQuestion from './IncidentQuestion';

import InputGroup from 'react-bootstrap/InputGroup';

const GetResponseField = ({ que, className }) => {
   const {
      answers,
      answerQuestion,
      handleChangeInput,
      currentIncident,
      validationErrors
   } = useContext(incidentFormContext);

   const { questionOrder, responseDefaultValue } = que;
   const [userChoseOther, setUserChoseOther] = useState(false); // For radios only
   const radioRef = useRef(); // For radios only

   useEffect(() => {
      // Remove default selection of 'Other' on radio fields
      setUserChoseOther(false);
   }, [currentIncident]); // New questions are fetched if currentIncident changes

   switch (que?.responseFieldType) {
      case 'text':
         /* InputField is a custom component (not a React-Bootstrap compon.) returning Form.Control & Form.Control.Feedback */
         return (
            <InputGroup className={className}>
               <InputField
                  type="text"
                  name={questionOrder}
                  value={answers[questionOrder] || ''}
                  onChange={handleChangeInput}
                  validationErrors={validationErrors[questionOrder]}
               />
            </InputGroup>
         );

      case 'select':
         return (
            <IncidentQuestion.InputBySelect
               name={questionOrder}
               options={responseDefaultValue.split(',')}
               onChange={handleChangeInput}
               className={className}
               validationErrors={validationErrors[questionOrder]}
            />
         );

      case 'radio':
         const onChange = ev => {
            // prettier-ignore
            const currentValueIsOther = ev.target.value.toLowerCase() === 'other';
            setUserChoseOther(currentValueIsOther);

            if (currentValueIsOther)
               answerQuestion(questionOrder, null); // Update answer manually
            else handleChangeInput(ev);
         };

         const answerOptions = responseDefaultValue
            .split(',')
            .map(optn => optn.trim());

         return (
            <div>
               <IncidentQuestion.InputByRadio
                  options={answerOptions}
                  name={questionOrder}
                  onChange={onChange}
                  reactRef={radioRef}
                  validationErrors={validationErrors[questionOrder]}
               />
               {/* If user chose other, show a textarea for him to give details */}
               {userChoseOther && (
                  <InputGroup>
                     <InputField
                        fieldType="textarea"
                        type="text"
                        name={questionOrder}
                        value={answers[questionOrder] || ''}
                        onChange={handleChangeInput}
                        placeholder="Please provide details here"
                     />
                  </InputGroup>
               )}
            </div>
         );

      case 'calendar':
         return (
            <IncidentQuestion.InputByDate
               name={questionOrder}
               onChange={handleChangeInput}
               validationErrors={validationErrors[questionOrder]}
            />
         );

      case 'file':
         const addPhotoToAnswers = photoUrl => {
            const photosInAnswer = answers[questionOrder];
            let resultPhotos;

            if (!photosInAnswer?.length) resultPhotos = [photoUrl];
            else resultPhotos = [...photosInAnswer, photoUrl];
            answerQuestion(questionOrder, resultPhotos);
         };

         const removePhotoFromAnswers = photoUrl => {
            const photos = answers[questionOrder]?.filter(
               url => url !== photoUrl
            );
            answerQuestion(questionOrder, photos);
         };

         return (
            <IncidentQuestion.InputByCamera
               className={className}
               name={questionOrder}
               answers={answers}
               addPhotoToAnswers={addPhotoToAnswers}
               removePhotoFromAnswers={removePhotoFromAnswers}
               uploadedPhotos={answers[questionOrder]}
               maxUploads={4}
            />
         );
      default:
         return <></>;
   }
};

export default GetResponseField;
