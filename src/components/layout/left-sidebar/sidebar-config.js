export const allLinks = [
   // The Dashboard Dropdown
   {
      hasMenu: true,
      imgSrc: '/images/icons/home-outline.svg',
      label: 'Dashboard',
      subItems: [
         { linkTo: 'dashboard', label: 'Overview' },
         { linkTo: 'highlights', label: 'Highlights' },
         {
            linkTo: 'insights',
            label: 'Insights',
            restriction: {
               roleType: 'view',
               restrictedTo: ['manager'],
            },
         },
      ],
   },
   // The Notifications Center link
   {
      linkTo: 'notifications',
      imgSrc: '/images/icons/notification-outline.svg',
      label: 'Notification Center',
   },
   // The Telemetry link
   {
      linkTo: 'telemetry',
      imgSrc: '/images/icons/telemetry-outline.svg',
      label: 'Telemetry',
   },
   // The Iot Devices link
   {
      linkTo: 'devices',
      imgSrc: '/images/icons/iot-outline.svg',
      label: 'IoT Devices',
   },
   // The Admin Panel Dropdown
   {
      hasMenu: true,
      imgSrc: '/images/icons/admin-outline.svg',
      label: 'Admin Panel',
      restriction: {
         roleType: 'access',
         restrictedTo: ['administrator', 'super administrator'],
      },
      subItems: [
         { linkTo: 'admin-panel/users-list', label: 'User Management' },
         { linkTo: 'admin-panel/configuration', label: 'Configuration' },
      ],
   },
];
