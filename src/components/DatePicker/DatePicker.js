import React, { Component } from 'react';
import { Calendar, dateUtils } from '../Calendar';
import { Button } from '../Button';
import { Input } from '../Input';
import './DatePicker.scss';

export default class DatePicker extends Component {
  state = {
    today: {
      day: new Date().getDate(),
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    },
    selectedDate: this.props.selectedDate,
    currentMonth: this.props.currentMonth,
    currentYear: this.props.currentYear,
    dateString: dateUtils.toSimpleDateString(this.props.selectedDate) || ''
  };

  componentDidMount() {}

  selectDate = date => {
    if (typeof date === 'string') {
      const newDate = dateUtils.toSimpleDateObj(date);
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
        dateString: dateUtils.toSimpleDateString(date)
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
    if (dateUtils.isSDSFormat(value)) {
      this.selectDate(value);
    }
  };

  setDate = () => {
    const { selectedDate: currentDueDate, selectDate, onClose } = this.props;
    const { selectedDate } = this.state;
    if (
      !(currentDueDate === null && selectedDate === null) &&
      !dateUtils.isSameDate(currentDueDate, selectedDate)
    ) {
      const { day, month, year } = selectedDate;
      const date = new Date(year, month, day);
      selectDate(date);
    }
    onClose();
  };

  clearDueDate = () => {
    const { selectedDate, selectDate } = this.props;
    this.selectDate(null);
    if (selectedDate !== null) {
      selectDate(null);
    }
  };

  render() {
    const { onClose } = this.props;
    const {
      today,
      selectedDate,
      currentMonth,
      currentYear,
      dateString
    } = this.state;
    return (
      <div className="date-picker">
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
            weekDay: 'date-picker__week-day'
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
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }
}
