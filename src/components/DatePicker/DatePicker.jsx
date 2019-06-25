import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toSimpleDateString, toDate, isSDSFormat, isSameDate } from '../../utils/date';
import { Calendar } from '../Calendar';
import { Button } from '../Button';
import { Input } from '../Input';
import { Modal } from '../Modal';
import './DatePicker.scss';

export default class DatePicker extends Component {
  static defaultProps = {
    selectedDate: null
  };

  static propTypes = {
    selectedDate: PropTypes.oneOfType([() => null, PropTypes.instanceOf(Date)])
  };

  state = {
    selectedDate: this.props.selectedDate,
    dateString: this.props.selectedDate ? toSimpleDateString(this.props.selectedDate) : ''
  };

  reset = () => {
    const { selectedDate } = this.props;
    this.setState({
      selectedDate
    });
  };

  selectDate = selectedDate => {
    const dateString = selectedDate ? toSimpleDateString(selectedDate) : '';
    this.setState({ selectedDate, dateString });
  };

  updateDateString = e => {
    const { value } = e.target;
    this.setState({
      dateString: value
    });
    if (isSDSFormat(value)) {
      this.selectDate(toDate(value));
    }
  };

  setDate = () => {
    const { selectedDate: currentDueDate, selectDate } = this.props;
    const { selectedDate } = this.state;
    if (
      !(currentDueDate === null && selectedDate === null) &&
      !isSameDate(currentDueDate, selectedDate)
    ) {
      selectDate(selectedDate);
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
    const { selectedDate, dateString } = this.state;
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
          selectedDate={selectedDate}
          onSelectDate={this.selectDate}
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
