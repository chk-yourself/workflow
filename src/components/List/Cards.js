import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
import * as droppableTypes from '../../constants/droppableTypes';
import { Card } from '../Card';

export default class Cards extends Component {
  static propTypes = {
    listId: PropTypes.string.isRequired
  };

  shouldComponentUpdate(nextProps) {
    if (this.props.cards === nextProps.cards) {
      return false;
    }
    return true;
  }

  render() {
    const { listId, cards, style, onCardClick, onCardDelete } = this.props;
    return (
      <Droppable droppableId={listId} type={droppableTypes.CARD}>
        {(provided, snapshot) => (
          <div
            className="list__content"
            ref={provided.innerRef}
            style={{
              ...style,
              minHeight: snapshot.isDraggingOver ? 80 : 16
            }}
            {...provided.droppableProps}
          >
            {cards.map((card, cardIndex) => {
              const { cardId, cardTitle } = card;
              return (
                <Card
                  key={cardId}
                  cardTitle={cardTitle}
                  cardId={cardId}
                  cardIndex={cardIndex}
                  listId={listId}
                  onCardClick={onCardClick}
                  onCardDelete={onCardDelete}
                />
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  }
}