import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { currentUserSelectors } from '../../ducks/currentUser';
import { taskSelectors } from '../../ducks/tasks';
import TaskEditorSection from './TaskEditorSection';
import TaskEditorIcon from './TaskEditorIcon';
import { TagInput } from '../TagInput';

const TaskEditorTags = ({ taskId, projectId, tags, suggestions }) => {
  return (
    <TaskEditorSection>
      <TaskEditorIcon name="tag" />
      <TagInput
        taskId={taskId}
        projectId={projectId}
        tagSuggestions={suggestions}
        assignedTags={tags}
      />
    </TaskEditorSection>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    tags: taskSelectors.getTaskTags(state, ownProps.taskId),
    suggestions: currentUserSelectors.getMergedProjectTags(state, ownProps.projectId)
  };
};

TaskEditorTags.propTypes = {
  taskId: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(TaskEditorTags);
