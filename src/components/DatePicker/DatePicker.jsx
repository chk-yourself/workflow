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
import { Modal } from '../Modal';
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
    selectedDate: this.props.selectedDate ? getSimpleDate(this.props.selectedDate) : null,
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

  reset = () => {
    const { currentMonth, currentYear, selectedDate } = this.props;
    this.setState({
      selectedDate: selectedDate ? getSimpleDate(selectedDate) : null,
      currentMonth:
        currentMonth || (selectedDate ? selectedDate.getMonth() : new Date().getMonth()),
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
    this.reset();
  };

  render() {
    const { onClose } = this.props;
    const { selectedDate, currentMonth, currentYear, dateString } = this.state;
    return (
      <Modal
        classes={{ modal: 'date-picker-wrapper', content: 'date-picker' }}
        onClose={onClose}
        size="sm"
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
          onSelectDay={this.selectDate}
          onSelectMonth={this.setCurrentMonth}
          onSelectYear={this.setCurrentYear}
        />
        <div className="date-picker__footer">
          <Button
            size="sm"
            variant="text"
            color="neutral"
            className="date-picker__btn date-picker__btn--clear"
            onClick={this.clearDueDate}
          >
            Clear
          </Button>
          <Button
            size="sm"
            variant="contained"
            color="primary"
            className="date-picker__btn date-picker__btn--set-due-date"
            onClick={this.setDate}
          >
            Done
          </Button>
          <Button
            size="sm"
            variant="text"
            color="neutral"
            className="date-picker__btn date-picker__btn--cancel"
            onClick={this.cancel}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    );
  }
}
