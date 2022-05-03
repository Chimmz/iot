import React, { Component, useState, useEffect, useRef, Fragment } from 'react';
import ImgResizer from 'react-image-file-resizer';

import useInput from '../../../../hooks/useInput';
import InputField from '../../../UI/InputField';
import Form from 'react-bootstrap/Form';

const InputByText = function () {
   // const [
   //    value,
   //    handleValueChange,
   //    runValidators,
   //    validationErrors,
   //    setValidationErrors,
   //    pushError
   // ] = useInput({
   //    init: '',
   //    validators: [
   //       { isRequired: [] } // Uses default isRequired validation msg.
   //    ]
   // });
   // return (
   //    <InputField
   //       type="text"
   //       name={queDescriptionCamelCased}
   //       value={questionAnswers[queDescriptionCamelCased]}
   //       onChange={handleChange}
   //       placeholder=""
   //       validationErrors={[]}
   //    />
   // );
};

const InputBySelect = function ({ options, ...restProps }) {
   return (
      <select
         id='brokendevice-how__other'
         className='form-select'
         aria-label='Default select'
         {...restProps}>
         <option selected>Please Select</option>
         {options.map(opt => (
            <option key={opt} value={opt}>
               {opt}
            </option>
         ))}
      </select>
   );
};

const InputByTextarea = function () {
   return (
      <div className='col-md col-sm-12'>
         <textarea
            id='otherHowSource'
            cols='30'
            rows='2'
            placeholder='Please provide details here'
            className='b-left form-control'></textarea>
      </div>
   );
};

const InputByDate = function ({ validationErrors, ...restProps }) {
   const errorExists = validationErrors?.length;
   const errorClassName = errorExists && 'is-invalid';

   return (
      <input
         type='datetime-local'
         className={`form-control ${errorClassName}`}
         {...restProps}
      />
   );
};

const InputByRadio = function (props) {
   const { options, reactRef, validationErrors, ...restProps } = props;

   return options.map(opt => (
      <div className='form-check' key={opt}>
         <input
            type='radio'
            className='form-check-input'
            value={opt}
            ref={reactRef}
            {...restProps}
         />
         <label className='form-check-label fs-6'>{opt}</label>
      </div>
   ));
};

const InputByFileUpload = function (props) {
   const { answers, onChange: setAnswers } = props;
   const [chosenImages, setChosenImages] = useState([]);

   useEffect(() => {
      setAnswers(prevState => ({
         ...prevState,
         [props.name]: chosenImages
      }));
   }, [chosenImages.length]);

   const resizeFile = file => {
      return new Promise(resolve => {
         ImgResizer.imageFileResizer(
            file,
            92,
            113,
            'JPEG',
            80,
            0,
            uri => resolve(uri),
            'base64'
         );
      });
   };

   const handleChooseFile = async ev => {
      let { files } = ev.target;

      if (!files.length) return;
      if (files.length > 4) return console.log('Max of 4 files allowed');
      if (files.length + chosenImages.length > 4)
         return console.log('Max of 4 files allowed');

      files = Object.values(files);

      const promises = files.map(file => resizeFile(file));

      Promise.all(promises)
         .then(compressedImgs => {
            setChosenImages(prevState => [...prevState, ...compressedImgs]);
         })
         .catch(console.log);
   };

   return (
      <div className='upload-wrapper'>
         <div className='sections'>
            <section className='active'>
               <div className='images'>
                  <div className='pic'>
                     <label htmlFor='incident-shot'>Add photo</label>
                     <input
                        type='file'
                        multiple
                        className='pic'
                        id='incident-shot'
                        accept='image/*'
                        name={props.name}
                        onChange={handleChooseFile}
                     />
                  </div>
                  {answers[props.name]?.map((imageUrl, i) => (
                     <img key={i} src={imageUrl} alt='' className='img' />
                  ))}
               </div>
            </section>
         </div>
      </div>
   );
};

