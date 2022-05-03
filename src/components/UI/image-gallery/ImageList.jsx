import { useState } from "react";
import ImagePopup from "./ImagePopup";

// component to display list of images in UI.
export const ImageList = (props) => {
    const { listOfImages } = props;
    const [clickedImgProp, setclickedImgProp] = useState(null);

    // this is to set the state of image clicked so that ImagePopup component is called and the rendered
    // view is changed.
    const handleClick = (image,index) => {
        setclickedImgProp(image);
    }

    return (
        <div className="wrapper">
            {listOfImages.map((image,index)=>(
                <img src={image} key={index} onClick={()=>handleClick(image,index)}/>
            ))}       
            { /*    call the ImagePopup component only if any of the images has been clicked
                    and th state <clickedImgProp> has been changed, forcing re-render.  */ }
            <ImagePopup 
                clickedImgProp={clickedImgProp} 
                listOfImages={listOfImages}
            />         
        </div>
    )
}