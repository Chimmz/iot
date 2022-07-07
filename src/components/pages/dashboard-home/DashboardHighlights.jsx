import React from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { subDays, addDays, differenceInDays } from 'date-fns';


import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { Calendar4Week, Water } from 'react-bootstrap-icons';
import Masonry from 'react-masonry-css';
import './DashboardHome.scss'

import PageHeader from '../../page-header/PageHeader';
import TrendingView from './portfolioviews/highlights/TrendingBox';
import IncVsLogView from './portfolioviews/highlights/IncidentVsLoggedView';
import UsrResponse from './portfolioviews/highlights/UsrResponsetime';
import GetIncidentStatus from './portfolioviews/highlights/IncidentStatus';
import HighestLoggedView from './portfolioviews/highlights/HighestLoggedIncidentView';

//API calling
import GetIncidents from './portfolioviews/highlights/IncidentsAPI';
import GetWaterTrend from './portfolioviews/highlights/WaterTrendingAPI';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as portfolioSelectors from '../../../redux/portfolio/portfolio-selectors';
import * as userSelectors from '../../../redux/user/user-selectors';

const Hightlights = (props) => {
    const Location = useLocation()
    var IncidentsRecord = [], WaterTrending = []
    // Added the default count as 30 days to showing on UI
    const DefaultSubDays = 29
    const APIsubDays = 59
    // Get the roles from the redux store and check the device state
    // Filter the role based on view and render whether manager, maintenence or portfolio
    const GetViewRole = props.roles.filter(item => item.roleType === "VIEW")
    const dashboard = GetViewRole[0]["code"]
    // This is for the calendar date display update part
    const DefStartDate =  subDays(new Date(), DefaultSubDays)
    const Deftoday = new Date()
    var CalDisplayStart = DefStartDate.getDate() + "/"+ (DefStartDate.getMonth()+1) +"/"+ DefStartDate.getFullYear()
    var CalDisplayend = Deftoday.getDate() + "/"+ (Deftoday.getMonth()+1) +"/"+ Deftoday.getFullYear()
    // create a State hooks for storing the date updating the latest date coming from the UI
    const [UpdateDate, setUpdateDate] = useState({ startDate: subDays(new Date(), DefaultSubDays), endDate: new Date() })
    const [updateDateAPI, setupdateDateAPI] = useState({ startDate: subDays(new Date(), APIsubDays), endDate: new Date() })
    const [calendarFormat, setCalendarFormat] = useState({startDate:CalDisplayStart, endDate:CalDisplayend})
    const RangeValidation = (props) => {
        const { start, end } = props
        if (end > addDays(new Date(), 1)) {
            window.alert("date range should not be greater")
        }
        else {
            // This is to update the days 
            setUpdateDate({ startDate: start, endDate: end })
            // this is to update the API date
            const getDaysCount = differenceInDays(end, start)
            const newStartDates = subDays(start, getDaysCount)
            setupdateDateAPI({ startDate: newStartDates, endDate: end })
            // This is for the calendar change
            const Calstart = start.getDate() + "/" + (start.getMonth()+1) + "/" + start.getFullYear()
            const Calend = end.getDate() + "/" + (end.getMonth()+1) + "/" + end.getFullYear()
            setCalendarFormat({startDate:Calstart, endDate:Calend})
        }
    }
    // API calling for the incidents will be called from here
    IncidentsRecord = GetIncidents({ Dates: updateDateAPI, Auth: props });
    // API calling for the water trending for the Trending box
    WaterTrending = GetWaterTrend({ Dates: updateDateAPI, Auth: props });
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
                    <button type="button" className="btn btn-light h3 px-4"> {calendarFormat["startDate"]} - {calendarFormat["endDate"]} <Calendar4Week className='mx-3' /> </button>
                </DateRangePicker>
            </>
        )
    }
    if (dashboard === "MAINTENANCE") {
        return (
            <>
                <div className="row g-4 border-bottom">
                    <div style={{ textAlign: "right" }}>
                        <CreateCalendar>
                            <input className="form-control form-control-lg" />
                        </CreateCalendar>
                    </div>
                    <div className='d-flex justify-content-end'>
                        <PageHeader location={Location} />
                    </div>
                </div>

                <div className="row g-4">
                    <div className='col-lg-8'>
                        <div className='row'>
                            <div className='col-md-6'>
                                <TrendingView Dates={UpdateDate} incidents={IncidentsRecord} WaterTrending = {WaterTrending}/>
                            </div>
                            <div className='col-md-6'>
                                <IncVsLogView Dates={UpdateDate} incidents={IncidentsRecord} />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    else if (dashboard === "MANAGER") {
        const breakpointColumnsObj = {
            default: 3,
            1100: 3,
            700: 2,
            500: 1
        };
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
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                >
                    <div>
                        <TrendingView Dates={UpdateDate} incidents={IncidentsRecord} WaterTrending = {WaterTrending}/>
                    </div>
                    <div>
                        <IncVsLogView Dates={UpdateDate} incidents={IncidentsRecord} />
                    </div>
                    <div>
                        <UsrResponse Dates={UpdateDate} Auth={props} />
                    </div>
                    <div>
                        <GetIncidentStatus Data={UpdateDate} />
                    </div>
                    <div>
                        <HighestLoggedView Dates={UpdateDate} incidents={IncidentsRecord} />
                    </div>
                    {/* <div>
                        <WatervsCost Dates={UpdateDate} />
                    </div> */}
                </Masonry>
            </>
        )
    }
}

const mapStateToProps = () => createStructuredSelector({
    currentPortfolio: portfolioSelectors.selectCurrentPortfolio,
    userToken: userSelectors.selectUserToken,
    roles: userSelectors.userRoles
});


export default connect(mapStateToProps)(Hightlights)