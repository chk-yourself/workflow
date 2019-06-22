import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withAuthorization } from '../Session';
import { NotesEditor } from '../NotesEditor';
import { MemberAssigner } from '../MemberAssigner';
import { projectSelectors } from '../../ducks/projects';
import { ColorPicker } from '../ColorPicker';
import { Button } from '../Button';
import { ProjectIcon } from '../ProjectIcon';
import { Icon } from '../Icon';

const ProjectOverviewSection = ({ name, children, className = '' }) => (
  <div className={`project__overview-section ${className}`}>
    <h2 className="project__subheading">{name}</h2>
    {children}
  </div>
);

class ProjectOverview extends Component {
  static propTypes = {
    projectId: PropTypes.string.isRequired
  };

  state = {
    isColorPickerActive: false
  };

  toggleColorPicker = () => {
    this.setState(prevState => ({
      isColorPickerActive: !prevState.isColorPickerActive
    }));
  };

  setColor = color => {
    const { firebase, projectId } = this.props;
    firebase.updateDoc(['projects', projectId], {
      color
    });
  };

  hideColorPicker = e => {
    const { isColorPickerActive } = this.state;
    if (
      !isColorPickerActive ||
      (isColorPickerActive && e.target.matches('.project__btn--toggle-color-picker'))
    )
      return;
    this.setState({
      isColorPickerActive: false
    });
  };

  render() {
    const { projectId, project, onSelectMember } = this.props;
    const { notes, memberIds, color, settings } = project;
    const { isPrivate } = settings;
    const { isColorPickerActive } = this.state;
    return (
      <div className="project__overview">
        <ProjectOverviewSection name="Highlight Color" className="project__overview-section--color">
          <Button
            onClick={this.toggleColorPicker}
            className={`project__btn--toggle-color-picker ${
              isColorPickerActive ? 'is-active' : ''
            }`}
          >
            <ProjectIcon className="project__color-swatch" color={color} />
            <Icon name="chevron-down" />
          </Button>
          <ColorPicker
            selected={color}
            onOutsideClick={this.hideColorPicker}
            isActive={isColorPickerActive}
            selectColor={this.setColor}
            classes={{ colorPicker: 'project__color-picker' }}
          />
        </ProjectOverviewSection>
        <ProjectOverviewSection name="Members">
          <MemberAssigner
            placeholder="Add or remove member"
            memberIds={memberIds}
            onSelectMember={onSelectMember}
            isMemberSearchDisabled={isPrivate}
          />
        </ProjectOverviewSection>
        <ProjectOverviewSection name="Description">
          <NotesEditor
            classes={{ editor: 'project__notes-editor' }}
            placeholder="Add a description"
            type="project"
            id={projectId}
            value={notes}
          />
        </ProjectOverviewSection>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  project: projectSelectors.getProject(state, ownProps.projectId)
});

const condition = (currentUser, activeWorkspace) => !!currentUser && !!activeWorkspace;

export default withAuthorization(condition)(connect(mapStateToProps)(ProjectOverview));
