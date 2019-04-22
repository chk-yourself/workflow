import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
  static defaultProps = {
    fallback: null,
    message: 'Something went wrong.'
  };

  state = {
    hasError: false
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    const { hasError } = this.state;
    const { children, fallback, message } = this.props;
    if (hasError) {
      return fallback || <h1>{message}</h1>;
    }
    return children;
  }
}
