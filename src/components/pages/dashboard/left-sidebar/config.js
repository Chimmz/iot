export const sidebarLinks = [
   {
      linkTo: 'dashboard',
      hasMenu: true,
      imgSrc: '/images/icons/home-solid.svg',
      label: 'Dashboard',
      subItems: [
         { linkTo: 'overview', label: 'Overview' },
         { linkTo: 'highlights', label: 'Highlights' }
      ]
   },
   {
      linkTo: 'devices',
      imgSrc: '/images/icons/iot-solid.svg',
      label: 'IoT Devices'
   },
   {
      linkTo: 'telemetry',
      imgSrc: '/images/icons/telemetry-solid.svg',
      label: 'Telemetry'
   },
   {
      linkTo: 'notifications',
      imgSrc: '/images/icons/notification-solid.svg',
      label: 'Notification Center'
   },
   {
      linkTo: '#0',
      hasMenu: true,
      imgSrc: '/images/icons/admin-solid.svg',
      label: 'Admin Panel',
      subItems: [
         { linkTo: 'admin-panel/configuration', label: 'Configuration' },
         { linkTo: 'admin-panel/users-list', label: 'Users List' }
      ]
   }
];
