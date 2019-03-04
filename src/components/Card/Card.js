import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { taskActions, taskSelectors } from '../../ducks/tasks';
import { userActions, userSelectors } from '../../ducks/users';
import { subtaskSelectors } from '../../ducks/subtasks';
import './Card.scss';
import { Tag } from '../Tag';
import { Icon } from '../Icon';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { MONTHS, dateUtils } from '../Calendar';

const CardDetail = ({ icon, children, className = '' }) => (
  <div className={`card__detail ${className}`}>
    <Icon name={icon} />
    {children}
  </div>
);

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

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
      taskIndex,
      taskTags,
      commentIds,
      dueDate,
      subtaskIds,
      completedSubtasks,
      taskMembers
    } = this.props;

    const dueDateStr = dueDate
      ? dateUtils.toDateString(dueDate.toDate(), {
          useRelative: true,
          format: { month: 'short', day: 'numeric' }
        })
      : null;
    const isDueToday = dueDateStr === 'Today';
    const isDueTmrw = dueDateStr === 'Tomorrow';
    const isPastDue = dueDate && dateUtils.isPriorDate(dueDate.toDate());
    return (
      <Draggable draggableId={taskId} index={taskIndex}>
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
                    key={taskTag.text}
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
              {dueDate && (
                <CardDetail
                  icon="calendar"
                  className={`card__due-date ${
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
                </CardDetail>
              )}
              {subtaskIds && subtaskIds.length > 0 && (
                <CardDetail icon="check-square">
                  {completedSubtasks.length}/{subtaskIds.length}
                </CardDetail>
              )}
              {commentIds && commentIds.length > 0 && (
                <CardDetail icon="message-circle">
                  {commentIds.length}
                </CardDetail>
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
                          fullName={name}
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

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Card);
