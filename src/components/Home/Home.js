import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';
import { userActions, userSelectors } from '../../ducks/user';
import { currentSelectors } from '../../ducks/current';
import { BoardGridContainer } from '../BoardGrid';
import { BoardComposer } from '../Board';
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
    const userId = this.props.firebase.auth.currentUser.uid;
    console.log('mounted home');
    this.props.fetchUserData(userId);
    this.props.fetchBoardsById(userId).then(() =>
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
    const userId = this.props.user.userId;
    this.props.firebase.addBoard({ userId, boardTitle });
  };

  render() {
    const { isBoardComposerOpen, isFetching } = this.state;
    const userId = this.props.user.userId;
    if (isFetching) return null;
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
                    openBoardComposer={this.toggleBoardComposer}
                  />
                )}
              </main>
            )}
          />
          <Route
            path={ROUTES.BOARD}
            render={props => <BoardContainer boardId={props.match.params.id} {...props} />}
          />
        </Switch>
      </>
    );
  }
}

const condition = authUser => !!authUser;

const mapStateToProps = state => {
  return {
    user: userSelectors.getUserData(state),
    currentBoardId: currentSelectors.getCurrentBoardId(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchUserData: userId => dispatch(userActions.fetchUserData(userId)),
    fetchBoardsById: userId => dispatch(boardActions.fetchBoardsById(userId))
  };
};

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HomePage)
);
