import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { taskSelectors } from '../../ducks/tasks';
import { userSelectors } from '../../ducks/users';
import { subtaskSelectors } from '../../ducks/subtasks';
import './Card.scss';
import { Tag } from '../Tag';
import { Icon } from '../Icon';
import { Avatar } from '../Avatar';
import { toDateString, isPriorDate } from '../../utils/date';
import { Badge } from '../Badge';

class Card extends Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.taskTags.indexOf(undefined) !== -1) {
      return false;
    }
    return true;
  }

  handleCardClick = e => {
    if (e.target.matches('button') || e.target.matches('a')) return;
    const { taskId, onCardClick } = this.props;
    onCardClick(taskId);
  };

  render() {
    const {
      name,
      taskId,
      index,
      taskTags,
      commentIds,
      dueDate,
      subtaskIds,
      completedSubtasks,
      taskMembers,
      isCompleted
    } = this.props;

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
      <Draggable draggableId={taskId} index={index}>
        {provided => (
          <div
            className="card"
            onClick={this.handleCardClick}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            style={{
              ...provided.draggableProps.style,
              backgroundColor: '#fff'
            }}
          >
            <div className="card__header" ref={el => (this.headerEl = el)}>
              <div className="card__tags">
                {taskTags.map(taskTag => (
                  <Tag
                    key={taskTag.name}
                    size="sm"
                    color={taskTag.color}
                    variant="pill"
                    className="card__tag"
                  />
                ))}
              </div>
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
              {dueDate && (
                <Badge
                  icon="calendar"
                  className={`card__detail card__due-date ${
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
              {taskMembers && taskMembers.length > 0 && (
                <div className="card__members-wrapper">
                  <div className="card__members">
                    {taskMembers.map(member => {
                      const { name, photoURL, userId } = member;
                      return (
                        <Avatar
                          classes={{
                            avatar: 'card__avatar',
                            placeholder: 'card__avatar-placeholder'
                          }}
                          name={name}
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
    taskTags: taskSelectors.getTaskTags(state, ownProps),
    completedSubtasks: subtaskSelectors.getCompletedSubtasks(
      state,
      ownProps.subtaskIds
    ),
    taskMembers: userSelectors.getMembersArray(state, ownProps.assignedTo)
  };
};

export default connect(mapStateToProps)(Card);
