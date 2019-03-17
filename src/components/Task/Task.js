/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Checkbox } from '../Checkbox';
import { Textarea } from '../Textarea';
import { Tag } from '../Tag';
import { Icon } from '../Icon';
import { withFirebase } from '../Firebase';
import * as keys from '../../constants/keys';
import { taskSelectors } from '../../ducks/tasks';
import { currentUserSelectors } from '../../ducks/currentUser';
import { projectSelectors } from '../../ducks/projects';
import { Badge } from '../Badge';
import { toDateString, isPriorDate } from '../../utils/date';
import { ProjectIcon } from '../ProjectIcon';
import './Task.scss';

class Task extends Component {
  state = {
    isFocused: false,
    name: this.props.name,
    prevPropsName: this.props.name
  };

  static getDerivedStateFromProps(props, state) {
    if (props.name !== state.prevPropsName) {
      return {
        name: props.name,
        prevPropsName: props.name
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
    const { name, firebase, taskId } = this.props;
    const { name: newName } = this.state;
    if (name !== newName) {
      firebase.updateTask(taskId, {
        name: newName
      });
    }
    this.setState({
      isFocused: false
    });
  };

  deleteTask = e => {
    if (e.target.value !== '' || e.key !== keys.BACKSPACE) return;
    const { taskId, firebase, listId, assignedTo, folders } = this.props;
    firebase.deleteTask({ taskId, listId, assignedTo, folders });
  };

  toggleCompleted = () => {
    const { taskId, isCompleted, firebase } = this.props;
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
    const { taskId, onTaskClick } = this.props;
    onTaskClick(taskId);
  };

  onKeyDown = e => {
    const { provided, taskId, onTaskClick } = this.props;
    if (provided && provided.dragHandleProps) {
      provided.dragHandleProps.onKeyDown(e);
    }
    if (e.key === keys.ENTER) {
      onTaskClick(taskId);
    }
  };

  render() {
    const {
      taskId,
      taskTags,
      isCompleted,
      innerRef,
      provided,
      dueDate,
      projectId,
      projectName,
      listName,
      projectColor
    } = this.props;
    const { isFocused, name } = this.state;
    const draggableProps = provided ? provided.draggableProps : {};
    const dragHandleProps = provided ? provided.dragHandleProps : {};
    const dueDateStr = dueDate
      ? toDateString(dueDate.toDate(), {
          useRelative: true,
          format: { month: 'short', day: 'numeric' }
        })
      : null;
    const isDueToday = dueDateStr === 'Today';
    const isDueTmrw = dueDateStr === 'Tomorrow';
    const isPastDue = dueDate && isPriorDate(dueDate.toDate());

    return (
      <li
        className={`task ${isFocused ? 'is-focused' : ''}`}
        onClick={this.handleTaskClick}
        tabIndex={0}
        ref={innerRef}
        {...draggableProps}
        {...dragHandleProps}
        onKeyDown={this.onKeyDown}
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
              {taskTags.map(taskTag => (
                <Tag
                  name={taskTag.name}
                  key={taskTag.name}
                  size="sm"
                  color={taskTag.color}
                  className="task__tag"
                />
              ))}
            </div>
            {dueDate && (
              <Badge
                icon="calendar"
                className={`task__detail task__due-date ${
                  isDueToday
                    ? 'is-due-today'
                    : isDueTmrw
                    ? 'is-due-tmrw'
                    : isPastDue
                    ? 'is-past-due'
                    : ''
                }
                  `}
              >
                {dueDateStr}
              </Badge>
            )}
          </div>
          <Textarea
            value={name}
            onFocus={this.onFocus}
            onChange={this.onChange}
            onBlur={this.onBlur}
            name={taskId}
            className="task__textarea"
            onKeyDown={this.deleteTask}
            minHeight={14}
          />
          <div className="task__badges task__badges--btm">
            {projectId && (
              <Badge className="task__project-details">
                <ProjectIcon
                  color={projectColor}
                  className="task__project-icon"
                />
                <span className="task__project-name">{projectName}</span>
                <Icon name="chevron-right" />
                <span className="task__list-name">{listName}</span>
              </Badge>
            )}
          </div>
        </div>
      </li>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    userId: currentUserSelectors.getCurrentUserId(state),
    taskTags: taskSelectors.getTaskTags(state, ownProps),
    projectColor: projectSelectors.getProjectColor(state, ownProps.projectId)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default withFirebase(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Task)
);
