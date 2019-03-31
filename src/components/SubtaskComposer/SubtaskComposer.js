import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirebase } from '../Firebase';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Textarea } from '../Textarea';
import { Icon } from '../Icon';
import * as keys from '../../constants/keys';
import { currentUserSelectors } from '../../ducks/currentUser';
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
  }

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
    if (e.type === 'keydown' && e.key !== keys.ENTER) return;
    const { userId, firebase, taskId, projectId } = this.props;
    const { name } = this.state;
    firebase.addSubtask({ userId, name, taskId, projectId });
    this.resetForm();
    e.preventDefault();
  };

  render() {
    const { name, isFocused } = this.state;
    const { currentUser, classes } = this.props;
    return (
      <div className={`subtask-composer ${isFocused ? 'is-active' : ''} ${classes.composer || ''}`}>
      <div className={`subtask-composer__icon-wrapper ${classes.iconWrapper || ''}`}>
        <Icon name="plus-circle" className={`subtask-composer__icon ${classes.icon || ''}`} />
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
                className={classes.button || ''}
              >
                Add subtask
              </Button>
            )}
          </form>
          </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userId: currentUserSelectors.getCurrentUserId(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default withFirebase(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SubtaskComposer)
);
