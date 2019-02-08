import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input } from '../Input';
import { FeatherIcon } from '../FeatherIcon';
import { withAuthorization } from '../Session';
import { userActions, userSelectors } from '../../ducks/user';
import { boardActions, boardSelectors } from '../../ducks/boards';
import { currentActions, currentSelectors } from '../../ducks/current';
import './List.scss';

class ListComposer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listTitle: '',
      isActive: false
    };
  }

  resetForm = () => {
    this.setState({ listTitle: '' });
  };

  onSubmit = e => {
    e.preventDefault();
    const { listTitle } = this.state;
    const { boardId } = this.props.current;
    this.props.firebase.addList({ boardId, listTitle });
    this.resetForm();
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onFocus = e => {
    this.setState({
      isActive: true
    });
  };

  onBlur = e => {
    if (e.target.value === '') {
      this.setState({
        isActive: false
      });
    }
  };

  render() {
    const { listTitle, isActive } = this.state;
    return (
      <div
        className={`list-composer${isActive ? ' is-active' : ''}`}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      >
        <form className="list-composer__form" onSubmit={this.onSubmit}>
          <Input
            onChange={this.onChange}
            value={listTitle}
            placeholder={isActive ? 'Enter list title...' : 'Add a list'}
            required="true"
            name="listTitle"
            hideLabel="true"
          />
          {isActive && (
            <>
              <button className="list-composer__btn--add" type="submit">
                Add List
              </button>
              <button className="list-composer__btn--close" type="button">
                <FeatherIcon name="x" />
              </button>
            </>
          )}
        </form>
      </div>
    );
  }
}

const condition = authUser => !!authUser;

const mapStateToProps = state => {
  return {
    user: userSelectors.getUserData(state),
    boardsById: boardSelectors.getBoardsById(state),
    boardsArray: boardSelectors.getBoardsArray(state),
    current: currentSelectors.getCurrent(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUserData: userId => dispatch(userActions.getUserData(userId)),
    fetchBoardsById: userId => dispatch(boardActions.fetchBoardsById(userId)),
    updateBoardsById: board => dispatch(boardActions.updateBoardsById(board)),
    selectBoard: boardId => dispatch(currentActions.selectBoard(boardId))
  };
};

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ListComposer)
);
