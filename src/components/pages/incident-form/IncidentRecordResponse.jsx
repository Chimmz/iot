import { NavLink } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import  Modal  from "react-bootstrap/Modal";
import  Button  from "react-bootstrap/Button";

import API from '../../../utils/apiUtils';
import useFetch from '../../../hooks/useFetch';
import Spinner from '../../UI/spinner/Spinner';
import { getDateAndTime } from '../../../utils/dateUtils';


import { GetRecordResponseField } from "./incident-question/GetRecordResponse";

import './IncidentFormPage.scss'
import './IncidentRecordResponse.scss'
import useToggle from '../../../hooks/useToggle';

export function IncidentRecordResponsePage(props){
    const [recordResponseShown, toggleShowRecordResponseDetails, _, hideRecordResponse] =
    useToggle(false);
    const [incidentRecordResponse, setIncidentRecordResponse] = useState({})
    const {userToken,recordId,recordName} = props;
    
    // for fetching
    const {
        sendRequest: sendGetIncidentRecordsResponseRequest,
        loading: getIncidentRecordsResponseRequestLoading
     } = useFetch();

    const formatRecordResponse = (reqData) =>{
        const response_dict = {};
        Object.keys(reqData).map((k,v) => {
            response_dict[reqData[v].questionOrder]=reqData[v];
            return ()=>{};
        });
        return response_dict;
    }
    const formatIfDateTimeField=(fieldValue)=>{
        if(new Date(fieldValue) instanceof Date && !isNaN(new Date(fieldValue).valueOf())){
            return getDateAndTime(fieldValue)
        }
        else{
            return fieldValue;
        }
    }

    useEffect(()=>{
        if(!recordResponseShown) return;
        const res = sendGetIncidentRecordsResponseRequest(
            API.getIncidentRecordResponse(userToken,recordId)
         );
         res.then(data=>setIncidentRecordResponse(formatRecordResponse(data)));
    },[recordResponseShown]);
    
    return (<>
        <div    className="incidentRecordAttachment" 
                style={{gap: "17px"}}
                onClick={toggleShowRecordResponseDetails}
                id = {recordId}
                >
                    <span className=''>{recordName}</span>
                    <Button variant="outline-primary">
                        <i className="bi bi-paperclip"></i>
                    </Button>
        </div>
        { (recordResponseShown) && (<>
        <Spinner show={getIncidentRecordsResponseRequestLoading}/>
        <Modal size='lg' centered show={recordResponseShown} onHide={toggleShowRecordResponseDetails} id='incidentRecordResponse'>
            <Modal.Header className='p-0 m-0'>
                <div className="incident-form__header d-flex justify-content-between">
                    <NavLink to="/dashboard" className="logo">
                        <img
                            src={
                                process.env.PUBLIC_URL +
                                '/images/insuretek-white-logo.svg'
                            }
                            className="img-fluid"
                            alt="logo"
                        />
                    </NavLink>

                    <span className="incident-form__header--title d-flex align-items-center">
                        Incident form Q&A
                    </span>
                </div>
            </Modal.Header>
            <Modal.Body className='p-0 m-0'>
                <div className="border shadow-lg  form-container" style={{backgroundColor:'white'}}>
                    <div className="incident-form__top d-md-flex justify-content-between align-items-center">
                            <div className="incident-form__topleft d-flex align-items-center mb-3">
                                <img
                                    src={
                                    process.env.PUBLIC_URL +
                                    '/images/icons/incident-form_icon.png'
                                    }
                                    className="img-fluid"
                                />
                                <span >
                                    Incident Type
                                </span>
                                
                            </div>
                            <div className="incident-form__topright mb-3">
                                    {<GetRecordResponseField
                                        type='select'
                                        questionOrder={0}
                                        value={recordName}
                                        class= 'mb-4 mb-lg-4 form-select form-select'
                                        disabled= {true}
                                        cssStyle={{backgroundColor:'white'}}
                                    />}
                            </div>
                    </div>   
                    <form className="incidentSelectOption__forms">
                        {Object.keys(incidentRecordResponse)?.length ? <h2>FNOL Info</h2> : null}
                        {
                            Object.keys(incidentRecordResponse).map((recordKey,i)=>{
                                return(
                                    <div key={i}>
                                        <div className="mb-1" >
                                            <span style={{marginRight:'1em'}}>{incidentRecordResponse[recordKey].questionOrder}.</span>
                                            <GetRecordResponseField 
                                                key={'QuestionOrder'+incidentRecordResponse[recordKey].questionOrder}
                                                type='label'
                                                name={incidentRecordResponse[recordKey].questionOrder}
                                                value={formatIfDateTimeField(incidentRecordResponse[recordKey].questionDescription)}
                                                customCSS = {{color:'#464648'}}
                                            />                                    
                                        </div>
                                        <div className="mb-3 ms-4">
                                            <GetRecordResponseField 
                                                key={'AnswerOrder'+incidentRecordResponse[recordKey].questionOrder}
                                                type={incidentRecordResponse[recordKey].responseFieldType}
                                                name={incidentRecordResponse[recordKey].questionOrder}
                                                value={formatIfDateTimeField(incidentRecordResponse[recordKey].selectedValue)}
                                                defaultValue={incidentRecordResponse[recordKey].responseDefaultValue}
                                                openExtFieldIf={incidentRecordResponse[recordKey].openExtFieldIf}
                                                disabled= {true}
                                                listOfImages = {incidentRecordResponse[recordKey].listOfImages}
                                                classNameCustom ="ps-1"
                                                customCSS = {{color:'#707070'}}
                                            />                                    
                                        </div>
                                    </div>                                    
                                )
                            })
                        }
                    </form>
                </div>
            </Modal.Body>


                
        </Modal>
        
        </>) }
    </> 
    )
}