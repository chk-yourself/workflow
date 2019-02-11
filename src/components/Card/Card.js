import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import './Card.scss';
import { FeatherIcon } from '../FeatherIcon';

export default class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCardEditorOpen: false
    };
  }

  render() {
    const { cardTitle, onClick, cardId, cardIndex } = this.props;
    return (
      <Draggable draggableId={cardId} index={cardIndex}>
        {provided => (
          <div
            className="card"
            onClick={onClick}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <div className="card__header">
              <button className="card__btn--more-actions" type="button">
                <FeatherIcon name="more-horizontal" />
              </button>
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
