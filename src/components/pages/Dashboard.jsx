import React from 'react';
import { Navigate } from 'react-router-dom';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as userCreators from '../../redux/user/user-action-creators';
import { selectUserStatusMsg } from '../../redux/user/user-selectors';

// Boostrap components
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import './Dashboard.scss';

function Dashboard({ dispatch, userStatusMsg }) {
   const handleClickLogoutBtn = () => dispatch(userCreators.logout());

   if (userStatusMsg === 'DEFAULT_PASSWORD')
      return <Navigate to='/change-password' />;

   return (
      <>
         <div className=''>
            <div className='page__header d-flex justify-content-between align-items-center'>
               <h2 className='fs18 fw-600 text-black mb-0'>DASHBOARD</h2>
               <div className='actions'>
                  <Button variant='light'>
                     Today{' '}
                     <img
                        src='images/icons/calendar.svg'
                        className='ms-2'
                        alt='calendar-icon'
                     />
                  </Button>
                  <Button variant='light' className='ms-2'>
                     <img src='images/icons/download.svg' alt='download-icon' />
                  </Button>
               </div>
            </div>

            <Row className='g-4'>
               <Col lg='8'>
                  <Row className='g-4'>
                     <Col md='4' sm='5'>
                        <Card>
                           <Card.Header>
                              <h4>Device Overview</h4>
                           </Card.Header>
                           <Card.Body>
                              Lorem ipsum dolor, sit amet consectetur
                              adipisicing elit. Nam nemo, quia atque quisquam
                              maxime perferendis doloremque voluptates animi
                              aperiam voluptate
                           </Card.Body>
                        </Card>
                     </Col>
                     <Col md='8' sm='7'>
                        <Card>
                           <Card.Header>
                              <h4>Realtime Activity</h4>
                              <DropdownButton
                                 className='ac-drop'
                                 title={
                                    <img src='images/icons/more-vertical.svg' />
                                 }
                                 id='input-group-dropdown-1'>
                                 <Button
                                    variant='light'
                                    className='btn-sm w-100'>
                                    Action 1
                                 </Button>
                                 <Button
                                    variant='light'
                                    className='btn-sm w-100'>
                                    Action 2
                                 </Button>
                                 <Button
                                    variant='light'
                                    className='btn-sm w-100'>
                                    Action 3
                                 </Button>
                              </DropdownButton>
                           </Card.Header>
                           <Card.Body>
                              <ul className='list-unstyled ps-0 mb-0'>
                                 <li>
                                    <span className='fw-600'>
                                       Leakage Sensor #13LS7
                                    </span>{' '}
                                    | 7th Floor | Power Issue found on-site
                                    <div className='d-flex justify-content-between'>
                                       <span className='d-block'>
                                          Turned on by Stephen
                                       </span>
                                       <span className='fw-600 text-dark'>
                                          9:45 AM
                                       </span>
                                    </div>
                                 </li>
                                 <li>
                                    <span className='fw-600'>
                                       Temp Sensor #13TS9
                                    </span>{' '}
                                    | 14th Floor | Device not working, and ...
                                    <div className='d-flex justify-content-between'>
                                       <span className='d-block'>
                                          New device installed by John
                                       </span>
                                       <span className='fw-600 text-dark'>
                                          4:05 AM
                                       </span>
                                    </div>
                                 </li>
                              </ul>
                           </Card.Body>
                        </Card>
                     </Col>
                  </Row>

                  {/* ---- Data Table ---- */}
                  <Card className='mt-4'>
                     <Card.Header>
                        <h4>Realtime Activity</h4>
                        <DropdownButton
                           className='ac-drop'
                           title={<img src='images/icons/more-vertical.svg' />}
                           id='input-group-dropdown-1'>
                           <Button variant='light' className='btn-sm w-100'>
                              Action 1
                           </Button>
                           <Button variant='light' className='btn-sm w-100'>
                              Action 2
                           </Button>
                           <Button variant='light' className='btn-sm w-100'>
                              Action 3
                           </Button>
                        </DropdownButton>
                     </Card.Header>
                     <Card.Body>
                        <ul className='list-unstyled ps-0 mb-0'>
                           <li>
                              <span className='fw-600'>
                                 Leakage Sensor #13LS7
                              </span>{' '}
                              | 7th Floor | Power Issue found on-site
                              <div className='d-flex justify-content-between'>
                                 <span className='d-block'>
                                    Turned on by Stephen
                                 </span>
                                 <span className='fw-600 text-dark'>
                                    9:45 AM
                                 </span>
                              </div>
                           </li>
                           <li>
                              <span className='fw-600'>Temp Sensor #13TS9</span>{' '}
                              | 14th Floor | Device not working, and ...
                              <div className='d-flex justify-content-between'>
                                 <span className='d-block'>
                                    New device installed by John
                                 </span>
                                 <span className='fw-600 text-dark'>
                                    4:05 AM
                                 </span>
                              </div>
                           </li>
                        </ul>
                     </Card.Body>
                  </Card>
               </Col>
            </Row>
            {/* -- Row -- */}
         </div>
      </>
   );
}

const mapStateToProps = createStructuredSelector({
   userStatusMsg: selectUserStatusMsg
});

export default connect(mapStateToProps)(Dashboard);
