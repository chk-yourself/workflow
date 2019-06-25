import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Calendar } from '../Calendar';

export default class ProjectCalendar extends Component {
  state = {
    month: new Date().getMonth(),
    year: new Date().getFullYear()
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

  render() {
    const { month, year } = this.state;
    return <Calendar month={month} year={year} />;
  }
}
