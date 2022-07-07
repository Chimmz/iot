export const formatDate = (timestamp, options) => {
   return new Intl.DateTimeFormat(window.navigator.language, options).format(
      new Date(timestamp)
   );
};

export const getDaysPassed = (date1, date2) => {
   const daysDiff = (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24);
   return Math.round(daysDiff);
};
export const getHoursPassed = (date1, date2) => {
   const hoursDiff = (+date2 - +date1) / (1000 * 60 * 60);
   return Math.round(hoursDiff);
};
export const getMinsPassed = (date1, date2) => {
   const minsDiff = (+date2 - +date1) / (1000 * 60);
   return Math.round(minsDiff);
};
export const getSecsPassed = (date1, date2) => {
   const minsDiff = (+date2 - +date1) / 1000;
   return Math.round(minsDiff);
};

export const getDateOnly = (timestamp, options) => {
   const yearOptions = { year: 'numeric' };
   const monthOptions = { month: '2-digit' };
   const dayOptions = { day: '2-digit' };
   let date = new Date(timestamp);

   date = date.toString();
   return (
      formatDate(date, yearOptions) +
      '-' +
      formatDate(date, monthOptions) +
      '-' +
      formatDate(date, dayOptions)
   );
};

export const getDateAndTime = (timestamp, options) => {
   const yearOptions = { year: 'numeric' };
   const monthOptions = { month: '2-digit' };
   const dayOptions = { day: '2-digit' };
   const timeOptions = { hour: '2-digit', minute: 'numeric', hour12: true };
   const now = new Date();
   let date = new Date(timestamp);

   if (!options?.useTimeAgoStyle) {
      date = date.toString();
      return (
         formatDate(date, yearOptions) +
         '-' +
         formatDate(date, monthOptions) +
         '-' +
         formatDate(date, dayOptions) +
         ', ' +
         formatDate(date, timeOptions)
      );
   }

   const numDaysPassed = getDaysPassed(date, now);
   const isYesterday = numDaysPassed === 1;
   const isToday = numDaysPassed < 1;
   const isAtMostOneWeekAgo = numDaysPassed <= 7;
   const formatOptions = {
      hour: 'numeric',
      hour12: true,
      minute: 'numeric',
   };

   if (isToday) {
      const secsPassed = getSecsPassed(date, now);
      if (secsPassed < 60) return `${secsPassed} minutes ago`;

      const minsPassed = getMinsPassed(date, now);
      if (minsPassed < 60) return `${minsPassed} minutes ago`;

      const hoursPassed = getHoursPassed(date, now);
      if (hoursPassed < 5) return `${hoursPassed} hours ago`;

      return formatDate(date, formatOptions);
   }
   if (isYesterday) return 'Yesterday, ' + formatDate(date, formatOptions);

   if (isAtMostOneWeekAgo)
      return `${formatDate(date, { weekday: 'short' })},  ${formatDate(
         date,
         formatOptions
      )}`;
   else
      return formatDate(date, {
         ...formatOptions,
         day: 'numeric',
         month: 'short',
      });
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
