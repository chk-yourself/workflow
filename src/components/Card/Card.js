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

  handleMoreActions = e => {
    if (!e.target.matches('a')) return;
    const { action } = e.target.dataset;
    const { cardId, onCardDelete } = this.props;
    switch (action) {
      case 'delete':
        onCardDelete(cardId);
        break;
    }
  };

  render() {
    const { cardTitle, cardId, cardIndex } = this.props;
    return (
      <Draggable draggableId={cardId} index={cardIndex}>
        {provided => (
          <>
            <div
              className="card"
              onClick={this.handleCardClick}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              <div className="card__header">
                <PopoverWrapper
                  wrapperClass="card__popover-wrapper"
                  popoverClass="card__popover"
                  align="left"
                  buttonProps={{
                    size: 'small',
                    iconOnly: true,
                    className: 'card__btn--more-actions',
                    children: <Icon name="more-horizontal" />
                  }}
                >
                  <Menu onClick={this.handleMoreActions}>
                    <MenuItem>
                      <a href="" data-action="delete">
                        Delete
                      </a>
                    </MenuItem>
                  </Menu>
                </PopoverWrapper>
                <div className="card__tags" />
                <h3 className="card__title">{cardTitle}</h3>
              </div>
              <div className="card__footer">
                <div className="card__labels" />
              </div>
            </div>
            {provided.placeholder}
          </>
        )}
      </Draggable>
    );
  }
}
