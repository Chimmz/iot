import React from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { subDays, addDays, differenceInDays } from 'date-fns';


import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { Calendar4Week } from 'react-bootstrap-icons';
import Masonry from 'react-masonry-css';
import './DashboardHome.scss'

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as portfolioSelectors from '../../../redux/portfolio/portfolio-selectors';
import * as userSelectors from '../../../redux/user/user-selectors';

import PageHeader from '../../page-header/PageHeader';
//import GetIncidents from './portfolioviews/highlights/IncidentsAPI';
// import HighestwaterCost from './portfolioviews/insights/HighestWaterCostView';
// import HighestleakView from './portfolioviews/insights/HighestLeakView';
import WaterCostUsageview from './portfolioviews/insights/WaterCostvsUsageView';
// import WatervsCost from './portfolioviews/insights/WaterVSCost';


const Insights = (props) => {
    const Location = useLocation()
    // Added the default count as 30 days to showing on UI
    const DefaultSubDays = 29
    const APIsubDays = 59
    // Here Manager or maintanance is not required currently due to this insights menu itself
    // only apprear on the manager view 
    // Get the roles from the redux store and check the device state
    // Filter the role based on view and render whether manager, maintenence or portfolio
    // const GetViewRole = props.roles.filter(item => item.roleType==="VIEW")
    // const dashboard = GetViewRole[0]["code"]

    // This is for the calendar date display update part
    const DefStartDate =  subDays(new Date(), DefaultSubDays)
    const Deftoday = new Date()
    var CalDisplayStart = DefStartDate.getDate() + "/"+ (DefStartDate.getMonth()+1) +"/"+ DefStartDate.getFullYear()
    var CalDisplayend = Deftoday.getDate() + "/"+ (Deftoday.getMonth()+1) +"/"+ Deftoday.getFullYear()
    // create a State hooks for storing the date updating the latest date coming from the UI
    const [UpdateDate, setUpdateDate] = useState({ startDate: subDays(new Date(), DefaultSubDays), endDate: new Date() })
    const [updateDateAPI, setupdateDateAPI] = useState({ startDate: subDays(new Date(), DefaultSubDays), endDate: new Date() })
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
            const getDaysCount = differenceInDays(end, start);
            setupdateDateAPI({ startDate: start, endDate: end })
            // This is for the calendar change
            const Calstart = start.getDate() + "/" + (start.getMonth()+1) + "/" + start.getFullYear()
            const Calend = end.getDate() + "/" + (end.getMonth()+1) + "/" + end.getFullYear()
            setCalendarFormat({startDate:Calstart, endDate:Calend})
        }
    }
    // API will be called here to provide the data to the graph
    //const IncidentsRecord = GetIncidents({ Dates: updateDateAPI, Auth: props });
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
            </>)
    }
    console.log(UpdateDate)
    const breakpointColumnsObj = {
        default: 2,
        1100: 3,
        700: 2,
        500: 1
    };
    return (
        <>
            <div className="row g-4 border-bottom">
                <div style={{ textAlign: "right" }}>
                    <CreateCalendar>
                        <input className="form-control form-control-lg" />
                    </CreateCalendar>
                </div>
            </div>
            <PageHeader location={Location} />

            {/* <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
            > */}
                {/* <div>
                    <HighestwaterCost Dates={UpdateDate} incidents={IncidentsRecord} />
                </div>
                <div>
                    <HighestleakView Dates={UpdateDate} incidents={IncidentsRecord} />
                </div>
                <div>
                     <WatervsCost Dates={UpdateDate} />
                </div> */}
                <div className='row'>
                    <div className='col-md-10'>
                        <WaterCostUsageview Dates={updateDateAPI} />
                    </div>
                </div>
            {/* </Masonry> */}

        </>
    )
}

const mapStateToProps = () => createStructuredSelector({
    currentPortfolio: portfolioSelectors.selectCurrentPortfolio,
    userToken: userSelectors.selectUserToken,
    roles: userSelectors.userRoles
});


export default connect(mapStateToProps)(Insights)