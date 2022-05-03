import { createSelector } from 'reselect';
import * as portfolioSelectors from '../portfolio/portfolio-selectors';

export const selectIncidentState = state => state.incident;

export const selectIncidents = createSelector(
   [selectIncidentState, portfolioSelectors.selectCurrentPortfolio],
   (incidentState, currentPortfolio) => incidentState[currentPortfolio?.name]
);

export const selectIncidentLoading = createSelector(
   [selectIncidentState],
   incident => incident.isLoading
);
