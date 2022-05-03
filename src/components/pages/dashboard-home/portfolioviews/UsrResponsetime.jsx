import React, { useState, useEffect } from 'react';
import { subDays, differenceInDays } from 'date-fns';
import { isNumber } from 'highcharts';

// Calling redux here
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as portfolioSelectors from '../../../../redux/portfolio/portfolio-selectors';
import * as userSelectors from '../../../../redux/user/user-selectors';
import * as incidentSelectors from '../../../../redux/incident/incident-selectors';
import * as incidentUtils from '../../../../redux/incident/incident-dashboard-utils';


function UsrResponse(props) {
    const { currentPortfolio, userToken, Data } = props;
    const startDate = Data['startDate'];
    const endDate = Data['endDate'];
    // taking the previous date due to API response return as group total value
    const getDaysCount = differenceInDays(endDate, startDate)
    const previousStartDate = subDays(Data['startDate'],getDaysCount)
    const previousEndDate = subDays(Data['startDate'],1)
    // We are making this as array to call the API two time for getting the percentage value
    const [dateRange, setDateRange] = useState({start:startDate, end:endDate, prevStart: previousStartDate, prevEnd: previousEndDate})
    // Current response time by startDate and endDate
    const [userResponse, setUserResponse] = useState([]);
    // Previous response time by PreviousStartDate and PreviousEndDate
    const [PreviousUserResponse, setPreviousUserResponse] = useState([]);
    const [filteredDataLoading, setIsFilteredDataLoading] = useState(false);
 
    // This is for the current date range
    const loadUserResponse = async (props) => {
        const {Data, start, end, prevStart, prevEnd} = props;
        const makeRequest = () => {
                if (Data === 1){
                    return incidentUtils.fetchUserResponseTime(
                        currentPortfolio,
                        start,
                        end,
                        userToken
                    );
                }
                else if(Data === 2){
                    return incidentUtils.fetchUserResponseTime(
                        currentPortfolio,
                        prevStart,
                        prevEnd,
                        userToken
                        );
                }
        };
        const res = incidentUtils.handleFilterLoadingAsync(
            makeRequest,
            setIsFilteredDataLoading
        );
        const incids = await res;
        if (Data === 1){
            setUserResponse(incids);
        }
        else if (Data === 2){
            setPreviousUserResponse(incids);
        }
    };


 
    useEffect(() => {
       if (currentPortfolio) {
           loadUserResponse({Data:1, ...dateRange});
           loadUserResponse({Data:2, ...dateRange});
        }
    }, [dateRange, currentPortfolio?.portfolioHeaderId]);
    var oldresponsehrs = PreviousUserResponse.map((Data)=> { return Data.averageMinutes})
    var DisplayUserResponse = userResponse.map((Data)=> { return Data.averageMinutes})

    const GetPercentage = (props) => {
        const {Current, Previous} = props
        const CheckPostivie = Current - Previous
        var GetPercentagevalue = (Current / Previous) * 100
        GetPercentagevalue = Math.round(GetPercentagevalue)
        // This is for the Check negative or not.
        if (CheckPostivie < 0){
           var returnValue = (
           <>
           <img src={process.env.PUBLIC_URL + '/images/dashboard/Orange_down_arrow.png'} />
           <span style={{color:"#FFD580"}}>{GetPercentagevalue}%</span>
           </>)
        }
        else if (isNumber(CheckPostivie) === false){
           GetPercentagevalue="N/A";
           return GetPercentagevalue
        }
        else if (CheckPostivie === 0){
           GetPercentagevalue="N/A";
           return GetPercentagevalue
        }
        else if (Current === 0 || Previous === 0){
           GetPercentagevalue="N/A";
           return GetPercentagevalue
        }
        // this is for the positive showing percentage.
        else{
           var returnValue = (
           <>
           <img src={process.env.PUBLIC_URL + '/images/dashboard/Green_down_arrow.png'} />
           <span style={{color:"green"}}>{GetPercentagevalue}%</span>
           </>
           )
        }
        return returnValue
      }

    return(
        <>
        <div className='bg-white'  style={{borderRadius:"10px", boxShadow:"rgb(128 128 128) 0 0 15px"}}>
            <div>
                <div style={{fontSize:"15px"}} className='text-primary'><b>User Response Time</b></div>
                <img style={{float:'right'}} src={process.env.PUBLIC_URL + '/images/dashboard/UserResponseTime.png'} />
                <b>{DisplayUserResponse} mins</b>
                <p>{GetPercentage({Current: oldresponsehrs , Previous:DisplayUserResponse})}</p>
            </div>
        </div>
        </>
    )
};

 const mapStateToProps = createStructuredSelector({
    currentPortfolio: portfolioSelectors.selectCurrentPortfolio,
    // incidents: incidentSelectors.selectIncidents,
    incidentsLoading: incidentSelectors.selectIncidentLoading,
    userToken: userSelectors.selectUserToken
 });
 
 export default connect(mapStateToProps)(UsrResponse);