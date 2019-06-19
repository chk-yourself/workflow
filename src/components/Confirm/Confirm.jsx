import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ConfirmDialog from './ConfirmDialog';

export default class Confirm extends Component {
  static defaultProps = {
    title: 'Are you sure?',
    message: 'This action cannot be undone.'
  };

  static propTypes = {
    title: PropTypes.string,
    message: PropTypes.string
  };

  state = {
    isActive: false,
    callback: () => null,
    actionName: 'Ok',
    intent: ''
  };

  show = (callback, actionName = 'Ok', intent = '') => event => {
    event.preventDefault();
    event.persist(); // allows references to the synthetic event to be retained asynchronously
    this.setState({
      isActive: true,
      callback: () => callback(event),
      actionName,
      intent
    });
  };

  hide = () => {
    this.setState({
      isActive: false,
      callback: () => null
    });
  };

  confirm = () => {
    this.state.callback();
    this.hide();
  };

  render() {
    const { children, title, message } = this.props;
    const { isActive, actionName, intent } = this.state;
    return (
      <>
        {children(this.show)}
        {isActive && (
          <ConfirmDialog
            title={title}
            message={message}
            action={actionName}
            onClose={this.hide}
            onConfirm={this.confirm}
            intent={intent}
          />
        )}
      </>
    );
  }
}
