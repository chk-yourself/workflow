import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Droppable } from 'react-beautiful-dnd';
import { withAuthorization } from '../Session';
import { userActions, userSelectors } from '../../ducks/user';
import { boardActions } from '../../ducks/boards';
import { currentActions, currentSelectors } from '../../ducks/current';
import { listActions, listSelectors } from '../../ducks/lists';
import { cardActions, cardSelectors } from '../../ducks/cards';
import { Card, CardComposer } from '../Card';
import './List.scss';
import * as droppableTypes from '../../constants/droppableTypes';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      cardIds,
      cardsById,
      listId,
      listTitle,
      isFetchingCards
    } = this.props;
    if (isFetchingCards) return null;
    const cards = cardIds.map((cardId, cardIndex) => {
      const card = cardsById[cardId];
      const { cardTitle } = card;
      return (
        <Card
          key={cardId}
          cardTitle={cardTitle}
          cardId={cardId}
          cardIndex={cardIndex}
          listId={listId}
        />
      );
    });

    return (
      <Droppable droppableId={listId} type={droppableTypes.CARD}>
        {provided => (
          <section
            className="list"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <header className="list__header">
              <h2 className="list__title">{listTitle}</h2>
            </header>
            {cards}
            {provided.placeholder}
            <CardComposer listId={listId} />
          </section>
        )}
      </Droppable>
    );
  }
}

const condition = authUser => !!authUser;

const mapStateToProps = state => {
  return {
    user: userSelectors.getUserData(state),
    current: currentSelectors.getCurrent(state),
    listsById: listSelectors.getListsById(state),
    listsArray: listSelectors.getListsArray(state),
    cardsById: cardSelectors.getCardsById(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUserData: userId => dispatch(userActions.getUserData(userId)),
    fetchBoardsById: userId => dispatch(boardActions.fetchBoardsById(userId)),
    updateBoardsById: board => dispatch(boardActions.updateBoardsById(board)),
    selectBoard: boardId => dispatch(currentActions.selectBoard(boardId)),
    fetchListsById: boardId => dispatch(listActions.fetchListsById(boardId)),
    updateListsById: list => dispatch(listActions.updateListsById(list)),
    fetchCardsById: boardId => dispatch(cardActions.fetchCardsById(boardId)),
    updateCardsById: listId => dispatch(cardActions.updateCardsById(listId))
  };
};

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(List)
);
