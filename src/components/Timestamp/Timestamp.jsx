import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toDateString, toTimeString } from '../../utils/date';
import './Timestamp.scss';

export default class Timestamp extends Component {
  static defaultProps = {
    className: '',
    isRelative: true,
    dateOnly: false,
    absoluteMin: [6, 'h'],
    timeOptions: {
      format: 'h:mm',
      hour12: true
    },
    dateOptions: {
      useRelative: true,
      format: {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: '2-digit'
      }
    }
  };

  static propTypes = {
    className: PropTypes.string,
    isRelative: PropTypes.bool,
    dateOnly: PropTypes.bool,
    absoluteMin: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
    timeOptions: PropTypes.shape({
      format: PropTypes.string,
      hour12: PropTypes.bool
    }),
    dateOptions: PropTypes.shape({
      useRelative: PropTypes.bool,
      format: PropTypes.shape({
        weekday: PropTypes.oneOf(['long', 'short', 'narrow']),
        month: PropTypes.oneOf(['long', 'short', 'narrow']),
        day: PropTypes.oneOf(['numeric', '2-digit']),
        year: PropTypes.oneOf(['numeric', '2-digit'])
      })
    })
  };

  state = {
    secondsElapsed: 0
  };

  componentDidMount() {
    const { date, isRelative } = this.props;
    if (!date) return;
    const secondsElapsed = Math.floor(Date.now() / 1000) - Math.floor(date.getTime() / 1000);
    this.setState({
      secondsElapsed
    });
    this.absoluteMin = this.getAbsoluteMinSeconds();
    if (secondsElapsed < this.absoluteMin || !isRelative) {
      this.interval = setInterval(this.tick, 1000);
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  tick = () => {
    const { secondsElapsed } = this.state;
    if (secondsElapsed > this.absoluteMin) {
      clearInterval(this.interval);
    } else {
      this.setState(prevState => ({
        secondsElapsed: prevState.secondsElapsed + 1
      }));
    }
  };

  // Returns min seconds required for switch to absolute timestamp
  getAbsoluteMinSeconds = () => {
    const { absoluteMin } = this.props;
    const [n, unit] = absoluteMin;
    switch (unit) {
      case 'm': {
        return n * 60;
      }
      case 'h': {
        return n * 60 * 60;
      }
      case 'd': {
        return n * 60 * 60 * 24;
      }
      default: {
        return n;
      }
    }
  };

  getDateString = () => {
    const { secondsElapsed } = this.state;
    const { date, isRelative, dateOnly, timeOptions, dateOptions } = this.props;
    const dateString = toDateString(date, dateOptions);
    const absoluteDateString = dateOnly
      ? dateString
      : `${dateString} at ${toTimeString(date, timeOptions)}`;
    if (!isRelative) return absoluteDateString;
    return secondsElapsed < 60 // less than one minute
      ? 'Just now'
      : secondsElapsed < 120 // less than 2 minutes
      ? '1 minute ago'
      : secondsElapsed < 3600 // less than 1 hour
      ? `${Math.floor(secondsElapsed / 60)} minutes ago`
      : secondsElapsed < 7200 // less than 2 hours
      ? '1 hour ago'
      : secondsElapsed < this.absoluteMin // default = 6 hours
      ? `${Math.floor(secondsElapsed / 3600)} hours ago`
      : absoluteDateString;
  };

  render() {
    const { date, className } = this.props;
    if (!date) return null;
    return <span className={`timestamp ${className}`}>{this.getDateString()}</span>;
  }
}
