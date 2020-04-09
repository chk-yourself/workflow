import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  WEEK_DAYS,
  getNextMonth,
  getPrevMonth,
  getMonthDates,
  getSimpleDate
} from '../../utils/date';
import { Button, IconButton } from '../Button';
import { Swipeable } from '../Swipeable';
import SelectYearDropdown from './SelectYearDropdown';
import SelectMonthDropdown from './SelectMonthDropdown';
import './Calendar.scss';

export default class Calendar extends Component {
  static propTypes = {
    onSelectDate: PropTypes.func,
    selectedDate: PropTypes.oneOfType([() => null, PropTypes.instanceOf(Date)]),
    classes: PropTypes.shape({
      calendar: PropTypes.string,
      weekday: PropTypes.string,
      day: PropTypes.string
    })
  };

  static defaultProps = {
    onSelectDate: () => {},
    selectedDate: null,
    classes: {
      calendar: '',
      weekday: '',
      day: ''
    }
  };

  static getDerivedStateFromProps(props, state) {
    if (props.selectedDate && props.selectedDate !== state.selectedDate) {
      return {
        month: props.selectedDate.getMonth(),
        year: props.selectedDate.getFullYear(),
        selectedDate: props.selectedDate
      };
    }
    return null;
  }

  state = {
    today: getSimpleDate(new Date()),
    month: this.props.selectedDate ? this.props.selectedDate.getMonth() : new Date().getMonth(),
    year: this.props.selectedDate
      ? this.props.selectedDate.getFullYear()
      : new Date().getFullYear(),
    selectedDate: this.props.selectedDate
  };

  goToNextMonth = () => {
    const { month: currentMonth, year: currentYear } = this.state;
    const { month, year } = getNextMonth(currentMonth, currentYear);
    this.selectMonth(month, year);
  };

  goToPrevMonth = () => {
    const { month: currentMonth, year: currentYear } = this.state;
    const { month, year } = getPrevMonth(currentMonth, currentYear);
    this.selectMonth(month, year);
  };

  onChangeMonth = e => {
    const month = +e.target.value;
    this.selectMonth(month);
  };

  selectMonth = (month, year = this.state.year) => {
    this.setState({ month, year });
  };

  onChangeYear = e => {
    const year = +e.target.value;
    this.selectYear(year);
  };

  selectYear = year => {
    this.setState({ year });
  };

  onChangeDay = e => {
    const { day, month, year } = e.target.dataset;
    const { onSelectDate } = this.props;
    const date = new Date(+year, +month, +day);
    this.selectDate(date);
    onSelectDate(date);
  };

  selectDate = selectedDate => {
    this.setState({ selectedDate });
  };

  render() {
    const { classes } = this.props;
    const { month, year, today } = this.state;
    const selectedDate = this.props.selectedDate ? getSimpleDate(this.props.selectedDate) : null;
    const dates = getMonthDates(month, year);

    return (
      <Swipeable onSwipeRight={this.goToNextMonth} onSwipeLeft={this.goToPrevMonth}>
        {(provided, snapshot) => (
          <div
            {...provided.swipeableProps}
            ref={provided.innerRef}
            className={`calendar ${classes.calendar}`}
            style={{
              transform: `translateX(${snapshot.deltaX}px)`
            }}
          >
            <div className="calendar__year">
              <SelectYearDropdown selected={year} onChange={this.onChangeYear} />
            </div>
            <div className="calendar__month">
              <SelectMonthDropdown selected={month} onChange={this.onChangeMonth} />
              <div className="calendar__month--prev-next">
                <IconButton
                  className="calendar__btn--month calendar__btn--prev-month"
                  size="sm"
                  onClick={this.goToPrevMonth}
                  icon="chevron-left"
                  ariaLabel="Select previous month"
                />
                <IconButton
                  type="button"
                  className="calendar__btn--month calendar__btn--next-month"
                  size="sm"
                  icon="chevron-right"
                  onClick={this.goToNextMonth}
                  ariaLabel="Select next month"
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
                  date.day === today.day && date.month === today.month && date.year === today.year;
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
                      data-month={date.month}
                      data-year={date.year}
                      data-day={date.day}
                      onClick={this.onChangeDay}
                    >
                      {date.day}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Swipeable>
    );
  }
}
