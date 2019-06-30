import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './Avatar.scss';

export default class Avatar extends PureComponent {
  static defaultProps = {
    src: null,
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
    src: PropTypes.string,
    classes: PropTypes.shape({
      avatar: PropTypes.string,
      img: PropTypes.string,
      placeholder: PropTypes.string
    }),
    name: PropTypes.string,
    showOnlineStatus: PropTypes.bool,
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    variant: PropTypes.oneOf(['circle', 'square', 'rounded']),
    imgProps: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    )
  };

  getInitials = fullName => {
    const { getInitials } = this.props;
    if (getInitials) {
      return getInitials(fullName);
    }
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase();
  };

  render() {
    const {
      src,
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
        {src !== null ? (
          <img
            src={src}
            alt={name}
            className={`avatar__img ${classes.img}`}
            {...imgProps}
          />
        ) : (
          <span
            className={`avatar__placeholder ${classes.placeholder}`}
            style={{ backgroundColor: color }}
          >
            {this.getInitials(name)}
          </span>
        )}
      </span>
    );
  }
}
