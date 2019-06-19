import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox } from '../Checkbox';
import { Textarea } from '../Textarea';
import { Tag } from '../Tag';
import { withFirebase } from '../Firebase';
import * as keys from '../../constants/keys';
import { taskActions, taskSelectors } from '../../ducks/tasks';
import { selectTask as selectTaskAction } from '../../ducks/selectedTask';
import { getSelectedProjectId } from '../../ducks/selectedProject';
import { ProjectBadge } from '../ProjectBadge';
import { Avatar } from '../Avatar';
import TaskDueDate from './TaskDueDate';
import './Task.scss';

class Task extends Component {
  static defaultProps = {
    className: ''
  };

  static propTypes = {
    className: PropTypes.string,
    taskId: PropTypes.string.isRequired
  };

  state = {
    isFocused: false,
    name: this.props.task ? this.props.task.name : '',
    prevName: this.props.task ? this.props.task.name : '',
    pointX: null,
    pointY: null
  };

  static getDerivedStateFromProps(props, state) {
    if (props.task && props.task.name !== state.prevName) {
      return {
        name: props.task.name,
        prevName: props.task.name
      };
    }
    return null;
  }

  onFocus = () => {
    this.setState({
      isFocused: true
    });
  };

  onChange = e => {
    this.setState({
      name: e.target.value
    });
  };

  onBlur = () => {
    const { firebase, taskId, task } = this.props;
    const { name } = task;
    const { name: newName } = this.state;
    if (name !== newName) {
      firebase.updateDoc(['tasks', taskId], {
        name: newName
      });
    }
    this.setState({
      isFocused: false
    });
  };

  deleteTask = e => {
    if (e.target.value !== '' || e.key !== keys.BACKSPACE) return;
    const { taskId, task, deleteTask } = this.props;
    const { listId } = task;
    deleteTask({ taskId, listId });
  };

  toggleCompleted = () => {
    const { taskId, task, firebase } = this.props;
    const { isCompleted } = task;
    firebase.updateDoc(['tasks', taskId], {
      isCompleted: !isCompleted,
      completedAt: !isCompleted ? firebase.getTimestamp() : null
    });
  };

  handleTaskClick = e => {
    if (
      e.target.matches('button') ||
      e.target.matches('a') ||
      e.target.matches('label') ||
      e.target.matches('input[type="checkbox"]')
    )
      return;
    const { taskId, selectTask } = this.props;
    selectTask(taskId);
  };

  onKeyDown = e => {
    const { provided, taskId, selectTask } = this.props;
    if (provided && provided.dragHandleProps) {
      provided.dragHandleProps.onKeyDown(e);
    }
    if (e.key === keys.ENTER) {
      selectTask(taskId);
    }
  };

  onMouseDown = e => {
    const { provided } = this.props;
    if (provided && provided.dragHandleProps) {
      provided.dragHandleProps.onMouseDown(e);
    }
    if (e.target.matches('input') || e.target.matches('label')) return;
    this.setState({
      pointX: e.pageX,
      pointY: e.pageY
    });
  };

  onMouseUp = e => {
    const { pointX, pointY, isFocused } = this.state;
    if (isFocused) return;
    if (e.pageX === pointX && e.pageY === pointY && window.innerWidth >= 768) {
      this.textarea.focus();
    }
    this.setState({
      pointX: null,
      pointY: null
    });
  };

  setTextareaRef = ref => {
    this.textarea = ref;
  };

  render() {
    const {
      taskId,
      tags,
      innerRef,
      provided,
      selectedProjectId,
      members,
      className,
      task
    } = this.props;
    if (!task) return null;

    const { isCompleted, dueDate, projectId, tagIds } = task;
    const { isFocused, name } = this.state;

    return (
      <li
        className={`task ${className || ''} ${isFocused ? 'is-focused' : ''}`}
        onClick={this.handleTaskClick}
        tabIndex={0}
        ref={innerRef}
        {...provided && provided.draggableProps}
        {...provided && provided.dragHandleProps}
        onKeyDown={this.onKeyDown}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
      >
        <Checkbox
          id={`cb-${taskId}`}
          value={taskId}
          name={taskId}
          isChecked={isCompleted}
          onChange={this.toggleCompleted}
          className="task__checkbox"
          labelClass="task__checkbox-label"
        />
        <div className="task__wrapper">
          <div className="task__badges task__badges--top">
            <div className="task__tags">
              {tags.map(tag => (
                <Tag
                  name={tag.name}
                  key={tag.name}
                  size="sm"
                  color={tag.color}
                  className="task__tag"
                />
              ))}
              {tagIds && tagIds.length > 0 && (
                <Tag
                  name="..."
                  variant="summary"
                  size="sm"
                  color="default"
                  className="task__tag"
                  tooltip={tagIds.join(', ')}
                  isLinkDisabled
                />
              )}
            </div>
            <TaskDueDate className="task__detail" dueDate={dueDate ? dueDate.toDate() : dueDate} />
            {members && members.length > 0 && (
              <div className="task__detail task__members-wrapper">
                <div className="task__members">
                  {members.map(member => {
                    const { name: memberName, photoURL, userId } = member;
                    return (
                      <Avatar
                        classes={{
                          avatar: 'task__avatar',
                          placeholder: 'task__avatar-placeholder'
                        }}
                        name={memberName}
                        size="sm"
                        variant="circle"
                        imgSrc={photoURL}
                        key={userId}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div className="task__textarea-wrapper">
            <Textarea
              innerRef={this.setTextareaRef}
              value={name}
              onFocus={this.onFocus}
              onChange={this.onChange}
              onBlur={this.onBlur}
              name={taskId}
              className="task__textarea"
              onKeyDown={this.deleteTask}
              minHeight={14}
            />
          </div>
          <div className="task__badges task__badges--btm">
            {!selectedProjectId && projectId && <ProjectBadge projectId={projectId} size="sm" />}
          </div>
        </div>
      </li>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    tags: taskSelectors.getTaskTags(state, ownProps.taskId),
    selectedProjectId: getSelectedProjectId(state),
    members: taskSelectors.getAssignees(state, ownProps.taskId),
    task: taskSelectors.getTask(state, ownProps.taskId)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectTask: taskId => dispatch(selectTaskAction(taskId)),
    deleteTask: ({ taskId, listId }) => dispatch(taskActions.deleteTask({ taskId, listId }))
  };
};

export default withFirebase(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Task)
);
