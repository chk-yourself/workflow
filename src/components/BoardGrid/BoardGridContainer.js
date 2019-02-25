import React, { Component } from 'react';
import { connect } from 'react-redux';
import BoardGrid from './BoardGrid';
import BoardTile from './BoardTile';
import './BoardGrid.scss';
import { withAuthorization } from '../Session';
import { boardActions, boardSelectors } from '../../ducks/boards';
import { currentActions, currentSelectors } from '../../ducks/current';
import { Icon } from '../Icon';
import { userSelectors } from '../../ducks/users';

class BoardGridContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { userId, firebase, updateBoard } = this.props;
    this.boardObserver = firebase.db
      .collection('boards')
      .where('memberIds', 'array-contains', userId)
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          const boardId = change.doc.id;
          const boardData = change.doc.data();
          updateBoard(boardId, boardData);
        });
      });
  }

  componentWillUnmount() {
    this.boardObserver();
  }

  render() {
    const { boardsArray, selectBoard } = this.props;
    const boardTiles = boardsArray.map(board => {
      const { boardTitle, boardId } = board;
      return (
        <BoardTile
          key={boardId}
          boardTitle={boardTitle}
          boardId={boardId}
          onClick={() => selectBoard(boardId)}
        />
      );
    });
    return (
      <section>
        <BoardGrid>
          {boardTiles}
          <button
            type="button"
            className="board-grid__tile board-grid__btn--add"
            onClick={this.props.openBoardComposer}
          >
            <Icon name="plus-circle" />
            Create board
          </button>
        </BoardGrid>
      </section>
    );
  }
}

const condition = authUser => !!authUser;

const mapStateToProps = (state, ownProps) => {
  return {
    userId: currentSelectors.getCurrentUserId(state),
    user: userSelectors.getUserData(state, ownProps.userId),
    boardsById: boardSelectors.getBoardsById(state),
    boardsArray: boardSelectors.getBoardsArray(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchBoardsById: userId => dispatch(boardActions.fetchBoardsById(userId)),
    updateBoard: (boardId, boardData) => dispatch(boardActions.updateBoard(boardId, boardData)),
    selectBoard: boardId => dispatch(currentActions.selectBoard(boardId))
  };
};

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BoardGridContainer)
);
