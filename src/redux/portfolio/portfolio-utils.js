export const getPortfolioString = portf => {
   const portfName = portf.name;

   if (!portf.city) return portfName;
   return portfName + ' - ' + portf.city;
};
