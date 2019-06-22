import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  MONTHS,
  WEEK_DAYS,
  getNextMonth,
  getPrevMonth,
  getMonthDates,
  getNextYears
} from '../../utils/date';
import { Button, IconButton } from '../Button';
import { SelectDropdown } from '../SelectDropdown';
import { Swipeable } from '../Swipeable';
import './Calendar.scss';

export default class Calendar extends Component {
  static defaultProps = {
    onSelectDay: () => {},
    onSelectMonth: () => {},
    onSelectYear: () => {},
    classes: {
      calendar: '',
      weekday: '',
      day: ''
    }
  };

  static propTypes = {
    onSelectDay: PropTypes.func,
    onSelectMonth: PropTypes.func,
    onSelectYear: PropTypes.func,
    classes: PropTypes.shape({
      calendar: PropTypes.string,
      weekday: PropTypes.string,
      day: PropTypes.string
    })
  };

  state = {
    today: {
      day: new Date().getDate(),
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    }
  };

  goToNextMonth = () => {
    const { month, year, onSelectMonth } = this.props;
    onSelectMonth(getNextMonth(month, year));
  };

  goToPrevMonth = () => {
    const { month, year, onSelectMonth } = this.props;
    onSelectMonth(getPrevMonth(month, year));
  };

  selectMonth = e => {
    const month = +e.target.value;
    const { onSelectMonth, year } = this.props;
    onSelectMonth({ month, year });
  };

  selectYear = e => {
    const year = +e.target.value;
    const { onSelectYear } = this.props;
    onSelectYear(year);
  };

  render() {
    const { month, year, selectedDate, onSelectDay, classes } = this.props;
    const { today } = this.state;
    const dates = getMonthDates(month, year);
    const years = getNextYears(4);
    const yearOptions = years.reduce((options, currentYear) => {
      const label = `${currentYear}`;
      options[label] = {
        value: currentYear,
        label
      };
      return options;
    }, {});

    const monthOptions = MONTHS.reduce((options, currentMonth, i) => {
      const label = `${i}`;
      options[label] = {
        value: i,
        label: currentMonth.long
      };
      return options;
    }, {});

    return (
      <Swipeable onSwipeRight={this.goToNextMonth} onSwipeLeft={this.goToPrevMonth} className={`calendar ${classes.calendar}`}>
        <div className="calendar__year">
          <SelectDropdown
            name="year"
            align={{ inner: 'right' }}
            onChange={this.selectYear}
            selected={year}
            options={yearOptions}
            classes={{
              wrapper: 'calendar__years-dropdown-wrapper',
              dropdown: 'calendar__years-dropdown',
              button: 'calendar__btn--years-dropdown',
              option: 'calendar__radio',
              label: 'calendar__radio-label',
              menu: 'calendar__years-list',
              item: 'calendar__years-item'
            }}
          />
        </div>
        <div className="calendar__month">
          <SelectDropdown
            name="month"
            align={{ inner: 'right' }}
            onChange={this.selectMonth}
            selected={month}
            options={monthOptions}
            classes={{
              wrapper: 'calendar__months-dropdown-wrapper',
              dropdown: 'calendar__months-dropdown',
              button: 'calendar__btn--months-dropdown',
              option: 'calendar__radio',
              label: 'calendar__radio-label',
              menu: 'calendar__months-list',
              item: 'calendar__months-item'
            }}
          />
          <div className="calendar__month--prev-next">
            <IconButton
              className="calendar__btn--month calendar__btn--prev-month"
              size="sm"
              onClick={this.goToPrevMonth}
              icon="chevron-left"
              label="Select previous month"
            />
            <IconButton
              type="button"
              className="calendar__btn--month calendar__btn--next-month"
              size="sm"
              icon="chevron-right"
              onClick={this.goToNextMonth}
              label="Select next month"
            />
          </div>
        </div>
        <div className="calendar__week-days">
          {WEEK_DAYS.map(day => (
            <div key={day.long} className={`calendar__week-day ${classes.weekday}`}>
              {day.narrow}
            </div>
          ))}
        </div>
        <div className="calendar__days">
          {dates.map(date => {
            const isToday =
              date.day === today.day &&
              date.month === today.month &&
              date.year === today.year;
            const isSelectedDate =
              selectedDate &&
              date.day === selectedDate.day &&
              date.month === selectedDate.month &&
              date.year === selectedDate.year;
            return (
              <div
                key={`${date.month}--${date.day}`}
                className={`calendar__day ${
                  date.month !== month ? 'calendar__day--prev-next' : ''
                } ${isToday ? 'is-today' : ''} ${isSelectedDate ? 'is-selected' : ''} ${
                  classes.day
                }`}
              >
                <Button
                  type="button"
                  className="calendar__btn--day"
                  size="sm"
                  onClick={() => onSelectDay(date)}
                >
                  {date.day}
                </Button>
              </div>
            );
          })}
        </div>
      </Swipeable>
    );
  }
}
