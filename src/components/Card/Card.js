import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { cardActions, cardSelectors } from '../../ducks/cards';
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
    if (nextProps.cardTags.indexOf(undefined) !== -1) {
      return false;
    }
    return true;
  }

  handleCardClick = e => {
    if (e.target.matches('button') || e.target.matches('a')) return;
    const { cardId, onCardClick } = this.props;
    onCardClick(cardId);
  };

  render() {
    const {
      cardTitle,
      cardId,
      cardIndex,
      cardTags,
      commentIds,
      dueDate,
      subtaskIds,
      completedSubtasks,
      cardMembers
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
      <Draggable draggableId={cardId} index={cardIndex}>
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
                {cardTags.map(cardTag => (
                  <Tag
                    key={cardTag.text}
                    size="sm"
                    color={cardTag.color}
                    variant="pill"
                    className="card__tag"
                  />
                ))}
              </div>
              <h3 className="card__title">{cardTitle}</h3>
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
              {cardMembers && cardMembers.length > 0 && (
                <div className="card__members-wrapper">
                  <div className="card__members">
                    {cardMembers.map(member => {
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
    cardTags: cardSelectors.getCardTags(state, ownProps),
    completedSubtasks: subtaskSelectors.getCompletedSubtasks(
      state,
      ownProps.subtaskIds
    ),
    cardMembers: userSelectors.getMembersArray(state, ownProps.assignedTo)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Card);
