import React from 'react';

//CSS style
import '../Portfolioviews.scss';

// local imports
import DisplayData from '../utilities/getDisplayData';
import getDynamicDataForWaterCards from '../utilities/getDynamicDataForWaterCards';

function WaterLeakView(props) {
   // getting formatted data based on card type and incidents received from props
   const { TodayRecord, DynamicData } = getDynamicDataForWaterCards(
      props.incidents,
      'Leak'
   );
   const noData = TodayRecord?.length === 0;

   // Incidents values passing here
   return (
      <>
         <div className="card dashboard-card">
            <div className="card-header">
               <div className="text-primary">
                  <b>Water Leaks</b>
               </div>
            </div>
            <div className="card-body">
               <div className="d-flex justify-content-between px-3 py-2">
                  <span className="h2"> {TodayRecord.length}</span>
                  <img
                     src={
                        process.env.PUBLIC_URL +
                        '/images/dashboard/Water_Leaks_view.png'
                     }
                  />
               </div>
               <div className="table-wrapper-scroll-y thin-scrollbar mt-4 border-top ps-3">
                  <table className="table table-hover">
                     <thead>
                        <tr>
                           <th scope="col">Location</th>
                           <th scope="col" className="text-end">
                              Time
                           </th>
                        </tr>
                     </thead>
                     <tbody>
                        {noData ? (
                           <tr className='noinc-txt'><td colSpan={2} className="border-bottom-0 h-100">
                           <p className="d-flex justify-content-center align-items-center"> No Incidents</p></td></tr>
                        ) : (
                           <DisplayData Data={DynamicData} />
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </>
   );
}

export default WaterLeakView;
