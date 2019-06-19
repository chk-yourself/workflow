import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ConfirmDialog from './ConfirmDialog';

export default class Confirm extends Component {
  static defaultProps = {
    title: 'Are you sure?',
    message: 'This action cannot be undone.',
    label: 'Ok',
    intent: ''
  };

  static propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    label: PropTypes.string,
    intent: PropTypes.string
  };

  state = {
    isActive: false,
    callback: () => null,
    label: this.props.label,
    intent: this.props.intent,
    title: this.props.title,
    message: this.props.message
  };

  /**
   * Activates Confirm Dialog to enforce confirmation before triggering callback
   * @param {string} callback - action to confirm
   * @param {object} options - optional key-value (label, intent, title, message) pairs to pass to ConfirmDialog
   */
  show = (callback, options = {}) => event => {
    event.preventDefault();
    event.persist(); // allows references to the synthetic event to be retained asynchronously
    this.setState({
      isActive: true,
      callback: () => callback(event),
      ...options
    });
  };

  hide = () => {
    const { label, title, message, intent } = this.props;
    this.setState({
      isActive: false,
      callback: () => null,
      label,
      title,
      message,
      intent
    });
  };

  confirm = () => {
    this.state.callback();
    this.hide();
  };

  render() {
    const { children } = this.props;
    const { isActive, title, message, label, intent } = this.state;
    return (
      <>
        {children(this.show)}
        {isActive && (
          <ConfirmDialog
            title={title}
            message={message}
            label={label}
            onClose={this.hide}
            onConfirm={this.confirm}
            intent={intent}
          />
        )}
      </>
    );
  }
}
