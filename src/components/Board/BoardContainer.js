import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import { withAuthorization } from '../Session';
import { userActions, userSelectors } from '../../ducks/user';
import { boardActions, boardSelectors } from '../../ducks/boards';
import { currentActions, currentSelectors } from '../../ducks/current';
import { listActions, listSelectors } from '../../ducks/lists';
import { cardActions, cardSelectors } from '../../ducks/cards';
import * as ROUTES from '../../constants/routes';
import Board from './Board';
import { Input } from '../Input';
import { List } from '../List';
import { CardEditor } from '../CardEditor';
import * as droppableTypes from '../../constants/droppableTypes';
import { utils } from '../../utils';
import './Board.scss';

class BoardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      isDragging: false,
      isCardEditorOpen: false,
      boardTitle: this.props.boardTitle
    };
  }

  componentDidMount() {
    const {
      current,
      fetchListsById,
      fetchCardsById,
      firebase,
      updateBoardsById,
      updateListsById,
      updateCardsById,
      boardId,
      board,
      updateListIds
    } = this.props;

    if (current.boardId !== boardId) {
      this.props.selectBoard(boardId);
    }

    fetchListsById(boardId);
    fetchCardsById(boardId).then(() => {
      this.setState({
        isFetching: false
      });
    });
    this.boardObserver = firebase.getBoardDoc(boardId).onSnapshot(snapshot => {
      const updatedBoard = snapshot.data();
      if (!utils.isEqual(updatedBoard.listIds, board.listIds)) {
        updateListIds(boardId, updatedBoard.listIds);
      }
    });
    this.listObserver = firebase.db
      .collection('lists')
      .where('boardId', '==', boardId)
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          const list = {
            [change.doc.id]: change.doc.data()
          };
          updateListsById(list);
        });
      });
    this.cardObserver = firebase.db
      .collection('cards')
      .where('boardId', '==', boardId)
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          const card = {
            [change.doc.id]: {
              cardId: change.doc.id,
              ...change.doc.data()
            }
          };
          updateCardsById(card);
        });
      });
    console.log('mounted');
  }

  componentWillUnmount() {
    this.boardObserver();
    this.listObserver();
    this.cardObserver();
  }

  onDragStart = () => {
    this.setState({
      isDragging: true
    });
  };

  onDragEnd = ({ destination, draggableId, source, type }) => {
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    const { firebase } = this.props;
    if (type === droppableTypes.CARD) {
      const { listsById } = this.props;
      const isMovedWithinList = source.droppableId === destination.droppableId;
      const updatedCardIds = [...listsById[destination.droppableId].cardIds];
      if (isMovedWithinList) {
        updatedCardIds.splice(source.index, 1);
        updatedCardIds.splice(destination.index, 0, draggableId);
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

    if (type === droppableTypes.LIST) {
      const { boardsById, current, reorderLists } = this.props;
      const { boardId } = current;
      const updatedListIds = [...boardsById[boardId].listIds];
      updatedListIds.splice(source.index, 1);
      updatedListIds.splice(destination.index, 0, draggableId);
      firebase.updateBoard(boardId, {
        listIds: updatedListIds
      });
      reorderLists(boardId, updatedListIds);
    }

    this.setState({
      isDragging: false
    });
  };

  toggleCardEditor = () => {
    this.setState(prevState => ({
      isCardEditorOpen: !prevState.isCardEditorOpen
    }));
  };

  handleCardClick = cardId => {
    this.props.selectCard(cardId);
    this.toggleCardEditor();
  };

  onTitleChange = e => {
    this.setState({
      boardTitle: e.target.value
    });
  };

  onTitleBlur = e => {
    const { boardTitle, boardId, firebase } = this.props;
    const { boardTitle: newBoardTitle } = this.state;

    // When field loses focus, update list title if change is detected

    if (newBoardTitle !== boardTitle) {
      firebase.updateBoard(boardId, {
        boardTitle: newBoardTitle
      });
      console.log('updated!');
    }
  };

  render() {
    const { isFetching, isCardEditorOpen } = this.state;
    const {
      current,
      boardsById,
      listsArray,
      cardsById,
      boardId,
      board
    } = this.props;
    if (isFetching) return null;
    const { cardId } = current;
    const { boardTitle } = board;
    const lists = listsArray.map((list, listIndex) => {
      const { listId, listTitle, cardIds } = list;
      return (
        <List
          listId={listId}
          key={listId}
          listIndex={listIndex}
          listTitle={listTitle}
          cardIds={cardIds}
          isFetchingCards={this.state.isFetching}
          isDragging={this.state.isDragging}
          onCardClick={this.handleCardClick}
          boardId={boardId}
        />
      );
    });

    return (
      <main className="board-container">
        <Input
          className="board__input--title"
          name="boardTitle"
          type="text"
          value={boardTitle}
          onChange={this.onTitleChange}
          required
          hideLabel
          onBlur={this.onTitleBlur}
        />
        <DragDropContext
          onDragEnd={this.onDragEnd}
          onDragStart={this.onDragStart}
        >
          <Board boardId={boardId}>{lists}</Board>
        </DragDropContext>
        {isCardEditorOpen && (
          <CardEditor
            card={cardsById[cardId]}
            onCardEditorClose={this.toggleCardEditor}
          />
        )}
      </main>
    );
  }
}

const condition = authUser => !!authUser;

const mapStateToProps = (state, ownProps) => {
  return {
    user: userSelectors.getUserData(state),
    boardsById: boardSelectors.getBoardsById(state),
    current: currentSelectors.getCurrent(state),
    listsById: listSelectors.getListsById(state),
    listsArray: listSelectors.getListsArray(state),
    cardsById: cardSelectors.getCardsById(state),
    board: boardSelectors.getBoard(state, ownProps.boardId)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateBoardsById: board => dispatch(boardActions.updateBoardsById(board)),
    selectBoard: boardId => dispatch(currentActions.selectBoard(boardId)),
    selectCard: cardId => dispatch(currentActions.selectCard(cardId)),
    fetchListsById: boardId => dispatch(listActions.fetchListsById(boardId)),
    updateListsById: list => dispatch(listActions.updateListsById(list)),
    fetchCardsById: boardId => dispatch(cardActions.fetchCardsById(boardId)),
    updateCardsById: card => dispatch(cardActions.updateCardsById(card)),
    reorderLists: (boardId, listIds) =>
      dispatch(boardActions.reorderLists(boardId, listIds)),
    updateListIds: (boardId, listIds) =>
      dispatch(boardActions.updateListIds(boardId, listIds))
  };
};

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BoardContainer)
);
