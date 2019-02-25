import React, { Component } from 'react';
import * as dateUtils from './utils';
import { MONTHS, WEEK_DAYS } from './constants';
import { Button } from '../Button';
import { Icon } from '../Icon';
import './Calendar.scss';

export default class Calendar extends Component {
  state = {};

  goToNextMonth = () => {
    const { month, year, onMonthClick } = this.props;
    onMonthClick(dateUtils.getNextMonth(month, year));
  };

  goToPrevMonth = () => {
    const { month, year, onMonthClick } = this.props;
    onMonthClick(dateUtils.getPrevMonth(month, year));
  };

  render() {
    const { month, year, selectedDay, today, onDayClick, classes } = this.props;
    console.log(month, year);
    const dates = dateUtils.getMonthDates(month, year);

    return (
      <div className={`calendar ${classes.calendar}`}>
        <div className="calendar__month">
          <Button
            type="button"
            className="calendar__btn--month calendar__btn--prev-month"
            size="sm"
            iconOnly
            onClick={this.goToPrevMonth}
          >
            <Icon name="chevron-left" />
          </Button>
          <h5 className="calendar__heading--month">
            {MONTHS[month].full}
            <span className="calendar__heading--year">{year}</span>
          </h5>
          <Button
            type="button"
            className="calendar__btn--month calendar__btn--next-month"
            size="sm"
            iconOnly
            onClick={this.goToNextMonth}
          >
            <Icon name="chevron-right" />
          </Button>
        </div>
        <div className="calendar__week-days">
          {WEEK_DAYS.map(day => (
            <div
              key={day.full}
              className={`calendar__week-day ${classes.weekDay}`}
            >
              {day.short}
            </div>
          ))}
        </div>
        <div className="calendar__days">
          {dates.map(date => {
            const isToday =
              date.day === today.day &&
              date.month === today.month &&
              date.year === today.year;
            const isSelectedDay =
              selectedDay &&
              date.day === selectedDay.day &&
              date.month === selectedDay.month &&
              date.year === selectedDay.year;
            return (
              <div
                key={`${date.month}--${date.day}`}
                className={`calendar__day ${
                  date.month !== month ? 'calendar__day--prev-next' : ''
                } ${isToday ? 'is-today' : ''} ${
                  isSelectedDay ? 'is-selected' : ''
                } ${classes.day}`}
              >
                <Button
                  type="button"
                  className="calendar__btn--day"
                  size="sm"
                  onClick={() => onDayClick(date)}
                >
                  {date.day}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
