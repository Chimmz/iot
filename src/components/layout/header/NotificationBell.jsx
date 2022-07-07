import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import * as userSelectors from '../../../redux/user/user-selectors';
import * as notifSelectors from '../../../redux/notification/notification-selectors';
import * as portfolioSelectors from '../../../redux/portfolio/portfolio-selectors';
import * as notifsActions from '../../../redux/notification/notifications-actions';

import useToggle from '../../../hooks/useToggle';
import useFetch from '../../../hooks/useFetch';

import API from '../../../utils/apiUtils';
import { v4 as uuidv4 } from 'uuid';
import * as dateUtils from '../../../utils/dateUtils';

const MAX_NOTIFS_TO_PREVIEW = 10;

function NotificationBell(props) {
   const { reduxNewNotifs, newNotifsCount } = props;
   const [showNewNotifs, toggleShowNewNotifs, setOn, hideNewNotifs] =
      useToggle();

   useEffect(() => {
      newNotifsCount && hideNewNotifs(); // Hide new notifs dropdown when there's a new notif
   }, [newNotifsCount]);

   // prettier-ignore
   useEffect(() => {
      const clickOutsideHandler = ev => {
         const unreadNotifsDropdownClicked = ev.target.closest('.card.unread-notifs');
         const btnNotifBellClicked = ev.target.closest('button.notifs-alert');

         if (btnNotifBellClicked) return toggleShowNewNotifs();
         if (!unreadNotifsDropdownClicked) return hideNewNotifs();
      };

      document.onclick = clickOutsideHandler;
      return () => document.body.removeEventListener('click', clickOutsideHandler);
   }, []);

   const noNewNotifs = newNotifsCount === 0;

   // const a = dateUtils.getDateAndTime(new Date('2022-06-20T20:58:35.69'), {
   //    useTimeAgoStyle: true,
   // });
   // console.log('DAAATEE: ', a);
   return (
      <button
         className={`notifs-alert px-0 btn d-sm-block ${
            noNewNotifs && 'no-notifs'
         }`}
         data-notifs-count={newNotifsCount}
         data-show-dropdown={showNewNotifs && newNotifsCount && 'true'}
         onClick={toggleShowNewNotifs}
      >
         <img
            src={process.env.PUBLIC_URL + '/images/icons/bell-white.svg'}
            alt="Notifications"
         />
         {showNewNotifs && newNotifsCount ? (
            <div className={`card unread-notifs`}>
               <h6 className="text-primary"> Notifications </h6>
               {/* The list of unread notifications */}
               <div className="unread-notifs-list overflow-y-scroll thin-scrollbar">
                  {reduxNewNotifs.slice(0, MAX_NOTIFS_TO_PREVIEW).map(notif => (
                     <Link key={uuidv4()} to="/notifications" className="notif">
                        <div className="notif-msg">
                           <div className="d-flex">
                              <div className="notif-type">
                                 {notif?.category}
                              </div>
                              <div className="notif-time ms-auto">
                                 {dateUtils.getDateAndTime(
                                    notif?.generatedDateTime,
                                    {
                                       useTimeAgoStyle: true,
                                    }
                                 )}
                              </div>
                           </div>
                           <div>{notif?.message}</div>
                        </div>
                     </Link>
                  ))}
                  {newNotifsCount > MAX_NOTIFS_TO_PREVIEW ? (
                     <Link
                        className="see-all p-2 flex-grow-1"
                        to="/notifications"
                     >
                        View {newNotifsCount - MAX_NOTIFS_TO_PREVIEW} others
                     </Link>
                  ) : (
                     <></>
                  )}
               </div>
            </div>
         ) : (
            <></>
         )}
      </button>
   );
}

const mapStateToProps = createStructuredSelector({
   currentUser: userSelectors.selectCurrentUser,
   currentPortfolio: portfolioSelectors.selectCurrentPortfolio,
   userToken: userSelectors.selectUserToken,
   reduxNewNotifs: notifSelectors.selectUnreadNotifs,
   newNotifsCount: notifSelectors.selectUnreadNotifsCount,
});

export default connect(mapStateToProps)(NotificationBell);
