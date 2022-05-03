import InputField from "../../../UI/InputField";
import Form from "react-bootstrap/Form";
import { ImageList } from "../../../UI/image-gallery/ImageList";

export function GetRecordResponseField (record){
    switch(record.type) {
        case 'label':{
            return (
                   <label
                      type="text"
                      name={record.questionOrder}
                      className={record.classNameCustom}
                      style={record.customCSS}  
                   >{ record.value || ''}</label>
                )
        }
        case 'radio':{
            let defaultVal = record.defaultValue;
            defaultVal = typeof(defaultVal)==='string' ? defaultVal.split(',') : defaultVal;
            let selectedValFoundInRadio = false;
            Object.keys(defaultVal).map((k,v)=>{
                if(record.value===defaultVal[k])
                    selectedValFoundInRadio=true;
                return ()=>{};
            })
            return(
                <>
                {Object.keys(defaultVal).map((k,v)=>(
                    <Form.Check
                        key={v}
                        disabled
                        type='radio'
                        label={defaultVal[k]}
                        id={`disabled-default-${defaultVal[k]}`}
                        checked={record.value===defaultVal[k] || (!selectedValFoundInRadio && defaultVal[k]===record.openExtFieldIf)}
                        

                    /> 
                ))}

                {!selectedValFoundInRadio ? <GetRecordResponseField 
                                                type='text'
                                                name={'radio'+record.value}
                                                value= {record.value} 
                                                disabled={true}
                                                readOnly
                                                /> : 
                                            <GetRecordResponseField 
                                                type='text'
                                                name={'radio'+'border'}
                                                value= {''} 
                                                disabled={true}
                                                readOnly
                                                />
                }  
                
                </>             
                
            )
        }
        case 'file':{
            return(
                <div id='recordResponseImageList'>
                    <ImageList listOfImages={record.listOfImages}/>
                </div>
                
            )
        }
        default:{
            return (
                <InputField
                    type="text"
                    name={record.questionOrder}
                    value={record.value || ''}
                    disabled={record.disabled}
                    className={record.classNameCustom}
                    style={record.customCSS}
                    readOnly
                />
            )
        }
        
        
    }
}