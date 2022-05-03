import { SET_PORTFOLIOS, SET_CURRENT_PORTFOLIO } from './portfolio-actions';

export const setUserPortfolio = portfolios => ({
   type: SET_PORTFOLIOS,
   payload: { portfolios }
});

export const setCurrentPortfolio = name => ({
   type: SET_CURRENT_PORTFOLIO,
   payload: { name }
});
