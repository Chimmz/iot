import React from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { subDays, addDays } from 'date-fns';


import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { Calendar4Week } from 'react-bootstrap-icons';

import PageHeader from '../../page-header/PageHeader';
import TrendingView from './portfolioviews/TrendingBox';
import IncVsLogView from './portfolioviews/IncidentVsLoggedView';
import UsrResponse from './portfolioviews/UsrResponsetime'

const Hightlights = () => {
    const Location = useLocation()
    // Added the default count as 30 days to showing on UI
    const DefaultSubDays = 30
    const dashboard = 1
    // create a State hooks for storing the date updating the latest date coming from the UI
    const [UpdateDate, setUpdateDate] = useState({ startDate: subDays(new Date(), DefaultSubDays), endDate: new Date() })
    const RangeValidation = (props) => {
        const { start, end } = props
        console.log(start, end)
        if (end > addDays(new Date(), 1)) {
            window.alert("date range should not be greater")
        }
        else {
            setUpdateDate({ startDate: start, endDate: end })
        }
    }
    // this function is for displaying the calendar in the dashbard page 
    const CreateCalendar = () => {
        // This is for the callback default function for the DateRangePicker 
        const handleCallback = (start, end, label) => {
            //start._d and end._d is the key for getting the selected date.
            RangeValidation({ start: start._d, end: end._d })
        }
        return (
            <>
                <DateRangePicker
                    initialSettings={UpdateDate}
                    onCallback={handleCallback} >
                    <button type="button" className="btn btn-light h3 px-4"> Today <Calendar4Week className='mx-3' /> </button>
                </DateRangePicker>
            </>
        )
    }
    if (dashboard === 1) {
        return (
            <>
                <div className="row g-4 border-bottom">
                    <div className='d-flex justify-content-between'>
                        <PageHeader location={Location} />
                        <CreateCalendar />
                    </div>
                </div>

                <div className="row g-4">
                    <div className='col-lg-8'>
                        <div className='row'>
                            <div className='col-md-6'>
                                <TrendingView Data={UpdateDate} />
                            </div>
                            <div className='col-md-6'>
                                <IncVsLogView Data={UpdateDate} />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    else if (dashboard === 2) {
        return (
            <>
                <div className="row g-4">
                    <div style={{ textAlign: "right" }}>
                        <CreateCalendar>
                            <input className="form-control form-control-lg" />
                        </CreateCalendar>
                    </div>
                </div>
                <PageHeader location={Location} />
                <div className="row g-4">
                    <div className='col-lg-12'>
                        <div className='row'>
                            <div className='col-md-4'>
                                <TrendingView Data={UpdateDate} />
                            </div>
                            <div className='col-md-4'>
                                <IncVsLogView Data={UpdateDate} />
                            </div>
                            <div className='col-md-4'>
                                <UsrResponse Data={UpdateDate} />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
export default Hightlights