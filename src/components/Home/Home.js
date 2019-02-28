import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';
import { userActions, userSelectors } from '../../ducks/users';
import { currentActions, currentSelectors } from '../../ducks/current';
import { BoardGridContainer } from '../BoardGrid';
import { BoardComposer } from '../BoardComposer';
import { BoardContainer } from '../Board';
import { boardActions, boardSelectors } from '../../ducks/boards';
import './Home.scss';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBoardComposerOpen: false,
      isFetching: true
    };
  }

  componentDidMount() {
    const {
      firebase,
      selectUser,
      fetchUsersById,
      fetchBoardsById
    } = this.props;
    const userId = firebase.auth.currentUser.uid;
    selectUser(userId);
    console.log('mounted home');
    fetchUsersById()
      .then(() => fetchBoardsById(userId))
      .then(() =>
        this.setState({
          isFetching: false
        })
      );
  }

  toggleBoardComposer = () => {
    this.setState(prevState => ({
      isBoardComposerOpen: !prevState.isBoardComposerOpen
    }));
  };

  createBoard = boardTitle => {
    const { userId, firebase } = this.props;
    firebase.addBoard({ userId, boardTitle });
  };

  render() {
    const { isBoardComposerOpen, isFetching } = this.state;
    if (isFetching) return null;
    const { userId, boardsById } = this.props;
    return (
      <>
        {isBoardComposerOpen && (
          <BoardComposer
            onClose={this.toggleBoardComposer}
            handleSubmit={this.createBoard}
          />
        )}
        <Switch>
          <Route
            exact
            path={ROUTES.HOME}
            render={() => (
              <main className="main">
                <h1>Home</h1>
                {userId && (
                  <BoardGridContainer
                    userId={userId}
                    openBoardComposer={this.toggleBoardComposer}
                  />
                )}
              </main>
            )}
          />
          <Route
            path={ROUTES.BOARD}
            render={props => (
              <BoardContainer
                userId={userId}
                boardId={props.match.params.id}
                boardTitle={boardsById[props.match.params.id].boardTitle}
                {...props}
              />
            )}
          />
        </Switch>
      </>
    );
  }
}

const condition = authUser => !!authUser;

const mapStateToProps = (state, ownProps) => {
  return {
    currentBoardId: currentSelectors.getCurrentBoardId(state),
    userId: currentSelectors.getCurrentUserId(state),
    boardsById: boardSelectors.getBoardsById(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchUsersById: () => dispatch(userActions.fetchUsersById()),
    fetchBoardsById: userId => dispatch(boardActions.fetchBoardsById(userId)),
    selectUser: userId => dispatch(currentActions.selectUser(userId))
  };
};

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HomePage)
);