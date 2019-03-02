import React, { Component } from 'react';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Button } from '../Button';
import './BoardComposer.scss';

const INITIAL_STATE = {
  boardTitle: ''
};

export default class BoardComposer extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = e => {
    e.preventDefault();
    const { boardTitle } = this.state;
    const { handleSubmit, onClose } = this.props;
    this.props.handleSubmit(boardTitle);
    this.props.onClose();
    this.setState({ ...INITIAL_STATE });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const { boardTitle } = this.state;
    return (
      <Modal onModalClose={this.props.onClose} size="sm">
      <h3 className="board-composer__title">Create new board</h3>
        <form onSubmit={this.onSubmit}>
          <Input
            name="boardTitle"
            title="Board Title"
            value={boardTitle}
            onChange={this.onChange}
            type="text"
          />
          <Button
            className="board-composer__btn--add"
            type="submit"
            onClick={this.onSubmit}
            color="primary"
            variant="contained"
          >
            Create Board
          </Button>
        </form>
      </Modal>
    );
  }
}
