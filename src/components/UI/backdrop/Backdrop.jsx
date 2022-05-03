import React from 'react';
import './Backdrop.scss';

function Backdrop({ show, classes, ...restProps }) {
   const className = ['backdrop', classes].join(' ');

   if (!show) return <></>;
   return <div className={className} {...restProps}></div>;
}

export default Backdrop;
