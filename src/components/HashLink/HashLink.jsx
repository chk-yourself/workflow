import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class HashLink extends Component {
  static defaultProps = {
    scrollOptions: {
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    },
    to: ''
  };

  onClick = e => {
    const { to, onClick, scrollOptions } = this.props;
    const id = to.split('#')[1];
    if (id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView(scrollOptions);
      }
    }
    if (onClick) {
      onClick(e);
    }
  };

  render() {
    const { children, to, scrollOptions, onClick, ...props } = this.props;
    return (
      <Link to={to} onClick={this.onClick} {...props}>
        {children}
      </Link>
    );
  }
}
