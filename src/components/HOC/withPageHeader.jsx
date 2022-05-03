import React from 'react';
import { useLocation } from 'react-router-dom';

import PageHeader from '../page-header/PageHeader';

function WithPageHeader(Component) {
   return (
      <>
         <PageHeader location={useLocation()} />
         <Component />
      </>
   );
}

export default WithPageHeader;
