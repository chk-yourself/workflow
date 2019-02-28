import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
import * as droppableTypes from '../../constants/droppableTypes';
import { Card } from '../Card';

export default class Cards extends Component {
  static propTypes = {
    listId: PropTypes.string.isRequired
  };

  /*

  shouldComponentUpdate(nextProps) {
    if (this.props.cards === nextProps.cards) {
      return false;
    }
    return true;
  }
*/
  componentDidUpdate(prevProps) {
    if (this.props.cards.length > prevProps.cards.length) {
      this.scrollToBottom();
    }
  }

  scrollToBottom = () => {
    this.listEnd.scrollIntoView({ behavior: 'smooth' });
  };

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
              return (
                <Card
                  key={card.cardId}
                  cardIndex={cardIndex}
                  onCardClick={onCardClick}
                  onCardDelete={onCardDelete}
                  {...card}
                />
              );
            })}
            {provided.placeholder}
            <div
              style={{ float: 'left', clear: 'both' }}
              ref={el => (this.listEnd = el)}
            />
          </div>
        )}
      </Droppable>
    );
  }
}
