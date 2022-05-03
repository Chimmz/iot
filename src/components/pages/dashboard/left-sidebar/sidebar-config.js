export const sidebarLinks = [
   {
      hasMenu: true,
      imgSrc: '/images/icons/home-solid.svg',
      label: 'Dashboard',
      subItems: [
         { linkTo: 'dashboard', label: 'Overview' },
         { linkTo: 'highlights', label: 'Highlights' }
      ]
   },
   {
      linkTo: 'notifications',
      imgSrc: '/images/icons/notification-solid.svg',
      label: 'Notification Center'
   },
   {
      linkTo: 'telemetry',
      imgSrc: '/images/icons/telemetry-solid.svg',
      label: 'Telemetry'
   },
   {
      linkTo: 'devices',
      imgSrc: '/images/icons/iot-solid.svg',
      label: 'IoT Devices'
   },
   {
      hasMenu: true,
      imgSrc: '/images/icons/admin-solid.png',
      label: 'Admin Panel',
      subItems: [
         { linkTo: 'admin-panel/users-list', label: 'User Management' },
         { linkTo: 'admin-panel/configuration', label: 'Configuration' }
      ]
   }
];

// otherDropdowns
//    .map(drop => drop.querySelector(" input[type='checkbox']"))
//    .forEach(input => (input.checked = false));

// otherDropdowns
//    .map(drop => drop.querySelector('.drop-down-toggler'))
//    .forEach(toggler => toggler.classList.remove('active'));
