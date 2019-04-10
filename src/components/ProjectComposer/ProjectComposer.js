import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Button } from '../Button';
import { Radio } from '../Radio';
import { Icon } from '../Icon';
import { ColorPicker } from '../ColorPicker';
import { ProjectIcon } from '../ProjectIcon';
import { MemberAssigner } from '../MemberAssigner';
import ProjectComposerControlGroup from './ProjectComposerControlGroup';
import './ProjectComposer.scss';

const settings = {
  privacy: {
    options: [
      {
        value: 'public',
        label: 'Public'
      },
      {
        value: 'private',
        label: 'Private'
      }
    ]
  },
  layout: {
    options: [
      {
        value: 'board',
        label: (
          <>
            <Icon name="trello" />
            Board
          </>
        )
      },
      {
        value: 'list',
        label: (
          <>
            <Icon name="list" />
            List
          </>
        )
      }
    ]
  }
};

class ProjectComposer extends Component {
  state = {
    name: '',
    layout: 'board',
    color: 'default',
    privacy: 'public',
    memberIds: [this.props.currentUser.userId],
    isColorPickerActive: false
  };

  reset = () => {
    const { currentUser } = this.props;
    const { userId } = currentUser;
    this.setState({
      name: '',
      layout: 'board',
      color: 'default',
      privacy: 'public',
      memberIds: [userId],
      isColorPickerActive: false
    });
  };

  onSubmit = e => {
    e.preventDefault();
    const { name, color, layout, privacy, memberIds } = this.state;
    const isPrivate = privacy === 'private';
    const { onClose, firebase, currentUser } = this.props;
    const { userId } = currentUser;
    firebase.addProject({
      userId,
      name,
      color,
      layout,
      isPrivate,
      memberIds
    });
    onClose();
    this.reset();
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  setColor = color => {
    this.setState({
      color
    });
  };

  toggleColorPicker = () => {
    this.setState(prevState => ({
      isColorPickerActive: !prevState.isColorPickerActive
    }));
  };

  hideColorPicker = e => {
    const { isColorPickerActive } = this.state;
    if (
      !isColorPickerActive ||
      (isColorPickerActive &&
        e.target.matches('.project-composer__btn--toggle-color-picker'))
    )
      return;
    this.setState({
      isColorPickerActive: false
    });
  };

  handleMemberAssignment = (userId, e) => {
    const { memberIds } = this.state;
    this.setState(prevState => ({
      memberIds: memberIds.includes(userId)
        ? prevState.memberIds.filter(memberId => memberId !== userId)
        : [...prevState.memberIds, userId]
    }));
    e.preventDefault();
  };

  render() {
    const {
      name,
      layout,
      privacy,
      color,
      memberIds,
      isColorPickerActive
    } = this.state;

    return (
      <Modal
        onModalClose={this.props.onClose}
        size="md"
        classes={{ content: 'project-composer' }}
      >
        <h3 className="project-composer__heading">Create new project</h3>
        <form className="project-composer__form" onSubmit={this.onSubmit}>
          <Input
            name="name"
            label="Project Name"
            labelClass="project-composer__label"
            value={name}
            onChange={this.onChange}
            type="text"
            className="project-composer__input--name"
          />
          <div className="project-composer__settings">
            <ProjectComposerControlGroup
              name="Highlight Color"
              className="project-composer__control-group--color"
            >
              <Button
                onClick={this.toggleColorPicker}
                className={`project-composer__btn--toggle-color-picker ${
                  isColorPickerActive ? 'is-active' : ''
                }`}
              >
                <ProjectIcon
                  className="project-composer__color-swatch"
                  color={color}
                />
                <Icon name="chevron-down" />
              </Button>
              <ColorPicker
                onOutsideClick={this.hideColorPicker}
                isActive={isColorPickerActive}
                selectColor={this.setColor}
                classes={{ colorPicker: 'project-composer__color-picker' }}
              />
            </ProjectComposerControlGroup>
          </div>
          <ProjectComposerControlGroup name="Privacy">
            {settings.privacy.options.map(option => (
              <Radio
                key={option.value}
                onChange={this.onChange}
                isChecked={privacy === option.value}
                label={option.label}
                name="privacy"
                id={option.value}
                value={option.value}
                classes={{
                  radio: 'project-composer__radio',
                  label: 'project-composer__radio-label'
                }}
              />
            ))}
          </ProjectComposerControlGroup>
          {privacy === 'public' && (
            <ProjectComposerControlGroup name="Members">
              <MemberAssigner
                placeholder="Add or remove member"
                memberIds={memberIds}
                onSelectMember={this.handleMemberAssignment}
              />
            </ProjectComposerControlGroup>
          )}
          <ProjectComposerControlGroup name="Layout">
            {settings.layout.options.map(option => (
              <Radio
                key={option.value}
                onChange={this.onChange}
                isChecked={layout === option.value}
                label={option.label}
                name="layout"
                id={option.value}
                value={option.value}
                classes={{
                  radio: 'project-composer__radio',
                  label: 'project-composer__radio-label'
                }}
              />
            ))}
          </ProjectComposerControlGroup>
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

const condition = currentUser => !!currentUser;

export default withAuthorization(condition)(ProjectComposer);
