import React from 'react';
import { isNumber } from 'highcharts';

const GetPercentage = props => {
   const { Current, Previous, type, withoutIcon } = props;

   const CheckPostivie = Current - Previous;
   var GetPercentagevalue = 'N/A';
   var GraphStatus = 0;
   // This is for the Check negative or not.
   if (type === 'graph') {
      if (CheckPostivie < 0) {
         GraphStatus = 1;
         GetPercentagevalue = Math.round(
            ((Previous - Current) / Previous) * 100
         );
         return { GraphStatus, GetPercentagevalue };
      } else if (isNumber(CheckPostivie) === false) {
         GetPercentagevalue = 'N/A';
         GraphStatus = 3;
         return { GraphStatus, GetPercentagevalue };
      } else if (CheckPostivie === 0) {
         GetPercentagevalue = '0%';
         return { GraphStatus, GetPercentagevalue };
      } else if (Current === 0 || Previous === 0) {
         GraphStatus = 3;
         GetPercentagevalue = 'N/A';
         return { GraphStatus, GetPercentagevalue };
      } else {
         GetPercentagevalue = Math.round(
            ((Current - Previous) / Previous) * 100
         );
         GraphStatus = 2;
         return { GraphStatus, GetPercentagevalue };
      }
   } else {
      if (CheckPostivie < 0) {
         GetPercentagevalue = Math.round(
            ((Previous - Current) / Previous) * 100
         );
         if (withoutIcon) return GetPercentagevalue + '%';
         var returnValue = (
            <>
               <img
                  src={
                     process.env.PUBLIC_URL +
                     '/images/dashboard/Orange_down_arrow.png'
                  }
                  height={7}
                  width={7}
               />
               <span style={{ color: '#FFD580' }}> {GetPercentagevalue}%</span>
            </>
         );
         return returnValue;
      } else if (isNumber(CheckPostivie) === false) {
         GetPercentagevalue = 'N/A';
         return GetPercentagevalue;
      } else if (CheckPostivie === 0) {
         GetPercentagevalue = '0%';
         return GetPercentagevalue;
      } else if (Current === 0 || Previous === 0) {
         GetPercentagevalue = 'N/A';
         return GetPercentagevalue;
      } else {
         GetPercentagevalue = Math.round(
            ((Current - Previous) / Previous) * 100
         );
         if (withoutIcon) return GetPercentagevalue + '%';
         var returnValue = (
            <>
               <img
                  src={
                     process.env.PUBLIC_URL +
                     '/images/dashboard/Green_down_arrow.png'
                  }
                  height={7}
                  width={7}
               />
               <span style={{ color: '#00A300' }}> {GetPercentagevalue}%</span>
            </>
         );
         return returnValue;
      }
   }
};

export default GetPercentage;