const InputByCamera = function (props) {
   const {
      uploadedPhotos,
      addPhotoToAnswers,
      removePhotoFromAnswers,
      maxUploads
   } = props;

   const [cameraStarted, setCameraStarted] = useState(false);
   const [hasCaptured, setHasCaptured] = useState(false);
   const [capturedPhoto, setCapturedPhoto] = useState(null);

   const videoRef = useRef();
   const canvasRef = useRef();

   const handleStartCamera = async () => {
      setHasCaptured(false);

      const stream = await navigator.mediaDevices.getUserMedia({
         video: { facingMode: 'environment' },
         audio: false
      });
      console.log(stream);

      videoRef.current.srcObject = stream;
      setCameraStarted(true);
   };

   const handleCapturePhoto = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas
         .getContext('2d')
         .drawImage(video, 0, 0, canvas.width, canvas.height);

      let imgUrl = canvas.toDataURL('image/jpeg'); // Image will be in base 64

      setCapturedPhoto(imgUrl);
      console.log(imgUrl);

      setHasCaptured(true);
   };

   const handleUploadPhoto = () => {
      setCameraStarted(false);
      setHasCaptured(false);
      props.addPhotoToAnswers(capturedPhoto);
   };

   const closeCamera = () => setCameraStarted(false);

   return (
      <div className='upload-wrapper'>
         <div className={`camera ${!cameraStarted && 'not-started'}`}>
            <span
               className='close-camera'
               title='Close camera'
               onClick={closeCamera}>
               &times;
            </span>
            {!hasCaptured ? (
               <video
                  src=''
                  width='700'
                  height='500'
                  ref={videoRef}
                  muted
                  autoPlay></video>
            ) : (
               <img
                  width='700'
                  height='500'
                  src={capturedPhoto}
                  // src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzNd0m991ZXRKHwXR0_o9dgieNqM7rXy5Ubg&usqp=CAU"
               />
            )}

            <div className='actions'>
               {!hasCaptured ? (
                  <button
                     className={`btn btn-primary ${
                        hasCaptured && 'btn-outline'
                     }`}
                     type='button'
                     onClick={handleCapturePhoto}>
                     Capture
                  </button>
               ) : (
                  <>
                     <button
                        className='btn text-white bg-none'
                        type='button'
                        onClick={handleStartCamera}>
                        Take a new photo
                     </button>
                     <button
                        className='btn btn-primary'
                        type='button'
                        onClick={handleUploadPhoto}>
                        Upload photo
                     </button>
                  </>
               )}
            </div>
            <canvas
               ref={canvasRef}
               id='canvas'
               width='700'
               height='500'
               style={{ display: 'none' }}></canvas>
         </div>

         <div className='images'>
            {(!uploadedPhotos || uploadedPhotos.length < maxUploads) && (
               <div className='take-pic' onClick={handleStartCamera}>
                  <label htmlFor='incident-shot'>Add photo</label>
               </div>
            )}
            {uploadedPhotos?.map((imageUrl, i) => (
               <picture key={i}>
                  <img src={imageUrl} alt='' className='img' />
                  <span
                     className='remove'
                     onClick={() => removePhotoFromAnswers(imageUrl)}>
                     Remove
                  </span>
               </picture>
            ))}
         </div>
      </div>
   );
};

class IncidentQuestion extends Component {
   static InputByText = InputByText;
   static InputBySelect = InputBySelect;
   static InputByTextarea = InputByTextarea;
   static InputByDate = InputByDate;
   static InputByRadio = InputByRadio;
   static InputByFileUpload = InputByFileUpload;
   static InputByCamera = InputByCamera;

   constructor(props) {
      super(props);
      this.props = props;
   }

   render() {
      const { que, validationErrors, responseField, ...restProps } = this.props;
      const firstError = validationErrors?.[0];

      return (
         <div {...restProps}>
            <label className='form-label fs-6'>{que.questionDescription}</label>

            {this.props.responseField}

            {/* Not for text fields because text field errors will be handled via the <InputGroup /> */}
            {firstError && que.responseFieldType !== 'text' && (
               <small className='app-error d-block'>{firstError.msg}</small>
            )}
         </div>
      );
   }
}

export default IncidentQuestion;
