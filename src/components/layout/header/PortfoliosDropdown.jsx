import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import * as portfolioSelectors from '../../../redux/portfolio/portfolio-selectors';
import * as portfolioCreators from '../../../redux/portfolio/portfolio-action-creators';
import * as portfolioUtils from '../../../redux/portfolio/portfolio-utils';

function PortfoliosDropdown({ portfolios, currentPortfolio, dispatch }) {
   const [selectedPortfolioName, setSelectedPortfolioName] = useState('');

   // 'evKey' is the value of the 'eventKey' prop attached to the dropdown item
   const handleSelectPortfolio = evKey => {
      const selectedPortfolioName = evKey;
      if (currentPortfolio?.name === selectedPortfolioName) return; // if currentPortfolio name was clicked
      dispatch(portfolioCreators.setCurrentPortfolio(selectedPortfolioName));
   };

   const handleChangeCurrentPortfolio = () => {
      if (!currentPortfolio) return;
      setSelectedPortfolioName(
         portfolioUtils.getPortfolioString(currentPortfolio)
      );
   };

   useEffect(
      () => handleChangeCurrentPortfolio(),
      [currentPortfolio?.name || currentPortfolio]
   );

   useEffect(() => {
      if (portfolios?.length && !currentPortfolio)
         dispatch(portfolioCreators.setCurrentPortfolio(portfolios[0].name));
   }, [portfolios?.length, currentPortfolio]);

   if (!portfolios?.length) return <></>;

   return portfolios?.length == 1 ? (
      <span style={{ color: '#fff', marginInline: '1rem' }}>
         {portfolios[0].name + ' ' + portfolios[0].city}
      </span>
   ) : (
      <DropdownButton
         className="propertyDrop bg-none"
         id="input-group-dropdown-2"
         title={selectedPortfolioName}
         onSelect={handleSelectPortfolio}
         variant="none"
      >
         {portfolios?.map(p => (
            <Dropdown.Item
               key={p.name}
               eventKey={p.name}
               active={selectedPortfolioName.includes(p.name)}
            >
               {portfolioUtils.getPortfolioString(p)}
            </Dropdown.Item>
         ))}
      </DropdownButton>
   );
}

const mapStateToProps = createStructuredSelector({
   currentPortfolio: portfolioSelectors.selectCurrentPortfolio,
   portfolios: portfolioSelectors.selectPortfolioItems,
});

export default connect(mapStateToProps)(PortfoliosDropdown);
