import React from 'react';
import { connect } from 'react-redux';
import { taskSelectors } from '../../ducks/tasks';
import SearchResults from './SearchResults';

const TagSearchResults = ({ tag, tasks }) => (
  <SearchResults query={tag} title="Tasks tagged" icon="tag" tasks={tasks} />
);

const mapStateToProps = (state, ownProps) => {
  return {
    tasks: taskSelectors.getTaggedTasks(state, ownProps.tag)
  };
};

export default connect(mapStateToProps)(TagSearchResults);
