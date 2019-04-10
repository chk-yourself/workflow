import React, { Component } from 'react';
import './Avatar.scss';
import { fromJSON } from 'tough-cookie';

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
    name: 'Guest'
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
      size
    } = this.props;
    return (
      <span
        className={`avatar avatar--${size} avatar--${variant} ${
          classes.avatar
        }`}
      >
        {imgSrc !== null ? (
          <img
            src={imgSrc}
            alt={name}
            className={`avatar__img ${classes.img}`}
            {...imgProps}
          />
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
