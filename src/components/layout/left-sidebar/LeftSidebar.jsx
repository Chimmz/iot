import React, { useEffect, useContext } from 'react';
import { useLocation, NavLink } from 'react-router-dom';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as userSelectors from '../../../redux/user/user-selectors';

import { dashboardContext } from '../../../contexts/dashboardContext';
import { v4 as uuidv4 } from 'uuid';

import { allLinks, adminLinks } from './sidebar-config';
import { ChevronDown } from 'react-bootstrap-icons';
import './LeftSidebar.scss';

// TO ADD A NEW LINK TO THE SIDEBAR, ADD IT IN ./config.js

function LeftSidebar({ userViewRole, userAccessRole }) {
   const { sidebarCollapsed, toggleSidebarCollapsed, hideSidebar } =
      useContext(dashboardContext);
   const location = useLocation();

   const collapseDropdown = dropdown => {
      // Collapse dropdown by unchecking its checkbox
      dropdown.querySelector("input[type='checkbox']").checked = false;
   };

   useEffect(() => {
      if (!sidebarCollapsed) return;
      // Collapse all dropdowns when the sidebar collapses
      const dropdowns = document
         .querySelector('aside.mainSideBar')
         .querySelectorAll('.drop-down');
      dropdowns.forEach(collapseDropdown);
   }, [sidebarCollapsed]);

   const setDropdownTogglerActive = function (dropdown, bool) {
      const toggler = dropdown.querySelector('.drop-down-toggler');
      const img = toggler.querySelector('img');
      toggler.classList[bool ? 'add' : 'remove']('active');
      // Set image active or inactive depending on the value of 'bool'
      img.src = img.src.replace(
         bool ? 'outline' : 'active',
         bool ? 'active' : 'outline'
      );
   };

   const openDropdown = function (dropdown, { closeOthers = false }) {
      const dropCheckbox = dropdown.querySelector("input[type='checkbox']");
      dropCheckbox.checked = true;
      if (!closeOthers) return;

      const otherDropdowns = [
         ...document
            .querySelector('aside.mainSideBar')
            .querySelectorAll('.drop-down'),
      ].filter(
         drop => drop.querySelector("[type='checkbox']").id != dropCheckbox.id
      );
      console.log(otherDropdowns);

      otherDropdowns.forEach(collapseDropdown);
      otherDropdowns.forEach(d => setDropdownTogglerActive(d, false));
   };

   const controlLinkImages = function () {
      const sideLinks = document
         .querySelector('aside.mainSideBar')
         .querySelectorAll('.sidebar-link');

      sideLinks.forEach(link => {
         const isActive = link.classList.contains('active');
         const img = link.querySelector('img');

         if (!isActive && img.src.includes('active')) {
            img.src = img.src.replace('active', 'outline');
            return;
         }
         if (isActive) img.src = img.src.replace('outline', 'active');
      });
   };

   const controlDropdowns = function () {
      // Get the true active navlink
      const activeLink = document
         .querySelector('aside.mainSideBar')
         .querySelector('.active:not(.drop-down-toggler)');

      console.log('Active sideLink: ', activeLink);

      // Check if it is a child link of a dropdown
      const isSublink = activeLink.classList.contains('sidebar-sublink');

      if (isSublink) {
         const dropdown = activeLink.closest('.drop-down'); // Get its ancestor
         openDropdown(dropdown, { closeOthers: true });
         setDropdownTogglerActive(dropdown, true); // Make it look like an active navlink
         return;
      }
      // -------- If not a sublink, collapse all previously opened dropdowns and make them inactive ------
      // Get all dropdowns
      const dropdowns = document
         .querySelector('aside.mainSideBar')
         .querySelectorAll('.drop-down');

      dropdowns.forEach(collapseDropdown); // Collapse them
      dropdowns.forEach(d => setDropdownTogglerActive(d, false)); // Make them inactive
   };

   useEffect(() => {
      controlLinkImages();
      controlDropdowns();
      hideSidebar(); // Hide mobile side bar when a sidebar link is clicked
   }, [location.pathname]);

   // Must use the 'function' style because of the use of the 'this' keyword
   const protectLink = function (link) {
      if (!link.restriction) return this.element;
      const { roleType, restrictedTo } = link.restriction;
      let isAuthorized = false;

      switch (roleType) {
         case 'view':
            isAuthorized = restrictedTo.includes(
               userViewRole?.name.toLowerCase()
            );
            if (isAuthorized) return this.element;
         case 'access':
            isAuthorized = restrictedTo.includes(
               userAccessRole?.name.toLowerCase()
            );
            if (isAuthorized) return this.element;
         default:
            return <></>;
      }
   };

   const getDropdown = function (dropdown) {
      const id = uuidv4();
      const element = (
         <div className="drop-down" key={dropdown.label}>
            <input type="checkbox" id={id} />
            <label htmlFor={id} className="d-block">
               <span className="drop-down-toggler">
                  <img src={process.env.PUBLIC_URL + dropdown.imgSrc} alt="" />
                  <span>{dropdown.label}</span>
                  <ChevronDown />
               </span>
            </label>

            {/* Dropdown Menu Items */}
            <ul className="drop-down-items">
               {dropdown.subItems.map(item => {
                  const element = (
                     <li className="drop-down-item" key={item.label}>
                        <NavLink
                           className={`sidebar-sublink `}
                           to={item.linkTo}
                        >
                           -- <span className="drop-sublink">{item.label}</span>
                        </NavLink>
                     </li>
                  );
                  return protectLink.call({ element }, item);
               })}
            </ul>
         </div>
      );
      return protectLink.call({ element }, dropdown);
   };

   const getSingleLink = function (link) {
      const element = (
         <NavLink to={link.linkTo} className="sidebar-link" key={link.label}>
            <img src={process.env.PUBLIC_URL + link.imgSrc} alt="" />
            <span>{link.label}</span>
         </NavLink>
      );
      return protectLink.call({ element }, link);
   };

   // Collapse all dropdowns when the mouse leaves the sidebar in the compact/collapsed state
   const handleMouseLeave = function () {
      if (!sidebarCollapsed) return;
      const dropdowns = document
         .querySelector('aside.mainSideBar')
         .querySelectorAll('.drop-down');
      dropdowns.forEach(collapseDropdown);
   };

   return (
      <aside className="mainSideBar" onMouseLeave={handleMouseLeave}>
         <div className="side-links mt-4">
            {allLinks.map(link =>
               link.hasMenu ? getDropdown(link) : getSingleLink(link)
            )}
         </div>
      </aside>
   );
}

const mapStateToProps = createStructuredSelector({
   userViewRole: userSelectors.selectUserViewRole,
   userAccessRole: userSelectors.selectUserAccessRole,
});

export default connect(mapStateToProps)(LeftSidebar);
