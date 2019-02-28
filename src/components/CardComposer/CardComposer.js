import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from '../Icon';
import { withFirebase } from '../Firebase';
import { boardActions, boardSelectors } from '../../ducks/boards';
import { currentActions, currentSelectors } from '../../ducks/current';
import { Textarea } from '../Textarea';
import { Button } from '../Button';
import * as keys from '../../constants/keys';
import './CardComposer.scss';

const INITIAL_STATE = {
  cardTitle: '',
  isActive: false
};

class CardComposer extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  resetForm = () => {
    this.setState({ cardTitle: '' });
  };

  onSubmit = e => {
    if (e.type === 'keydown' && e.key !== keys.ENTER) return;
    const { cardTitle } = this.state;
    const { boardId } = this.props.current;
    const { listId } = this.props;
    this.props.firebase.addCard({ boardId, listId, cardTitle });
    this.resetForm();
    e.preventDefault();
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

  onReset = e => {
    this.setState({ ...INITIAL_STATE });
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
            isRequired
            name="cardTitle"
            className="card-composer__textarea"
            isAutoHeightResizeEnabled={false}
            onKeyDown={this.onSubmit}
          />
          {isActive && (
            <div className="card-composer__footer">
              <Button
                className="card-composer__btn--add"
                type="submit"
                onClick={this.onSubmit}
                color="primary"
                variant="contained"
              >
                Add Card
              </Button>
              <Button
                className="card-composer__btn--close"
                type="reset"
                onClick={this.onReset}
                size="sm"
                iconOnly
              >
                <Icon name="x" />
              </Button>
            </div>
          )}
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    boardsArray: boardSelectors.getBoardsArray(state),
    current: currentSelectors.getCurrent(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateBoardsById: board => dispatch(boardActions.updateBoardsById(board))
  };
};

export default withFirebase(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CardComposer)
);