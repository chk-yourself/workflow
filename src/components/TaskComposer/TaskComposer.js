import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from '../Icon';
import { withFirebase } from '../Firebase';
import { projectActions, projectSelectors } from '../../ducks/projects';
import { currentActions, currentSelectors } from '../../ducks/current';
import { Input } from '../Input';
import { Button } from '../Button';
import * as keys from '../../constants/keys';
import './TaskComposer.scss';

const INITIAL_STATE = {
  name: '',
  isActive: false
};

class TaskComposer extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  resetForm = () => {
    this.setState({ name: '' });
  };

  onSubmit = e => {
    if (e.type === 'keydown' && e.key !== keys.ENTER) return;
    const { name } = this.state;
    const { projectId } = this.props.current;
    const { listId, firebase } = this.props;
    firebase.addTask({ projectId, listId, name });
    this.resetForm();
    e.preventDefault();
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onFocus = e => {
    this.setState({
      isActive: true
    });
  };

  onReset = e => {
    this.setState({ ...INITIAL_STATE });
  };

  onBlur = e => {
    if (e.target.value !== '') return;
    this.setState({
      isActive: false
    });
  };

  render() {
    const { name, isActive } = this.state;

    return (
      <div
        className={`task-composer${isActive ? ' is-active' : ''}`}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      >
        <form className="task-composer__form" onSubmit={this.onSubmit}>
          <div className="task-composer__icon">
            {isActive ? (
              <div className="task-composer__checkbox" />
            ) : (
              <Icon name="plus-circle" />
            )}
          </div>
          <Input
            onChange={this.onChange}
            value={name}
            placeholder="Add a task"
            isRequired
            name="name"
            className="task-composer__input"
            onKeyDown={this.onSubmit}
            hideLabel
          />
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    projectsArray: projectSelectors.getProjectsArray(state),
    current: currentSelectors.getCurrent(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateProjectsById: project =>
      dispatch(projectActions.updateProjectsById(project))
  };
};

export default withFirebase(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TaskComposer)
);
