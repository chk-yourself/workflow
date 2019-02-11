import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import { withAuthorization } from '../Session';
import { userActions, userSelectors } from '../../ducks/user';
import { boardActions, boardSelectors } from '../../ducks/boards';
import { currentActions, currentSelectors } from '../../ducks/current';
import { listActions, listSelectors } from '../../ducks/lists';
import { cardActions, cardSelectors } from '../../ducks/cards';
import Board from './Board';
import { List, ListComposer } from '../List';
import * as droppableTypes from '../../constants/droppableTypes';
import './Board.scss';

class BoardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      isDragging: false,
      draggedCard: null
    };
  }

  componentDidMount() {
    const { boardId } = this.props.current;
    this.props.fetchListsById(boardId);
    this.props.fetchCardsById(boardId).then(() => {
      this.setState({
        isFetching: false
      });
    });
    this.listListener = this.props.firebase.db
      .collection('lists')
      .where('boardId', '==', boardId)
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          const list = {
            [change.doc.id]: change.doc.data()
          };
          console.log({ list });
          this.props.updateListsById(list);
        });
      });
    this.cardListener = this.props.firebase.db
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
    this.listListener();
    this.cardListener();
  }

  onDragEnd = ({ destination, draggableId, source, type }) => {
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    if (type === droppableTypes.CARD) {
      const { listsById, firebase } = this.props;
      const isMovedWithinList = source.droppableId === destination.droppableId;
      const updatedCardIds = [...listsById[destination.droppableId].cardIds];
      if (isMovedWithinList) {
        updatedCardIds.splice(source.index, 1);
        updatedCardIds.splice(destination.index, 0, draggableId);
        console.log(updatedCardIds);
        firebase.updateList(source.droppableId, {
          cardIds: updatedCardIds
        });
      } else {
        updatedCardIds.splice(destination.index, 0, draggableId);
        firebase.moveCardToList({
          cardId: draggableId,
          origListId: source.droppableId,
          newListId: destination.droppableId,
          updatedCardIds
        });
      }
    }
  };

  render() {
    const { current, boardsById, listsArray } = this.props;
    const { boardId } = current;
    const board = boardsById[boardId];
    const { boardTitle } = board;

    const lists = listsArray.map(list => {
      const { listId, listTitle, cardIds } = list;
      return (
        <List
          listId={listId}
          key={listId}
          listTitle={listTitle}
          cardIds={cardIds}
          isFetchingCards={this.state.isFetching}
        />
      );
    });

    return (
      <main className="board-container">
        <h1>{boardTitle}</h1>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Board>
            {lists}
            <ListComposer />
          </Board>
        </DragDropContext>
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
    updateListsById: list => dispatch(listActions.updateListsById(list)),
    fetchCardsById: boardId => dispatch(cardActions.fetchCardsById(boardId)),
    updateCardsById: listId => dispatch(cardActions.updateCardsById(listId))
  };
};

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BoardContainer)
);
