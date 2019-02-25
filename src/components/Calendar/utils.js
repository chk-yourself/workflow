import { MONTHS } from './constants';

export const isLeapYear = year =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

export const getMonthFirstDay = (monthIndex, year) =>
  new Date(year, monthIndex, 1).getDay();

export const isToday = date =>
  new Date().setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0);

export const isYesterday = date => {
  const today = new Date();
  return (
    new Date(today.setDate(today.getDate() - 1)).setHours(0, 0, 0, 0) ===
    date.setHours(0, 0, 0, 0)
  );
};

export const getMonthDays = (monthIndex, year) => {
  if (monthIndex === 1) {
    return isLeapYear(year) ? 29 : 29;
  }
  return MONTHS[monthIndex].daysTotal;
};

export const getPrevMonth = (monthIndex, year) => {
  return {
    month: monthIndex > 0 ? monthIndex - 1 : 11,
    year: monthIndex > 0 ? year : year - 1
  };
};

export const getNextMonth = (monthIndex, year) => {
  return {
    month: monthIndex < 11 ? monthIndex + 1 : 0,
    year: monthIndex < 11 ? year : year + 1
  };
};

export const getMonthDates = (month, year) => {
  const monthDays = getMonthDays(month, year);
  const monthFirstDay = getMonthFirstDay(month, year);
  const prevMonthDays = getMonthDays(month, year);
  const daysFromPrevMonth = monthFirstDay;
  const daysFromNextMonth = 7 - ((monthFirstDay + monthDays) % 7);
  const prevMonthDates = [...new Array(daysFromPrevMonth)].map((n, i) => {
    return {
      day: prevMonthDays - daysFromPrevMonth + i + 1,
      ...getPrevMonth(month, year)
    };
  });

  const thisMonthDates = [...new Array(monthDays)].map((n, i) => {
    return {
      day: i + 1,
      month,
      year
    };
  });

  const nextMonthDates = [...new Array(daysFromNextMonth)].map((n, i) => {
    return {
      day: i + 1,
      ...getNextMonth(month, year)
    };
  });

  return [...prevMonthDates, ...thisMonthDates, ...nextMonthDates];
};

export const isDate = date =>
  Object.prototype.toString.call(date) === '[object Date]';

export const getSimpleDate = date => {
  const dateObj =
    !isDate(date) && typeof date === 'string' ? new Date(date) : date;
  return {
    day: dateObj.getDate(),
    month: dateObj.getMonth(),
    year: dateObj.getFullYear()
  };
};
