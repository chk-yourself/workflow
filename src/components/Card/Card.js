import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { taskSelectors } from '../../ducks/tasks';
import { Tag } from '../Tag';
import { Icon } from '../Icon';
import { Avatar } from '../Avatar';
import { selectTask as selectTaskAction } from '../../ducks/selectedTask';
import { Badge } from '../Badge';
import { TaskDueDate } from '../Task';
import * as keys from '../../constants/keys';
import './Card.scss';

class Card extends Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.tags.indexOf(undefined) !== -1) {
      return false;
    }
    return true;
  }

  onClick = e => {
    if (e.target.matches('button') || e.target.matches('a')) return;
    const { taskId, selectTask } = this.props;
    selectTask(taskId);
  };

  onKeyDown = e => {
    if (e.key !== keys.ENTER) return;
    const { taskId, selectTask } = this.props;
    selectTask(taskId);
  };

  render() {
    const {
      taskId,
      index,
      tags,
      completedSubtasks,
      members,
      task
    } = this.props;
    if (!task) return null;

    const { name, commentIds, dueDate, subtaskIds, isCompleted } = task;
    return (
      <Draggable draggableId={taskId} index={index}>
        {provided => (
          <div
            className="card"
            onClick={this.onClick}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onKeyDown={this.onKeyDown}
            ref={provided.innerRef}
            style={{
              ...provided.draggableProps.style,
              backgroundColor: '#fff'
            }}
          >
            <div className="card__header" ref={el => (this.headerEl = el)}>
              {tags && tags.length > 0 && (
                <div className="card__tags">
                  {tags.map(tag => (
                    <Tag
                      name={tag.name}
                      key={tag.name}
                      size="sm"
                      color={tag.color}
                      variant="pill"
                      className="card__tag"
                    />
                  ))}
                </div>
              )}
              <h3 className="card__title">{name}</h3>
            </div>
            <div className="card__body">
              {isCompleted && (
                <Badge className="card__detail card__completed-status">
                  <span className="card__completed-status-icon">
                    <Icon name="check" />
                  </span>
                </Badge>
              )}
              <TaskDueDate
                className="card__detail"
                icon="calendar"
                dueDate={dueDate}
              />
              {subtaskIds && subtaskIds.length > 0 && (
                <Badge className="card__detail" icon="check-circle">
                  {completedSubtasks.length}/{subtaskIds.length}
                </Badge>
              )}
              {commentIds && commentIds.length > 0 && (
                <Badge className="card__detail" icon="message-circle">
                  {commentIds.length}
                </Badge>
              )}
            </div>
            <div className="card__footer">
              {members && members.length > 0 && (
                <div className="card__members-wrapper">
                  <div className="card__members">
                    {members.map(member => {
                      const { name: memberName, photoURL, userId } = member;
                      return (
                        <Avatar
                          classes={{
                            avatar: 'card__avatar',
                            placeholder: 'card__avatar-placeholder'
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
          </div>
        )}
      </Draggable>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    tags: taskSelectors.getTaskTags(state, ownProps.taskId),
    completedSubtasks: taskSelectors.getCompletedSubtasks(
      state,
      ownProps.taskId
    ),
    members: taskSelectors.getAssignees(state, ownProps.taskId),
    task: taskSelectors.getTask(state, ownProps.taskId)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectTask: taskId => dispatch(selectTaskAction(taskId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Card);
