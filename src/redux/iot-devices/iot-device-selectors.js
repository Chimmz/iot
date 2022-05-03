import { createSelector } from "reselect";
import * as portfolioSelectors from '../portfolio/portfolio-selectors';


export const selectIotDeviceState = state => state.iotDevice;

export const selectIotDevices = createSelector(
    [selectIotDeviceState, portfolioSelectors.selectCurrentPortfolio],
    (iotDeviceState,currentPortfolio) => iotDeviceState[currentPortfolio?.name]
);

export const selectIotDeviceLoading = createSelector(
    [selectIotDeviceState],
    iotDevice => iotDevice.isLoading
)