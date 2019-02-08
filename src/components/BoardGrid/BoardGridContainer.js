import React, { Component } from 'react';
import BoardGrid from './BoardGrid';
import BoardTile from './BoardTile';
import { connect } from 'react-redux';
import { withAuthorization } from '../Session';
import { userActions, userSelectors } from '../../ducks/user';
import { boardActions, boardSelectors } from '../../ducks/boards';
import { currentActions, currentSelectors } from '../../ducks/current';

class BoardGridContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { userId } = this.props.user;
    this.props.fetchBoardsById(userId);
    this.listener = this.props.firebase.db
      .collection('boards')
      .where('memberIds', 'array-contains', userId)
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          const board = {
            [change.doc.id]: change.doc.data()
          };
          this.props.updateBoardsById(board);
        });
      });
  }

  componentWillUnmount() {
    this.listener();
  }

  render() {
    const { boardIds, userId } = this.props.user;
    const { boardsArray, selectBoard } = this.props;
    const boardTiles = boardsArray.map(board => {
      const { title, boardId } = board;
      return (
        <BoardTile
          key={boardId}
          title={title}
          boardId={boardId}
          onClick={() => selectBoard(boardId)}
        />
      );
    });
    return (
      <section>
        <BoardGrid>
          {boardTiles}
          <button type="button" onClick={this.props.openBoardComposer}>
            Add Board
          </button>
        </BoardGrid>
      </section>
    );
  }
}

const condition = authUser => !!authUser;

const mapStateToProps = state => {
  return {
    user: userSelectors.getUserData(state),
    boardsById: boardSelectors.getBoardsById(state),
    boardsArray: boardSelectors.getBoardsArray(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUserData: userId => dispatch(userActions.getUserData(userId)),
    updateUserBoards: boardIds =>
      dispatch(userActions.updateUserBoards(boardIds)),
    fetchBoardsById: userId => dispatch(boardActions.fetchBoardsById(userId)),
    updateBoardsById: board => dispatch(boardActions.updateBoardsById(board)),
    selectBoard: boardId => dispatch(currentActions.selectBoard(boardId))
  };
};

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BoardGridContainer)
);