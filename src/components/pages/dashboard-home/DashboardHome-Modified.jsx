import React from 'react';
import { useLocation } from 'react-router-dom';
import WithPageHeader from '../../HOC/withPageHeader';

import PageHeader from '../../page-header/PageHeader';

function DashboardHome() {
   return (
      <>
         <PageHeader location={useLocation()} />
         <div className="row g-4">
            <div className="col-lg-8">
               <div className="row">
                  <div className="col-md-6">
                     <img
                        src={process.env.PUBLIC_URL + '/images/graph1.png'}
                        className="img-fluid"
                        alt="dashboard"
                     />
                  </div>
                  <div className="col-md-6">
                     <img
                        src={process.env.PUBLIC_URL + '/images/graph2.png'}
                        className="img-fluid"
                        alt="dashboard"
                     />
                  </div>
               </div>
               <div className="row">
                  <div className="col-md-4">
                     <img
                        src={process.env.PUBLIC_URL + '/images/kpi-1.png'}
                        className="img-fluid"
                        alt="dashboard"
                     />
                  </div>
                  <div className="col-md-4">
                     <img
                        src={process.env.PUBLIC_URL + '/images/kpi-2.png'}
                        className="img-fluid"
                        alt="dashboard"
                     />
                  </div>
                  <div className="col-md-4">
                     <img
                        src={process.env.PUBLIC_URL + '/images/kpi-3.png'}
                        className="img-fluid"
                        alt="dashboard"
                     />
                  </div>
               </div>
               <div className="row">
                  <div className="col-12">
                     <img
                        src={process.env.PUBLIC_URL + '/images/graph-1.png'}
                        className="img-fluid"
                        alt="dashboard"
                     />
                  </div>
               </div>
            </div>
            <div className="col-lg-4">
               <div className="col-sm-12">
                  <img
                     src={process.env.PUBLIC_URL + '/images/sidebar-1.png'}
                     className="img-fluid"
                     alt="dashboard"
                  />
               </div>
               <div className="col-sm-12">
                  <img
                     src={process.env.PUBLIC_URL + '/images/sidebar-2.png'}
                     className="img-fluid"
                     alt="dashboard"
                  />
               </div>
            </div>
         </div>
      </>
   );
}

export default DashboardHome;
