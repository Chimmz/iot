export const getDaysPassed = (date1, date2) => {
   return (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24);
};

export const formatDate = (timestamp, options) => {
   return new Intl.DateTimeFormat(window.navigator.language, options).format(
      new Date(timestamp)
   );
};

export const getDateAndTime = timestamp => {
   const timeZone = {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
   };
   const yearOptions = { year: 'numeric' };
   const monthOptions = { month: '2-digit' };
   const dayOptions = { day: '2-digit' };
   const timeOptions = { hour: '2-digit', minute: 'numeric', hour12: true };
   const date = new Date(timestamp).toString();

   return (
      formatDate(date, yearOptions) +
      '-' +
      formatDate(date, monthOptions) +
      '-' +
      formatDate(date, dayOptions) +
      ', ' +
      formatDate(date, timeOptions)
   );
};

export const getNthDayBefore = (n, refDate = Date.now()) => {
   return +refDate - n * 24 * 60 * 60 * 1000;
};

export const periodToDaysMap = { day: 1, week: 7, month: 30, year: 365 };

export const getDateRangeBasedOnPeriod = timePeriod => {
   // Where timePeriod could be any of:  "n-day", "n-week", "n-month", "n-year"
   const [n, period] = timePeriod.split('-');
   console.log('timePeriod: ', timePeriod);

   const daysTotal = +n * periodToDaysMap[period];
   console.log('daysTotal: ', daysTotal);

   const today = new Date();
   const nDaysAgo = new Date(getNthDayBefore(daysTotal));

   return [nDaysAgo, today];
};
