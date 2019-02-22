import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import { withFirebase } from '../Firebase';
import { boardActions, boardSelectors } from '../../ducks/boards';
import { currentActions, currentSelectors } from '../../ducks/current';
import { listActions, listSelectors } from '../../ducks/lists';
import { cardActions, cardSelectors } from '../../ducks/cards';
import { taskActions, taskSelectors } from '../../ducks/tasks';
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
      fetchCardTasks,
      firebase,
      updateListsById,
      updateCardsById,
      boardId,
      board,
      updateListIds,
      addTask,
      updateTask,
      deleteTask,
      selectBoard
    } = this.props;

    if (current.boardId !== boardId) {
      selectBoard(boardId);
    }

    fetchListsById(boardId);
    fetchCardsById(boardId);
    fetchCardTasks(boardId).then(() => {
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
    this.taskObserver = firebase.db
      .collection('tasks')
      .where('boardId', '==', boardId)
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          const taskId = change.doc.id;
          const taskData = change.doc.data();
          if (change.type === 'added') {
            addTask({ taskId, taskData });
          }
          if (change.type === 'modified') {
            updateTask({ taskId, taskData });
          }
          if (change.type === 'removed') {
            deleteTask(taskId);
          }
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
    this.taskObserver();
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
    const { current, listsArray, cardsById, boardId, board } = this.props;
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
          isFetchingCards={isFetching}
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
            {...cardsById[cardId]}
            handleCardEditorClose={this.toggleCardEditor}
          />
        )}
      </main>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
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
    fetchCardTasks: boardId => dispatch(taskActions.fetchCardTasks(boardId)),
    updateCardsById: card => dispatch(cardActions.updateCardsById(card)),
    reorderLists: (boardId, listIds) =>
      dispatch(boardActions.reorderLists(boardId, listIds)),
    updateListIds: (boardId, listIds) =>
      dispatch(boardActions.updateListIds(boardId, listIds)),
    addTask: ({ taskId, taskData }) =>
      dispatch(taskActions.addTask({ taskId, taskData })),
    deleteTask: taskId => dispatch(taskActions.deleteTask(taskId)),
    updateTask: ({ taskId, taskData }) =>
      dispatch(taskActions.updateTask({ taskId, taskData }))
  };
};

export default withFirebase(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BoardContainer)
);
