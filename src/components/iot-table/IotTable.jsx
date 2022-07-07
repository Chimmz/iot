import React, { Fragment, useState, useEffect, useRef } from 'react';
import EukaDataTable from 'euka-datatables';

import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

import './IotTable.scss';

function IotTable(props) {
   const { data, columns, options, extraTableHeaderElements } = props;
   const dateFilterRef = useRef();
   const isIotPage = document.querySelector('#iotDeviceTable');

   const getTimePeriodTitle = timePeriod => {
      // execute the below if block only for IoT Device page, since date filter is not applicable for this page
      if (isIotPage) return `${timePeriod || props.currentTimePeriod}`;

      const [number, period] = `${timePeriod || props.currentTimePeriod}`.split(
         '-'
      );
      const singular = +number === 1;
      // Returns a string
      return ['Last', number, singular ? period : `${period}s`].join(' ');
   };

   useEffect(function reformUI() {
      const dateFilter = dateFilterRef.current;
      const searchInput = document.querySelector('.table-search-input');
      const entriesDropdown = document.querySelector(
         '.table-records-per-page-select'
      );
      entriesDropdown.parentElement.firstChild.data = '';
      entriesDropdown?.parentElement?.classList?.add(
         'd-flex',
         'align-items-center'
      );
      entriesDropdown?.insertAdjacentHTML(
         'beforebegin',
         '<span style="color:#4F5C69;">Show</span>'
      );
      entriesDropdown?.insertAdjacentHTML(
         'afterend',
         '<span style="color:#607080;">entries</span>'
      );

      if (searchInput?.placeholder) searchInput.placeholder = '';

      searchInput
         ?.closest('.table-filters')
         ?.insertAdjacentElement('afterbegin', dateFilter);

      extraTableHeaderElements?.forEach(elem => {
         searchInput
            ?.closest('.table-filters')
            ?.insertAdjacentHTML('beforeend', elem);
      });

      searchInput?.insertAdjacentHTML(
         'beforebegin',
         '<span style="color: #464648;">Search:</span>'
      );

      searchInput?.parentElement?.classList?.add(
         'd-flex',
         'align-items-center',
         'position-relative'
      );
      document.querySelector('.selected-info')?.classList.add('d-none');
   }, []);

   const timePeriodSelector = !props.dateFilterPeriods?.length ? (
      <></>
   ) : (
      <Fragment>
         {isIotPage ? <span>Floors: </span> : <span>Date Range: </span>}
         <DropdownButton
            variant="outline-secondary"
            id="segmented-button-dropdown-1"
            size="sm"
            title={getTimePeriodTitle()}
            onSelect={props.onDateFilter}
         >
            {props.dateFilterPeriods?.map(period => (
               <Dropdown.Item
                  key={period}
                  eventKey={period}
                  active={period === props.currentTimePeriod}
               >
                  {getTimePeriodTitle(period)}
               </Dropdown.Item>
            ))}
         </DropdownButton>
      </Fragment>
   );

   return (
      <Fragment>
         <div className="date-filter" ref={dateFilterRef}>
            {timePeriodSelector}
         </div>
         {/* {extraTableHeaderElements.length ? [...extraTableHeaderElements] : ''} */}
         <EukaDataTable columns={columns} data={data} options={options} />
      </Fragment>
   );
}

export default IotTable;
