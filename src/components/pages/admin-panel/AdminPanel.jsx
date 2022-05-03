import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import withPageHeader from '../../HOC/withPageHeader';
import PageHeader from '../../page-header/PageHeader';
import Configuration from '../configuration/Configuration';

function AdminPanel(props) {
   return (
      <>
         <PageHeader location={useLocation()} />
      </>
   );
}

export default AdminPanel;
