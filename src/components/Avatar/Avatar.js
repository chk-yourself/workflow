import React, { Component } from 'react';
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
    variant: 'circle'
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
      fullName,
      variant,
      color,
      size
    } = this.props;
    return (
      <div
        className={`avatar avatar--${size} avatar--${variant} ${
          classes.avatar
        }`}
      >
        {imgSrc !== null ? (
          <img
            src={imgSrc}
            alt={fullName}
            className={`avatar__img ${classes.img}`}
            {...imgProps}
          />
        ) : (
          <div
            className={`avatar__placeholder ${classes.placeholder}`}
            style={{ backgroundColor: color }}
          >
            {this.getUserInitials(fullName)}
          </div>
        )}
      </div>
    );
  }
}
