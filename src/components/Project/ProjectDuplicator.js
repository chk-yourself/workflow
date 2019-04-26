import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withAuthorization } from '../Session';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { Icon } from '../Icon';
import { projectSelectors } from '../../ducks/projects';
import './ProjectDuplicator.scss';

const options = [
  {
    value: 'includeDescription',
    name: 'Description'
  },
  {
    value: 'includeSubtasks',
    name: 'Subtasks'
  },
  {
    value: 'includeMembers',
    name: 'Members'
  }
];

class ProjectDuplicator extends Component {
  state = {
    name: `Duplicate of ${this.props.project.name}`,
    includeDescription: true,
    includeSubtasks: true,
    includeMembers: true
  };

  reset = () => {
    const { project } = this.props;
    const { name } = project;
    
    this.setState({
      name: `Duplicate of ${name}`,
      includeDescription: true,
      includeSubtasks: true,
      includeMembers: true
    });
  };

  onSubmit = e => {
    e.preventDefault();
    const { name, includeDescription, includeSubtasks, includeMembers } = this.state;
    if (!name) return;
    const { onClose, firebase, currentUser, activeWorkspace } = this.props;
    const { userId } = currentUser;
    const { workspaceId } = activeWorkspace;
    onClose();
    this.reset();
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  toggleOption = e => {
    const { value } = e.target;
    this.setState(prevState => ({
      [value]: !prevState[value]
    }));
  };

  render() {
    const {
      name,
      includeDescription,
      includeSubtasks,
      includeMembers
    } = this.state;

    const { onClose } = this.props;
    return (
      <Modal
        onModalClose={onClose}
        size="md"
        classes={{ content: 'project-duplicator' }}
      >
        <h3 className="project-duplicator__heading">Duplicate Project</h3>
        <form className="project-duplicator__form" onSubmit={this.onSubmit}>
          <Input
            name="name"
            id="projectDuplicateName"
            label="Project Name"
            labelClass="project-duplicator__label"
            value={name}
            onChange={this.onChange}
            type="text"
            className="project-duplicator__input"
          />
          <fieldset className="project-duplicator__options">
          <legend className="project-duplicator__legend">Include:</legend>
            {options.map(option => (
              <Checkbox
                id={option.value}
                value={option.value}
                name="projectDuplicateOptions"
                isChecked={this.state[option.value]}
                onChange={this.toggleOption}
                className="project-duplicator__checkbox"
                labelClass="project-duplicator__checkbox-label"
                label={option.name}
              />
            ))}
          </fieldset>
          <Button
            className="project-duplicator__btn"
            type="submit"
            onClick={this.onSubmit}
            color="primary"
            variant="contained"
            disabled={!name}
          >
            Create Duplicate Project
          </Button>
        </form>
      </Modal>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    project: projectSelectors.getProject(state, ownProps.projectId)
  };
};

const condition = (currentUser, activeWorkspace) =>
  !!currentUser && !!activeWorkspace;

export default compose(
  connect(mapStateToProps),
  withAuthorization(condition)
)(ProjectDuplicator);
