import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Avatar.scss';

export default class Avatar extends Component {
  static defaultProps = {
    imgSrc: null,
    classes: {
      avatar: '',
      img: '',
      placeholder: ''
    },
    size: 'md',
    variant: 'circle',
    name: 'Guest',
    showOnlineStatus: false,
    imgProps: {}
  };

  static propTypes = {
    classes: PropTypes.shape({
      avatar: PropTypes.string,
      img: PropTypes.string,
      placeholder: PropTypes.string
    }),
    name: PropTypes.string,
    showOnlineStatus: PropTypes.bool,
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    variant: PropTypes.oneOf(['circle', 'square', 'rounded']),
    imgProps: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
  };

  getUserInitials = fullName => {
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase();
  };

  render() {
    const {
      imgSrc,
      imgProps,
      classes,
      name,
      variant,
      color,
      size,
      showOnlineStatus,
      isOnline
    } = this.props;
    return (
      <span
        className={`avatar avatar--${size} avatar--${variant} ${
          showOnlineStatus && isOnline ? 'is-online' : ''
        } ${classes.avatar}`}
      >
        {imgSrc !== null ? (
          <img src={imgSrc} alt={name} className={`avatar__img ${classes.img}`} {...imgProps} />
        ) : (
          <span
            className={`avatar__placeholder ${classes.placeholder}`}
            style={{ backgroundColor: color }}
          >
            {this.getUserInitials(name)}
          </span>
        )}
      </span>
    );
  }
}
