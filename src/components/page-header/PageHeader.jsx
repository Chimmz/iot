import React from 'react';
import { Link } from 'react-router-dom';
import * as strUtils from '../../utils/stringUtils';

import './PageHeader.scss';

export default function PageHeader(props) {
   // const pageUrl = props.location.pathname
   //    .replaceAll('/', ' / ')
   //    .trim()
   //    .split(' ');

   // // console.log(pageUrl);

   // const nonPages = ['admin-panel'];

   // const pageNavigation = pageUrl.map((text, i) => {
   //    if (text === '/') return <span key={i}>/</span>;

   //    const pageName = strUtils.toTitleCase(text.split('-').join(' '));
   //    const pageLink = pageUrl.slice(0, i + 1).join(''); // Get absolute path

   //    if (nonPages.includes(text)) return <span key={i}>{pageName}</span>;

   //    if (i !== pageUrl.length - 1)
   //       return (
   //          <Link to={pageLink} key={i}>
   //             {pageName}
   //          </Link>
   //       );
   //    return <span key={i}>{pageName}</span>;
   // });

   return (
      <></>
      // <div className='page__header d-flex align-items-center'>
      //    <Link to='/dashboard'>
      //       <img
      //          src={process.env.PUBLIC_URL + '/images/icons/home-solid.svg'}
      //       />
      //    </Link>

      //    {pageNavigation}
      // </div>
   );
}
