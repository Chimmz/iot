import { createSelector } from 'reselect';

export const selectPortfolio = state => state.portfolio;

export const selectPortfolioItems = createSelector(
   [selectPortfolio],
   portfolio => portfolio.portfolios
);

export const selectCurrentPortfolio = createSelector(
   [selectPortfolioItems],
   portfolios => {
      if (!portfolios?.length) return null;

      const currentPortfolio = portfolios.find(p => p.isCurrent);
      // Remove the isCurrent status to send unpolluted data
      if (currentPortfolio) delete currentPortfolio.isCurrent;
      return currentPortfolio;
   }
);
