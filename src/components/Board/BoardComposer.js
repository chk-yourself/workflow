import React, { Component } from 'react';
import { Modal } from '../Modal';
import { Input } from '../Input';

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
      <Modal onModalClose={this.props.onClose}>
        <form onSubmit={this.onSubmit}>
          <Input
            name="boardTitle"
            title="Board Title"
            value={boardTitle}
            onChange={this.onChange}
            type="text"
          />
          <button type="submit">Create Board</button>
        </form>
      </Modal>
    );
  }
}
