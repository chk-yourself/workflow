import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dropdown } from '../Dropdown';
import { projectSelectors, projectActions } from '../../ducks/projects';
import './ProjectListDropdown.scss';

class ProjectListDropdown extends Component {
  state = {
    isLoadingLists: !this.props.projectLoadedState.lists
  };

  async componentDidMount() {
    const { projectLoadedState, fetchProjectLists, projectId } = this.props;
    const { lists: isLoaded } = projectLoadedState;

    if (!isLoaded) {
      await fetchProjectLists(projectId);
      this.setState({
        isLoadingLists: false
      });
    }
  }

  render() {
    const { isLoadingLists } = this.state;
    const { isActive, onToggle, onChange, lists, selectedList } = this.props;
    return (
      <Dropdown
        options={
          !isLoadingLists
            ? lists.map(list => ({ value: list.listId, label: list.name }))
            : []
        }
        selectedOption={selectedList}
        name="list"
        align={{ inner: 'right' }}
        onChange={onChange}
        classes={{ button: 'project-list-dropdown__btn--toggle', menu: 'project-list-dropdown__menu' }}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    lists: projectSelectors.getProjectLists(state, ownProps.projectId),
    projectsById: projectSelectors.getProjectsById(state),
    projectLoadedState: projectSelectors.getProjectLoadedState(
      state,
      ownProps.projectId
    )
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchProjectLists: projectId =>
      dispatch(projectActions.fetchProjectLists(projectId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectListDropdown);
