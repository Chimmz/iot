import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { subDays, differenceInDays } from 'date-fns';

// Calling redux here
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as portfolioSelectors from '../../../../redux/portfolio/portfolio-selectors';
import * as userSelectors from '../../../../redux/user/user-selectors';
import * as incidentSelectors from '../../../../redux/incident/incident-selectors';
import * as incidentUtils from '../../../../redux/incident/incident-dashboard-utils';

function IncVsLogView(props) {
   const { currentPortfolio, userToken, Data } = props;
   const startDate = Data['startDate'];
   const endDate = Data['endDate'];
   const [incidents, setIncidents] = useState([]);
   const [filteredDataLoading, setIsFilteredDataLoading] = useState(false);

   const loadIncidents = async () => {
      const makeRequest = () => {
         return incidentUtils.fetchIncidents(
            currentPortfolio,
            startDate,
            endDate,
            userToken
         );
      };
      const res = incidentUtils.handleFilterLoadingAsync(
         makeRequest,
         setIsFilteredDataLoading
      );
      const incids = await res;
      setIncidents(incids);
   };

   useEffect(() => {
      if (currentPortfolio) loadIncidents();
   }, [startDate, endDate, currentPortfolio?.portfolioHeaderId]);


   // This is to get the days count.
   const getDaysCount = differenceInDays(endDate, startDate);
   var last30Days = incidents.filter(
      item => new Date(item.startTime) >= subDays(new Date(), getDaysCount)
   );
   var LogIncCount = last30Days.filter(
      item => item.incidentRecordHeaderName !== null
   ).length;
   var IncCount = last30Days.length;
   var DynamicData = {};
   var TempRoomName = {};
   for (var Datas = 0; Datas < last30Days.length; Datas++) {
      // floor base if
      if (last30Days[Datas]['floorName'] in DynamicData) {
         // room based if
         if (
            last30Days[Datas]['roomName'] in
            DynamicData[last30Days[Datas]['floorName']]
         ) {
            // Get the count from the incident (incCnt) and logged incident (lggCnt)
            var incCnt =
               DynamicData[last30Days[Datas]['floorName']][
               last30Days[Datas]['roomName']
               ]['inc'] + 1;
            var lggCnt =
               DynamicData[last30Days[Datas]['floorName']][
               last30Days[Datas]['roomName']
               ]['lgg'];
            // if the incident logged then count it
            if (last30Days[Datas]['incidentRecordHeaderName'] != null) {
               lggCnt = lggCnt + 1;
            }
            TempRoomName[last30Days[Datas]['roomName']] = {
               inc: incCnt,
               lgg: lggCnt
            };
            // append the existing data and the room new data as above line
            DynamicData[last30Days[Datas]['floorName']] = {
               ...DynamicData[last30Days[Datas]['floorName']],
               ...TempRoomName
            };
         }
         // room based else
         else {
            var lggCnt = 0;
            // increase if the logged message is there
            if (last30Days[Datas]['incidentRecordHeaderName'] != null) {
               lggCnt = lggCnt + 1;
            }
            TempRoomName[last30Days[Datas]['roomName']] = {
               inc: 1,
               lgg: lggCnt
            };
            DynamicData[last30Days[Datas]['floorName']] = {
               ...DynamicData[last30Days[Datas]['floorName']],
               ...TempRoomName
            };
         }
      }
      // Floor based else starts here
      else {
         DynamicData[last30Days[Datas]['floorName']] = {};
         var lggCnt = 0;
         if (last30Days[Datas]['incidentRecordHeaderName'] != null) {
            lggCnt = lggCnt + 1;
         }
         DynamicData[last30Days[Datas]['floorName']][
            last30Days[Datas]['roomName']
         ] = { inc: 1, lgg: lggCnt };
      }
   }
   const RenderData = props => {
      const DynamicData = props.Data;
      var DynamicPost = [];
      for (var data in DynamicData) {
         for (var InternalData in DynamicData[data]) {
            DynamicPost.push([
               <tr>
                  <td>
                     {data} {InternalData}
                  </td>
                  <td className='text-center'>{DynamicData[data][InternalData]['inc']}</td>
                  <td className='text-center'>{DynamicData[data][InternalData]['lgg']}</td>
               </tr>
            ]);
         }
      }
      return DynamicPost;
   };

   // Incidents values passing here
   return (
      <>
         <div className='card dashboard-card'>
            <div className='card-header'>
               <div className='text-primary'>
                  <b>Incidents vs Logged</b>
               </div>
            </div>
            <div className="card-body">
               <div className='d-flex justify-content-between px-3 py-2'>
                  <span className="h2">{' '}
                     {IncCount} / {LogIncCount}
                     {' '}
                  </span>
                  <img
                     style={{ float: 'right' }}
                     src={
                        process.env.PUBLIC_URL +
                        '/images/dashboard/invVSLog_warning.png'
                     }
                  />
               </div>
               <div className='table-wrapper-scroll-y thin-scrollbar mt-4 border-top ps-3'>
                  <table className='table table-hover'>
                     <thead>
                        <tr>
                           <th scope="col">Location</th>
                           <th scope="col"> incidents</th>
                           <th scope="col"> Logged incidents</th>
                        </tr>
                     </thead>
                     <tbody>
                        <RenderData Data={DynamicData} />
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </>
   );
}

const mapStateToProps = createStructuredSelector({
   currentPortfolio: portfolioSelectors.selectCurrentPortfolio,
   // incidents: incidentSelectors.selectIncidents,
   incidentsLoading: incidentSelectors.selectIncidentLoading,
   userToken: userSelectors.selectUserToken
});

export default connect(mapStateToProps)(IncVsLogView);
