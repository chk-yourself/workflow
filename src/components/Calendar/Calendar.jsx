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
import { Icon } from '../Icon';
import { Popover } from '../Popover';
import { Radio } from '../Radio';
import './Calendar.scss';

export default class Calendar extends Component {
  static defaultProps = {
    onDayClick: () => {},
    classes: {
      calendar: '',
      weekday: '',
      day: ''
    }
  };

  static propTypes = {
    onDayClick: PropTypes.func,
    classes: PropTypes.shape({
      calendar: PropTypes.string,
      weekday: PropTypes.string,
      day: PropTypes.string
    })
  };

  state = {
    isMonthsDropdownActive: false,
    isYearsDropdownActive: false
  };

  goToNextMonth = () => {
    const { month, year, onMonthClick } = this.props;
    onMonthClick(getNextMonth(month, year));
  };

  goToPrevMonth = () => {
    const { month, year, onMonthClick } = this.props;
    onMonthClick(getPrevMonth(month, year));
  };

  toggleMonthsDropdown = () => {
    this.setState(prevState => ({
      isMonthsDropdownActive: !prevState.isMonthsDropdownActive
    }));
  };

  toggleYearsDropdown = () => {
    this.setState(prevState => ({
      isYearsDropdownActive: !prevState.isYearsDropdownActive
    }));
  };

  closeYearsDropdown = () => {
    this.setState({
      isYearsDropdownActive: false
    });
  };

  closeMonthsDropdown = () => {
    this.setState({
      isMonthsDropdownActive: false
    });
  };

  selectMonth = e => {
    const month = +e.target.value;
    const { onMonthClick, year } = this.props;
    onMonthClick({ month, year });
    this.toggleMonthsDropdown();
  };

  selectYear = e => {
    const year = +e.target.value;
    const { onYearClick } = this.props;
    onYearClick(year);
    this.toggleYearsDropdown();
  };

  render() {
    const { month, year, selectedDate, today, onDayClick, classes } = this.props;
    const { isMonthsDropdownActive, isYearsDropdownActive } = this.state;
    const dates = getMonthDates(month, year);
    const years = getNextYears(4);

    return (
      <div className={`calendar ${classes.calendar}`}>
        <div className="calendar__year">
          <Popover
            isActive={isYearsDropdownActive}
            onOutsideClick={this.closeYearsDropdown}
            classes={{
              wrapper: 'calendar__years-dropdown-wrapper',
              popover: 'calendar__years-dropdown'
            }}
            buttonProps={{
              className: `calendar__btn--years-dropdown ${
                isYearsDropdownActive ? 'is-active' : ''
              }`,
              children: (
                <>
                  {year}
                  <Icon name="chevron-down" />
                </>
              ),
              onClick: this.toggleYearsDropdown
            }}
          >
            <ul className="calendar__years-list">
              {years.map(yearOption => (
                <li className="calendar__years-item" key={yearOption}>
                  <Radio
                    name="year"
                    id={yearOption}
                    value={yearOption}
                    isChecked={yearOption === year}
                    label={
                      yearOption === year ? (
                        <>
                          <Icon name="check" />
                          {yearOption}
                        </>
                      ) : (
                        yearOption
                      )
                    }
                    onChange={this.selectYear}
                    classes={{
                      radio: 'calendar__radio',
                      label: 'calendar__radio-label'
                    }}
                  />
                </li>
              ))}
            </ul>
          </Popover>
        </div>
        <div className="calendar__month">
          <Popover
            isActive={isMonthsDropdownActive}
            onOutsideClick={this.closeMonthsDropdown}
            classes={{
              wrapper: 'calendar__months-dropdown-wrapper',
              popover: 'calendar__months-dropdown'
            }}
            buttonProps={{
              className: `calendar__btn--months-dropdown ${
                isMonthsDropdownActive ? 'is-active' : ''
              }`,
              children: (
                <>
                  {MONTHS[month].long}
                  <Icon name="chevron-down" />
                </>
              ),
              onClick: this.toggleMonthsDropdown
            }}
          >
            <ul className="calendar__months-list">
              {MONTHS.map((monthOption, i) => (
                <li className="calendar__months-item" key={monthOption.long}>
                  <Radio
                    name="month"
                    id={monthOption.long}
                    value={i}
                    isChecked={i === month}
                    label={
                      i === month ? (
                        <>
                          <Icon name="check" />
                          {monthOption.long}
                        </>
                      ) : (
                        monthOption.long
                      )
                    }
                    onChange={this.selectMonth}
                    classes={{
                      radio: 'calendar__radio',
                      label: 'calendar__radio-label'
                    }}
                  />
                </li>
              ))}
            </ul>
          </Popover>
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
