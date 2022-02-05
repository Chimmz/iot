import React from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectUserLoggedIn } from '../../redux/user/user-selectors';

import './Dashboard.css';

function Dashboard() {
   return <h1>User Dashboard Page</h1>;
}

const mapStateToProps = createStructuredSelector({
   isLoggedIn: selectUserLoggedIn
});

export default Dashboard;
