import React, { useEffect, useContext } from 'react';
import { useLocation, NavLink } from 'react-router-dom';

import { dashboardContext } from '../../../../contexts/dashboardContext';
import { v4 as uuidv4 } from 'uuid';

import { sidebarLinks } from './sidebar-config';
import { ChevronDown } from 'react-bootstrap-icons';
import './DashboardSidebar.scss';

// TO ADD A NEW LINK TO THE SIDEBAR, ADD IT IN ./config.js

function DashboardSidebar() {
   const { toggleSidebarCollapsed } = useContext(dashboardContext);
   const location = useLocation();

   const collapseDropdown = dropdown => {
      // A dropdown will be collapsed when its checkbox is unchecked
      dropdown.querySelector(" input[type='checkbox']").checked = false;
   };

   const setDropdownTogglerActive = (dropdown, bool) => {
      const toggler = dropdown.querySelector('.drop-down-toggler');
      const img = toggler.querySelector('img');

      toggler.classList[bool ? 'add' : 'remove']('active');

      // Set image active or inactive depending on the value of 'bool'
      img.src = img.src.replace(
         bool ? 'solid' : 'blue',
         bool ? 'blue' : 'solid'
      );
   };

   const openDropdown = (dropdown, { closeOthers = false }) => {
      const dropCheckbox = dropdown.querySelector("input[type='checkbox']");
      dropCheckbox.checked = true;

      if (!closeOthers) return;

      const otherDropdowns = [
         ...document
            .querySelector('aside.mainSideBar')
            .querySelectorAll('.drop-down')
      ].filter(
         drop => drop.querySelector("[type='checkbox']").id != dropCheckbox.id
      );
      console.log(otherDropdowns);

      otherDropdowns.forEach(collapseDropdown);
      otherDropdowns.forEach(d => setDropdownTogglerActive(d, false));
   };

   const controlLinkImages = () => {
      const sideLinks = document
         .querySelector('aside.mainSideBar')
         .querySelectorAll('.sidebar-link');

      sideLinks.forEach(link => {
         const isActive = link.classList.contains('active');
         const img = link.querySelector('img');

         if (!isActive && img.src.includes('blue')) {
            img.src = img.src.replace('blue', 'solid');
            return;
         }
         if (isActive) img.src = img.src.replace('solid', 'blue');
      });
   };

   const controlDropdowns = () => {
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
      // -------- If not a sublink, hide all previously opened dropdowns and make them inactive ------
      // Get all dropdowns
      const dropdowns = document
         .querySelector('aside.mainSideBar')
         .querySelectorAll('.drop-down');

      dropdowns.forEach(collapseDropdown); // Collapse their menu items
      dropdowns.forEach(d => setDropdownTogglerActive(d, false)); // Make them inactive
   };

   useEffect(() => {
      controlLinkImages();
      controlDropdowns();
   }, [location.pathname]);

   const getDropdown = dropdown => {
      const id = uuidv4();
      return (
         <div className='drop-down'>
            <input type='checkbox' id={id} />
            <label htmlFor={id} className='d-block'>
               <span className='drop-down-toggler'>
                  <img src={process.env.PUBLIC_URL + dropdown.imgSrc} alt='' />
                  <span>{dropdown.label}</span>
                  <ChevronDown />
               </span>
            </label>

            {/* Dropdown Menu Items */}
            <ul className='drop-down-items'>
               {dropdown.subItems.map(item => (
                  <li className='drop-down-item'>
                     <NavLink className={`sidebar-sublink `} to={item.linkTo}>
                        -- {item.label}
                     </NavLink>
                  </li>
               ))}
            </ul>
         </div>
      );
   };

   const getSingleLink = link => (
      <NavLink to={link.linkTo} className='sidebar-link'>
         <img src={process.env.PUBLIC_URL + link.imgSrc} alt='' />
         <span>{link.label}</span>
      </NavLink>
   );

   return (
      <aside className='mainSideBar'>
         <button
            className='btn btn-close d-md-none'
            onClick={toggleSidebarCollapsed}></button>
         <p className='title fs14'>main</p>

         <div className='side-links'>
            {sidebarLinks.map(link =>
               link.hasMenu ? getDropdown(link) : getSingleLink(link)
            )}
         </div>
      </aside>
   );
}

export default DashboardSidebar;
