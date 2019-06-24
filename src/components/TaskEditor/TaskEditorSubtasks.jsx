import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { subtaskSelectors } from '../../ducks/subtasks';
import TaskEditorSection from './TaskEditorSection';
import TaskEditorIcon from './TaskEditorIcon';
import { Subtasks } from '../Subtasks';
import { SubtaskComposer } from '../SubtaskComposer';

const TaskEditorSubtasks = ({
  taskId,
  projectId,
  subtaskIds,
  usePortal,
  completedSubtasks
}) => {
  const hasSubtasks = subtaskIds.length > 0;
  return (
    <TaskEditorSection>
      <div className="task-editor__section-header">
        <TaskEditorIcon name="check-circle" />
        <h3 className="task-editor__section-title">
          {hasSubtasks && (
            <span className="task-editor__section-detail">
              {completedSubtasks.length}/{subtaskIds.length}
            </span>
          )}
          Subtasks
        </h3>
        <hr className="task-editor__hr" />
      </div>
      <div className="task-editor__subtasks-container">
        <Subtasks
          taskId={taskId}
          subtaskIds={subtaskIds}
          projectId={projectId}
          usePortal={usePortal}
        />
        <SubtaskComposer
          taskId={taskId}
          projectId={projectId}
          classes={{
            composer: 'task-editor__subtask-composer',
            iconWrapper: 'task-editor__subtask-composer-icon-wrapper',
            form: 'task-editor__new-subtask-form',
            textarea: 'task-editor__textarea--new-subtask',
            button: 'task-editor__btn--add-subtask'
          }}
        />
      </div>
    </TaskEditorSection>
  );
};

TaskEditorSubtasks.defaultProps = {
  subtaskIds: []
};

TaskEditorSubtasks.propTypes = {
  subtaskIds: PropTypes.arrayOf(PropTypes.string),
  taskId: PropTypes.string.isRequired,
  usePortal: PropTypes.bool.isRequired
};

const mapStateToProps = (state, ownProps) => {
  return {
    completedSubtasks: subtaskSelectors.getCompletedSubtasks(state, ownProps.subtaskIds)
  };
};

export default connect(mapStateToProps)(TaskEditorSubtasks);
