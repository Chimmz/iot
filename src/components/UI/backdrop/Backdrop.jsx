import React from 'react';
import './Backdrop.scss';

function Backdrop({ show, classes, blur, ...restProps }) {
   const classList = ['backdrop', classes];
   if (blur) classList.push('blur');

   if (!show) return <></>;
   return <div className={classList.join(' ')} {...restProps}></div>;
}

export default Backdrop;