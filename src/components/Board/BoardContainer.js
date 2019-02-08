import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withAuthorization } from '../Session';
import { userActions, userSelectors } from '../../ducks/user';
import { boardActions, boardSelectors } from '../../ducks/boards';
import { currentActions, currentSelectors } from '../../ducks/current';
import { listActions, listSelectors } from '../../ducks/lists';
import Board from './Board';
import { ListContainer, ListComposer } from '../List';
import './Board.scss';

class BoardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { boardId } = this.props.current;
    this.props.fetchListsById(boardId);
    this.listener = this.props.firebase.db
      .collection('lists')
      .where('boardId', '==', boardId)
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          const list = {
            [change.doc.id]: change.doc.data()
          };
          this.props.updateListsById(list);
        });
      });
    console.log('mounted');
  }

  componentWillUnmount() {
    this.listener();
  }

  render() {
    const { boardId } = this.props.current;
    const { boardsById, listsArray } = this.props;
    const board = boardsById[boardId];
    const boardTitle = board.title;
    const lists = listsArray.map(list => {
      const { listId, title, cardIds } = list;
      return (
        <ListContainer
          listId={listId}
          key={listId}
          title={title}
          cardIds={cardIds}
        />
      );
    });

    return (
      <main className="board-container">
        <h1>{boardTitle}</h1>
        <Board>
          {lists}
          <ListComposer />
        </Board>
      </main>
    );
  }
}

const condition = authUser => !!authUser;

const mapStateToProps = state => {
  return {
    user: userSelectors.getUserData(state),
    boardsById: boardSelectors.getBoardsById(state),
    current: currentSelectors.getCurrent(state),
    listsById: listSelectors.getListsById(state),
    listsArray: listSelectors.getListsArray(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUserData: userId => dispatch(userActions.getUserData(userId)),
    fetchBoardsById: userId => dispatch(boardActions.fetchBoardsById(userId)),
    updateBoardsById: board => dispatch(boardActions.updateBoardsById(board)),
    selectBoard: boardId => dispatch(currentActions.selectBoard(boardId)),
    fetchListsById: boardId => dispatch(listActions.fetchListsById(boardId)),
    updateListsById: list => dispatch(listActions.updateListsById(list))
  };
};

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BoardContainer)
);
