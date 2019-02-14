import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { withAuthorization } from '../Session';
import { userActions, userSelectors } from '../../ducks/user';
import { cardActions, cardSelectors } from '../../ducks/cards';
import { CardComposer } from '../Card';
import Cards from './Cards';
import './List.scss';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDragging: this.props.isDragging
    };
  }

  handleCardDelete = cardId => {
    const { listId, firebase } = this.props;
    console.log({ cardId, listId });
    firebase.deleteCard({ cardId, listId });
  };

  render() {
    const {
      cards,
      onCardClick,
      listId,
      listTitle,
      listIndex,
      isFetchingCards
    } = this.props;
    if (isFetchingCards) return null;

    return (
      <Draggable draggableId={listId} index={listIndex}>
        {provided => (
          <>
            <section
              className="list"
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <header className="list__header">
                <h2 className="list__title">{listTitle}</h2>
              </header>
              <Cards
                cards={cards}
                listId={listId}
                onCardClick={onCardClick}
                onCardDelete={this.handleCardDelete}
              />
              {provided.placeholder}
              <CardComposer listId={listId} />
            </section>
            {provided.placeholder}
          </>
        )}
      </Draggable>
    );
  }
}

const condition = authUser => !!authUser;

const mapStateToProps = (state, ownProps) => {
  return {
    user: userSelectors.getUserData(state),
    cards: cardSelectors.getCardsArray(state, ownProps)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUserData: userId => dispatch(userActions.getUserData(userId))
  };
};

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(List)
);
