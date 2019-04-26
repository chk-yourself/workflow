import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import { Button } from '../Button';
import { Textarea } from '../Textarea';
import { Icon } from '../Icon';
import * as keys from '../../constants/keys';
import './SubtaskComposer.scss';

class SubtaskComposer extends Component {
  static defaultProps = {
    classes: {
      composer: '',
      icon: '',
      iconWrapper: '',
      form: '',
      textarea: '',
      button: ''
    }
  };

  state = {
    name: '',
    isFocused: false
  };

  resetForm = () => {
    this.setState({ name: '' });
  };

  onChange = e => {
    this.setState({
      name: e.target.value
    });
  };

  onFocus = e => {
    this.setState({
      isFocused: true
    });
  };

  onBlur = e => {
    if (e.target.value !== '') return;
    this.setState({
      isFocused: false
    });
  };

  addSubtask = e => {
    const { name } = this.state;
    if ((e.type === 'keydown' && e.key !== keys.ENTER) || !name) return;
    const {
      currentUser,
      firebase,
      taskId,
      projectId,
      activeWorkspace
    } = this.props;
    const { workspaceId } = activeWorkspace;
    const { userId } = currentUser;
    firebase.createSubtask({ userId, name, taskId, projectId, workspaceId });
    this.resetForm();
    e.preventDefault();
  };

  render() {
    const { name, isFocused } = this.state;
    const { classes } = this.props;
    return (
      <div
        className={`subtask-composer ${
          isFocused ? 'is-active' : ''
        } ${classes.composer || ''}`}
      >
        <div
          className={`subtask-composer__icon-wrapper ${classes.iconWrapper ||
            ''}`}
        >
          <Icon
            name="plus-circle"
            className={`subtask-composer__icon ${classes.icon || ''}`}
          />
        </div>
        <form
          name="newSubtaskForm"
          className={`subtask-composer__form ${classes.form || ''} ${
            isFocused ? 'is-focused' : ''
          }`}
        >
          <Textarea
            className={`subtask-composer__textarea ${classes.textarea || ''}`}
            name="subtask"
            value={name}
            onChange={this.onChange}
            placeholder="Add a subtask"
            onFocus={this.onFocus}
            onKeyDown={this.addSubtask}
            onBlur={this.onBlur}
          />
          {isFocused && (
            <Button
              type="submit"
              color="primary"
              size="small"
              variant="contained"
              disabled={name === ''}
              onClick={this.addSubtask}
              className={`subtask-composer__btn--add ${classes.button || ''}`}
            >
              Add subtask
            </Button>
          )}
        </form>
      </div>
    );
  }
}

const condition = (currentUser, activeWorkspace) =>
  !!currentUser && !!activeWorkspace;

export default withAuthorization(condition)(SubtaskComposer);
