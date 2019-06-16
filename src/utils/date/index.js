// Helper functions for working with date objects

/* eslint-disable no-nested-ternary */
import { MONTHS, WEEK_DAYS } from './constants';

export { MONTHS, WEEK_DAYS };

export const isLeapYear = year =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

export const getMonthFirstDay = (monthIndex, year) =>
  new Date(year, monthIndex, 1).getDay();

export const isToday = date =>
  new Date().setHours(0, 0, 0, 0) === new Date(+date).setHours(0, 0, 0, 0);

export const isYesterday = date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (
    today.setDate(today.getDate() - 1) === new Date(+date).setHours(0, 0, 0, 0)
  );
};

export const isTomorrow = date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (
    today.setDate(today.getDate() + 1) === new Date(+date).setHours(0, 0, 0, 0)
  );
};

export const isThisYear = date => {
  return date.getFullYear() === new Date().getFullYear();
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

/**
 * Pads the start of given value with zero until it reaches the given length
 * @param {Number|String} value - The string to pad
 * @param {Number} length - The target length
 */

export const padZero = (value, length) => {
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
  return `${padZero(month + 1, 2)}-${padZero(day, 2)}-${year - 2000}`;
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

/**
 * Checks if date falls within specified time frame
 * @param {Date Object} date - Javascript date object
 * @param {Number} num - The number of days comprising the time frame to check the date against
 * @param {Date Object} startingDate - The first day of the time frame
 */
export const isWithinDays = (date, num, startingDate = new Date()) => {
  const timeStart = startingDate.setHours(0, 0, 0, 0);
  const endingDate = new Date(startingDate);
  const timeEnd = endingDate.setDate(endingDate.getDate() + num);
  return +date >= timeStart && +date < timeEnd;
};

export const isPriorDate = (date, baseDate = new Date()) => {
  return +date < baseDate.setHours(0, 0, 0, 0);
};

export const toDateString = (
  date,
  options = {
    useRelative: false,
    format: {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: '2-digit'
    }
  }
) => {
  const { useRelative, format } = options;
  if (useRelative) {
    if (isToday(date)) {
      return 'Today';
    }
    if (isYesterday(date)) {
      return 'Yesterday';
    }
    if (isTomorrow(date)) {
      return 'Tomorrow';
    }
    if (isWithinDays(date, 7)) {
      return WEEK_DAYS[date.getDay()].long;
    }
  }
  return Object.keys(format)
    .map(key => {
      switch (key) {
        case 'weekday': {
          const value = format[key];
          const weekday = date.getDay();
          return WEEK_DAYS[weekday][value];
        }
        case 'month': {
          const value = format[key];
          const month = date.getMonth();
          if (value === 'numeric') {
            return month + 1;
          }
          if (value === '2-digit') {
            return padZero(month + 1, 2);
          }
          return MONTHS[month][value];
        }
        case 'day': {
          const value = format[key];
          const day = date.getDate();
          if (value === '2-digit') {
            return padZero(day, 2);
          }
          return day;
        }
        case 'year': {
          const value = format[key];
          const year = date.getFullYear();
          if (useRelative && isThisYear(date)) {
            return null;
          }
          if (value === '2-digit') {
            return `'${+year.slice(2)}`;
          }
          return year;
        }
        default: {
          return key;
        }
      }
    })
    .join(' ')
    .trim();
};

export const toTimeString = (date, { format = 'h:mm:ss', hour12 = true }) => {
  try {
    if (!isDate(date)) {
      throw new TypeError('Not a Date object');
    }
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const timeString = format
      .split(':')
      .map((unit, i) => {
        const digits = unit.length;
        if (i === 0) {
          const h = hour12 && hours > 12 ? hours - 12 : hours;
          return digits > 1 && h < 10 ? padZero(h, digits) : h;
        }
        if (i === 1) {
          return digits > 1 && minutes < 10
            ? padZero(minutes, digits)
            : minutes;
        }
        if (i === 2) {
          return digits > 1 && seconds < 10
            ? padZero(seconds, digits)
            : seconds;
        }
        return unit;
      })
      .join(':');
    return hour12 ? `${timeString} ${hours < 12 ? 'AM' : 'PM'}` : timeString;
  } catch (e) {
    console.error(e);
  }
};
