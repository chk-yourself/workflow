import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withAuthorization } from '../Session';
import { userActions, userSelectors } from '../../ducks/user';
import { boardActions } from '../../ducks/boards';
import { currentActions, currentSelectors } from '../../ducks/current';
import { listActions, listSelectors } from '../../ducks/lists';
import { cardActions, cardSelectors } from '../../ducks/cards';
import List from './List';
import { Card, CardComposer } from '../Card';

class ListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true
    };
  }

  componentDidMount() {
    const { boardId, listId, cardId } = this.props.current;
    this.props.fetchCardsById(boardId).then(() => {
      this.setState({ isFetching: false });
    });
    this.listener = this.props.firebase.db
      .collection('cards')
      .where('boardId', '==', boardId)
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          const card = {
            [change.doc.id]: change.doc.data()
          };
          this.props.updateCardsById(card);
        });
      });
    console.log('mounted');
  }

  componentWillUnmount() {
    this.listener();
  }

  render() {
    if (this.state.isFetching) return null;
    const { cardIds, cardsById, listId, title } = this.props;
    const cards = cardIds.map(cardId => {
      const card = cardsById[cardId];
      const cardTitle = card.title;
      return <Card key={cardId} title={cardTitle} />;
    });

    return (
      <List title={title}>
        {cards}
        <CardComposer listId={listId} />
      </List>
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
  )(ListContainer)
);
