import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FeatherIcon } from '../FeatherIcon';
import { withAuthorization } from '../Session';
import { cardActions, cardSelectors } from '../../ducks/cards';
import { userActions, userSelectors } from '../../ducks/user';
import { boardActions, boardSelectors } from '../../ducks/boards';
import { currentActions, currentSelectors } from '../../ducks/current';
import { Textarea } from '../Textarea';
import './CardComposer.scss';

class CardComposer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardTitle: '',
      isActive: false
    };
  }

  resetForm = () => {
    this.setState({ cardTitle: '' });
  };

  onSubmit = e => {
    e.preventDefault();
    const { cardTitle } = this.state;
    const { boardId } = this.props.current;
    const { listId } = this.props;
    this.props.firebase.addCard({ boardId, listId, cardTitle });
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
    if (e.target.value !== '') return;
    this.setState({
      isActive: false
    });
  };

  render() {
    const { cardTitle, isActive } = this.state;
    return (
      <div
        className={`card-composer${isActive ? ' is-active' : ''}`}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      >
        <form className="card-composer__form" onSubmit={this.onSubmit}>
          <Textarea
            onChange={this.onChange}
            value={cardTitle}
            placeholder={isActive ? 'Enter card title...' : 'Add a card'}
            isRequired={true}
            name="cardTitle"
            style="card"
          />
          {isActive && (
            <>
              <button className="card-composer__btn--add" type="submit">
                Add Card
              </button>
              <button className="card-composer__btn--close" type="button">
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
    updateBoardsById: board => dispatch(boardActions.updateBoardsById(board))
  };
};

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CardComposer)
);
