import React, { Component } from 'react';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Button } from '../Button';
import './ProjectComposer.scss';

const INITIAL_STATE = {
  projectTitle: ''
};

export default class ProjectComposer extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = e => {
    e.preventDefault();
    const { projectTitle } = this.state;
    const { handleSubmit, onClose } = this.props;
    this.props.handleSubmit(projectTitle);
    this.props.onClose();
    this.setState({ ...INITIAL_STATE });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const { projectTitle } = this.state;
    return (
      <Modal onModalClose={this.props.onClose} size="sm">
      <h3 className="project-composer__title">Create new project</h3>
        <form onSubmit={this.onSubmit}>
          <Input
            name="projectTitle"
            title="Project Title"
            value={projectTitle}
            onChange={this.onChange}
            type="text"
          />
          <Button
            className="project-composer__btn--add"
            type="submit"
            onClick={this.onSubmit}
            color="primary"
            variant="contained"
          >
            Create Project
          </Button>
        </form>
      </Modal>
    );
  }
}
