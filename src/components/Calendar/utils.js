/* eslint-disable no-nested-ternary */
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
    return isLeapYear(year) ? 29 : 28;
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
  const { month: prevMonth, year: prevMonthYear } = getPrevMonth(month, year);
  const prevMonthDays = getMonthDays(prevMonth, prevMonthYear);
  const daysFromPrevMonth = monthFirstDay;
  const daysFromNextMonth = 7 - ((monthFirstDay + monthDays) % 7);
  const prevMonthDates = [...new Array(daysFromPrevMonth)].map((n, i) => {
    return {
      day: prevMonthDays - daysFromPrevMonth + i + 1,
      month: prevMonth,
      year: prevMonthYear
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

export const isSimpleDate = date => {
  return date && 'day' in date && 'month' in date && 'year' in date;
};

export const isSameDate = (date, base = new Date()) => {
  if (
    (!isDate(date) && !isSimpleDate(date)) ||
    (!isDate(base) && !isSimpleDate(base))
  )
    return false;
  const dateDay = date.day || date.getDate();
  const dateMonth = date.month || date.getMonth();
  const dateYear = date.year || date.getFullYear();
  const baseDay = base.day || base.getDate();
  const baseMonth = base.month || base.getMonth();
  const baseYear = date.year || base.getFullYear();
  return (
    dateDay === baseDay && dateMonth === baseMonth && dateYear === baseYear
  );
};

export const getNextYears = (num, startingYear = new Date().getFullYear()) => {
  return [...new Array(num)].map((item, i) => {
    return startingYear + i;
  });
};

export const zeroPad = (value, length) => {
  return `${value}`.padStart(length, '0');
};

/**
 * Returns string representation of simple date object with format `mm-dd-yy`
 * @param {Object} date - simple date object
 */
export const toSimpleDateString = date => {
  const simpleDate = isSimpleDate(date)
    ? date
    : isDate(date)
    ? getSimpleDate(date)
    : undefined;
  if (!simpleDate) return '';
  const { day, month, year } = simpleDate;
  return `${zeroPad(month + 1, 2)}-${zeroPad(day, 2)}-${year - 2000}`;
};

/**
 * Converts simple date string back to simple date object
 * @param {String} dateString
 */
export const toSimpleDateObj = dateString => {
  const dateArr = dateString.split('-');
  const month = dateArr[0] - 1;
  const day = +dateArr[1];
  const year = +dateArr[2] + 2000;
  if (day > getMonthDays(month, year)) {
    return getSimpleDate(new Date(year, month, day));
  }
  return {
    month,
    day,
    year
  };
};

export const isSDSFormat = dateString => {
  return /^\d{2}-\d{2}-\d{2}$/.test(dateString);
};
