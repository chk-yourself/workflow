import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirebase } from '../Firebase';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Button } from '../Button';
import { Radio } from '../Radio';
import { Icon } from '../Icon';
import { ColorPicker } from '../ColorPicker';
import { ProjectIcon } from '../ProjectIcon';
import { MemberAssigner } from '../MemberAssigner';
import { userSelectors } from '../../ducks/users';
import { currentUserSelectors } from '../../ducks/currentUser';
import './ProjectComposer.scss';

class ProjectComposer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      notes: '',
      layout: 'board',
      color: 'default',
      privacy: 'public',
      memberIds: [props.userId],
      isColorPickerActive: false,
      isMemberSearchActive: false
    };
  }

  reset = () => {
    const { userId } = this.props;
    this.setState({
      name: '',
      notes: '',
      layout: 'board',
      color: 'default',
      privacy: 'public',
      memberIds: [userId],
      isColorPickerActive: false,
      isMemberSearchActive: false
    });
  };

  onSubmit = e => {
    e.preventDefault();
    const { name, notes, color, layout, privacy, memberIds } = this.state;
    const isPrivate = privacy === 'private';
    const { onClose, firebase, userId } = this.props;
    firebase.addProject({
      userId,
      name,
      color,
      layout,
      isPrivate,
      memberIds,
      notes
    });
    onClose();
    this.reset();
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  toggleColorPicker = () => {
    this.setState(prevState => ({
      isColorPickerActive: !prevState.isColorPickerActive
    }));
  };

  hideColorPicker = () => {
    const { isColorPickerActive } = this.state;
    if (!isColorPickerActive) return;
    this.setState({
      isColorPickerActive: false
    });
  };

  onColorPickerOutsideClick = e => {
    const { isColorPickerActive } = this.state;
    if (
      isColorPickerActive &&
      !e.target.matches('.project-composer__btn--toggle-color-picker')
    ) {
      this.hideColorPicker();
    }
  };

  handleMemberAssignment = (userId, e) => {
    const { memberIds } = this.state;
    if (memberIds.includes(userId)) {
      this.setState(prevState => ({
        memberIds: prevState.memberIds.filter(memberId => memberId !== userId)
      }));
    } else {
      this.setState(prevState => ({
        memberIds: [...prevState.memberIds, userId]
      }));
    }
    e.preventDefault();
  };

  render() {
    const {
      name,
      notes,
      layout,
      privacy,
      color,
      memberIds,
      isColorPickerActive
    } = this.state;

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
            labelClass={'project-composer__label'}
            value={name}
            onChange={this.onChange}
            type="text"
            className="project-composer__input--name"
          />
          <div className="project-composer__settings">
            <div className="project-composer__control-group project-composer__control-group--color">
              <h4 className="project-composer__subheading">Highlight Color</h4>
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
                onOutsideClick={this.onColorPickerOutsideClick}
                isActive={isColorPickerActive}
                onChange={this.onChange}
                classes={{ colorPicker: 'project-composer__color-picker' }}
              />
            </div>
          </div>
          <div className="project-composer__control-group">
            <h4 className="project-composer__subheading">Privacy</h4>
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
          </div>
          {privacy === 'public' && (
            <div className="project-composer__control-group">
              <h4 className="project-composer__subheading">Members</h4>
              <MemberAssigner
                placeholder="Add or remove member"
                memberIds={memberIds}
                onSelectMember={this.handleMemberAssignment}
              />
            </div>
          )}
          <div className="project-composer__control-group">
            <h4 className="project-composer__subheading">Layout</h4>
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
          </div>
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

const mapStateToProps = (state, ownProps) => {
  return {
    userId: currentUserSelectors.getCurrentUserId(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default withFirebase(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ProjectComposer)
);
