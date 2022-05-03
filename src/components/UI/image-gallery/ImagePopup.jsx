import { useState, useEffect } from 'react';
import './ImagePopup.scss';
function ImagePopup(props) {
    const {clickedImgProp, listOfImages} = props;
    const [clickedImg, setClickedImg] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(null);

    // for setting state of viewed image when user has clicked any image from <ImageList>
    useEffect(()=>{
        if (!clickedImgProp)
            return;
        setClickedImg(clickedImgProp)
        setCurrentIndex(listOfImages.indexOf(clickedImgProp))
      },[clickedImgProp])
    // for changing the clickedImage from the list of images in the bottom tray
    const handleClickImg = (image,index) => {
        setCurrentIndex(index);
        setClickedImg(image);
    }
    // for handling click of close button
    const handleClick = (e) => {
        if (e.target.classList.contains("dismiss")) {
          setClickedImg(null);
        }
      };

      // for handling left arrow button, changing the clicked/viewed image 
      const handleRotationLeft = () => {
        const totalLength = listOfImages.length;
        if (currentIndex === 0) { // if current picture is first in list, set the new index to last element 
          setCurrentIndex(totalLength - 1);
          const newUrl = listOfImages[totalLength - 1];
          setClickedImg(newUrl);
          return;
        }
        const newIndex = currentIndex - 1;
        const newUrl = listOfImages.filter((item) => {
          return listOfImages.indexOf(item) === newIndex;
        });
        const newItem = newUrl[0];
        setClickedImg(newItem);
        setCurrentIndex(newIndex);
      };

      // for handling left arrow button, changing the clicked/viewed image 
      const handleRotationRight = () => {
          const totalLength = listOfImages.length;
          if (currentIndex + 1 >= totalLength) { // if current picture is last in list, set the new index to first element 
            setCurrentIndex(0);
            const newUrl = listOfImages[0];
            setClickedImg(newUrl);
            return;
          }
          const newIndex = currentIndex + 1   ;
          const newUrl = listOfImages.filter((item) => {
            return listOfImages.indexOf(item) === newIndex;
          });
          const newItem = newUrl[0];
          setClickedImg(newItem);
          setCurrentIndex(newIndex);
        };
    return (
        <>
        { clickedImg  && (<div className="overlay" onClick={handleClick} >
        <span className="dismiss"><i className="bi bi-x-circle-fill dismiss"  onClick={handleClick} style={{color:'#464648', fontSize:'50px'}}></i></span>

        <div className='overlay-background_image dismiss' style={{backgroundImage:`url(${clickedImg}`}}></div>
        <div className='col-12  clickedImg-view'>
            <img src={clickedImg}/>
        </div>
        <div className='overlay-container'>
            <div className='col-1  text-center'>
                <div onClick={handleRotationLeft} className="overlay-arrows_left">
                    <i className="bi bi-arrow-left-circle-fill " style={{ fontSize:'50px',color:'#464648'}}></i>
                </div>
            </div>
            <div className='col-10'></div>
            <div className='col-1  text-center' >
                <div onClick={handleRotationRight} className="overlay-arrows_right">
                    <i className="bi bi-arrow-right-circle-fill " style={{ fontSize:'50px',color:'#464648'}}></i>
                </div>                    
            </div>
            <div className='overlay-image_bottom mx-auto'>
            {listOfImages.map((image,index)=>{
                const classNameCustom = 'rounded-circle'+ (image===clickedImg?' clickedImg':'')
                return(<img src={image} className={classNameCustom} key={index} loading='lazy' onClick={()=>handleClickImg(image,index)}/>
                )
            }
            )}
        </div>
        </div>

        
        
    </div>)
        }
        </>
        
        
    )
}
export default ImagePopup;