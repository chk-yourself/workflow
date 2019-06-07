import React from 'react';
import PropTypes from 'prop-types';
import TaskEditorSection from './TaskEditorSection';
import TaskEditorIcon from './TaskEditorIcon';
import { Comments } from '../Comments';
import { CommentComposer } from '../CommentComposer';

const TaskEditorComments = ({ taskId, projectId, commentIds }) => {
  const hasComments = commentIds && commentIds.length > 0;
  return (
    <TaskEditorSection className="comments">
      <div className="task-editor__section-header">
        <TaskEditorIcon name="message-circle" />
        <h3 className="task-editor__section-title">
          {hasComments && (
            <span className="task-editor__section-detail">
              {commentIds.length}
            </span>
          )}
          {hasComments && commentIds.length === 1 ? 'Comment' : 'Comments'}
        </h3>
        <hr className="task-editor__hr" />
      </div>

      {hasComments && (
        <div className="task-editor__comments">
          <Comments taskId={taskId} commentIds={commentIds} />
        </div>
      )}
      <CommentComposer
        key={`comment-composer--${taskId}`}
        id={`comment-composer--${taskId}`}
        taskId={taskId}
        projectId={projectId}
        classes={{
          avatar: 'task-editor__avatar',
          avatarPlaceholder: 'task-editor__avatar-placeholder',
          composer: 'task-editor__comment-composer',
          button: 'task-editor__btn--submit-comment'
        }}
      />
    </TaskEditorSection>
  );
};

TaskEditorComments.defaultProps = {
  commentIds: []
};

TaskEditorComments.propTypes = {
  taskId: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  commentIds: PropTypes.arrayOf(PropTypes.string)
};

export default TaskEditorComments;
