import React, { Component } from 'react';
import * as dateUtils from './utils';
import { MONTHS, WEEK_DAYS } from './constants';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { PopoverWrapper } from '../Popover';
import { Radio } from '../Radio';
import './Calendar.scss';

export default class Calendar extends Component {
  state = {
    isMonthsDropdownActive: false,
    isYearsDropdownActive: false
  };

  goToNextMonth = () => {
    const { month, year, onMonthClick } = this.props;
    onMonthClick(dateUtils.getNextMonth(month, year));
  };

  goToPrevMonth = () => {
    const { month, year, onMonthClick } = this.props;
    onMonthClick(dateUtils.getPrevMonth(month, year));
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
    const dates = dateUtils.getMonthDates(month, year);
    const years = dateUtils.getNextYears(4);

    return (
      <div className={`calendar ${classes.calendar}`}>
        <div className="calendar__year">
          <PopoverWrapper
            isActive={isYearsDropdownActive}
            onButtonClick={this.toggleYearsDropdown}
            onOutsideClick={this.toggleYearsDropdown}
            alignInner="left"
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
              )
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
          </PopoverWrapper>
        </div>
        <div className="calendar__month">
          <PopoverWrapper
            isActive={isMonthsDropdownActive}
            onButtonClick={this.toggleMonthsDropdown}
            onOutsideClick={this.toggleMonthsDropdown}
            alignInner="left"
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
              )
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
          </PopoverWrapper>
          <div className="calendar__month--prev-next">
            <Button
              type="button"
              className="calendar__btn--month calendar__btn--prev-month"
              size="sm"
              iconOnly
              onClick={this.goToPrevMonth}
            >
              <Icon name="chevron-left" />
            </Button>
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
        </div>
        <div className="calendar__week-days">
          {WEEK_DAYS.map(day => (
            <div
              key={day.long}
              className={`calendar__week-day ${classes.weekDay}`}
            >
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
                } ${isToday ? 'is-today' : ''} ${
                  isSelectedDate ? 'is-selected' : ''
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
