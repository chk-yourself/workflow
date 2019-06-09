import React from 'react';
import { connect } from 'react-redux';
import { taskSelectors } from '../../ducks/tasks';
import SearchResults from './SearchResults';

const QuerySearchResults = ({ query, tasks }) => (
  <SearchResults
    icon="search"
    title="Search Results"
    query={query}
    tasks={tasks}
  />
);

const mapStateToProps = (state, ownProps) => {
  return {
    tasks: taskSelectors.getTasksMatchingQuery(state, ownProps.query)
  };
};

export default connect(mapStateToProps)(QuerySearchResults);
