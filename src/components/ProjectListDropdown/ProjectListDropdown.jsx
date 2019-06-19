import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SelectDropdown } from '../SelectDropdown';
import { projectSelectors, projectActions } from '../../ducks/projects';

class ProjectListDropdown extends Component {
  static propTypes = {
    projectId: PropTypes.string.isRequired
  };

  state = {
    isLoading: !this.props.isLoaded
  };

  async componentDidMount() {
    const { isLoaded, fetchProjectLists, projectId } = this.props;

    if (!isLoaded) {
      await fetchProjectLists(projectId);
      this.setState({
        isLoading: false
      });
    }
  }

  render() {
    const { isLoading } = this.state;
    const { onChange, lists, selectedList, classes } = this.props;
    if (isLoading) return null;
    return (
      <SelectDropdown
        options={lists.reduce(
          (listsById, list) => ({
            ...listsById,
            [list.listId]: {
              value: list.listId,
              name: list.name
            }
          }),
          {}
        )}
        value={selectedList}
        name="list"
        align={{ inner: 'right' }}
        onChange={onChange}
        classes={classes}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    lists: projectSelectors.getProjectLists(state, ownProps.projectId),
    isLoaded: projectSelectors.getProjectLoadedState(state, ownProps.projectId).lists
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchProjectLists: projectId => dispatch(projectActions.fetchProjectLists(projectId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectListDropdown);
