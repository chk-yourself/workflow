import React, { Component } from 'react';
import { Calendar } from '../Calendar';
import { Button } from '../Button';
import './DatePicker.scss';

export default class DatePicker extends Component {
  state = {
    today: {
      day: new Date().getDate(),
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    },
    selectedDay: this.props.selectedDay,
    currentMonth: this.props.currentMonth,
    currentYear: this.props.currentYear
  };

  componentDidMount() {}

  selectDay = date => {
    this.setState({
      selectedDay: date
    });
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

  setDate = () => {
    if (!this.state.selectedDay) return;
    const { day, month, year } = this.state.selectedDay;
    const { selectDate } = this.props;
    const date = new Date(year, month, day);
    selectDate(date);
  };

  render() {
    const { onClose } = this.props;
    const { today, selectedDay, currentMonth, currentYear } = this.state;
    return (
      <div className="date-picker">
        <div className="date-picker__header">Due Date</div>
        <Calendar
          classes={{
            calendar: 'date-picker__calendar',
            weekDay: 'date-picker__week-day'
          }}
          month={currentMonth}
          year={currentYear}
          selectedDay={selectedDay}
          today={today}
          onDayClick={this.selectDay}
          onMonthClick={this.setCurrentMonth}
        />
        <div className="date-picker__footer">
          <Button
            size="sm"
            variant="text"
            color="neutral"
            className="date-picker__btn--cancel"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            variant="contained"
            color="primary"
            className="date-picker__btn--set-due-date"
            onClick={this.setDate}
          >
            Set Date
          </Button>
        </div>
      </div>
    );
  }
}
