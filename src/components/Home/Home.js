import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { userActions, userSelectors } from '../../ducks/user';
import { currentSelectors } from '../../ducks/current';
import { BoardGridContainer } from '../BoardGrid';
import { BoardComposer } from '../Board';
import { BoardContainer } from '../Board';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreateBoardForm: false
    };
  }
  componentDidMount() {
    const userId = this.props.firebase.auth.currentUser.uid;
    this.props.getUserData(userId);
  }

  toggleBoardComposer = () => {
    this.setState(prevState => ({
      showCreateBoardForm: !prevState.showCreateBoardForm
    }));
  };

  createBoard = boardTitle => {
    const userId = this.props.user.userId;
    this.props.firebase.addBoard({ userId, boardTitle });
  };

  render() {
    const { showCreateBoardForm } = this.state;
    const userId = this.props.user.userId;
    return (
      <>
        {showCreateBoardForm && (
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
              <main>
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
            render={props => <BoardContainer {...props} />}
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
    getUserData: userId => dispatch(userActions.getUserData(userId))
  };
};

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HomePage)
);
