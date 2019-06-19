import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  toSimpleDateString,
  toSimpleDateObj,
  getSimpleDate,
  isSDSFormat,
  isSameDate
} from '../../utils/date';
import { Calendar } from '../Calendar';
import { Button } from '../Button';
import { Input } from '../Input';
import './DatePicker.scss';

export default class DatePicker extends Component {
  static defaultProps = {
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    selectedDate: null
  };

  static propTypes = {
    selectedDate: PropTypes.oneOfType([() => null, PropTypes.instanceOf(Date)]),
    currentMonth: PropTypes.number,
    currentYear: PropTypes.number
  };

  state = {
    today: {
      day: new Date().getDate(),
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    },
    selectedDate: this.props.selectedDate
      ? getSimpleDate(this.props.selectedDate)
      : null,
    currentMonth:
      this.props.currentMonth ||
      (this.props.selectedDate
        ? this.props.selectedDate.getMonth()
        : new Date().getMonth()),
    currentYear:
      this.props.currentYear ||
      (this.props.selectedDate
        ? this.props.selectedDate.getFullYear()
        : new Date().getFullYear()),
    dateString: toSimpleDateString(this.props.selectedDate) || ''
  };

  resetCalendar = () => {
    const { currentMonth, currentYear, selectedDate } = this.props;
    this.setState({
      selectedDate,
      currentMonth:
        currentMonth ||
        (selectedDate ? selectedDate.getMonth() : new Date().getMonth()),
      currentYear:
        currentYear ||
        (selectedDate ? selectedDate.getFullYear() : new Date().getFullYear())
    });
  };

  selectDate = date => {
    if (typeof date === 'string') {
      const newDate = toSimpleDateObj(date);
      const { month, year } = newDate;
      const { currentMonth, currentYear } = this.state;
      this.setState({
        selectedDate: newDate
      });
      if (month !== currentMonth || year !== currentYear) {
        this.setCurrentMonth({ month, year });
      }
    } else {
      this.setState({
        selectedDate: date,
        dateString: toSimpleDateString(date)
      });
    }
  };

  setCurrentMonth = ({ month, year }) => {
    this.setState({
      currentMonth: month,
      currentYear: year
    });
  };

  setCurrentYear = year => {
    this.setState({
      currentYear: year
    });
  };

  updateDateString = e => {
    const { value } = e.target;
    this.setState({
      dateString: value
    });
    if (isSDSFormat(value)) {
      this.selectDate(value);
    }
  };

  setDate = () => {
    const { selectedDate: currentDueDate, selectDate } = this.props;
    const { selectedDate } = this.state;
    if (
      !(currentDueDate === null && selectedDate === null) &&
      !isSameDate(currentDueDate, selectedDate)
    ) {
      const { day, month, year } = selectedDate;
      const date = new Date(year, month, day);
      selectDate(date);
    }
    this.closeDatePicker();
  };

  clearDueDate = () => {
    const { selectedDate, selectDate } = this.props;
    this.selectDate(null);
    if (selectedDate !== null) {
      selectDate(null);
    }
    this.closeDatePicker();
  };

  closeDatePicker = () => {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
  };

  cancel = () => {
    this.closeDatePicker();
    this.resetCalendar();
  };

  render() {
    const { isActive, innerRef } = this.props;
    const {
      today,
      selectedDate,
      currentMonth,
      currentYear,
      dateString
    } = this.state;
    return (
      <div
        className="date-picker"
        ref={innerRef}
        style={{ display: !isActive ? 'none' : 'block' }}
      >
        <div className="date-picker__header">
          <div className="date-picker__due-date-wrapper">
            <Input
              name="dueDate"
              type="text"
              label="Due Date"
              value={dateString}
              onChange={this.updateDateString}
              className="date-picker__input--due-date"
              labelClass="date-picker__label--due-date"
              placeholder="mm-dd-yy"
              maxLength={8}
            />
          </div>
        </div>
        <Calendar
          classes={{
            calendar: 'date-picker__calendar',
            weekday: 'date-picker__week-day'
          }}
          month={currentMonth}
          year={currentYear}
          selectedDate={selectedDate}
          today={today}
          onDayClick={this.selectDate}
          onMonthClick={this.setCurrentMonth}
          onYearClick={this.setCurrentYear}
        />
        <div className="date-picker__footer">
          <Button
            size="sm"
            variant="text"
            color="neutral"
            className="date-picker__btn--clear"
            onClick={this.clearDueDate}
          >
            Clear
          </Button>
          <Button
            size="sm"
            variant="contained"
            color="primary"
            className="date-picker__btn--set-due-date"
            onClick={this.setDate}
          >
            Done
          </Button>
          <Button
            size="sm"
            variant="text"
            color="neutral"
            className="date-picker__btn--cancel"
            onClick={this.cancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }
}
