import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import './Card.scss';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { PopoverWrapper } from '../Popover';
import { Menu, MenuItem } from '../Menu';

export default class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCardClick = e => {
    if (e.target.matches('button') || e.target.matches('a')) return;
    const { cardId, onCardClick } = this.props;
    onCardClick(cardId);
  };

  render() {
    const { cardTitle, cardId, cardIndex } = this.props;
    return (
      <Draggable draggableId={cardId} index={cardIndex}>
        {provided => (
            <div
              className="card"
              onClick={this.handleCardClick}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              <div className="card__header" ref={el => (this.headerEl = el)}>
                <div className="card__tags" />
                <h3 className="card__title">{cardTitle}</h3>
              </div>
              <div className="card__footer">
                <div className="card__labels" />
              </div>
            </div>
        )}
      </Draggable>
    );
  }
}
