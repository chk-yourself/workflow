import React from 'react';
import TaskEditorSection from './TaskEditorSection';
import TaskEditorIcon from './TaskEditorIcon';
import { MemberAssigner } from '../MemberAssigner';

const TaskEditorAssignees = ({ memberIds, onSelectMember, enableSearch }) => {
  return (
    <TaskEditorSection>
      <TaskEditorIcon name="user" />
      <div className="task-editor__members">
        <MemberAssigner
          classes={{ memberAssigner: 'task-editor__member-assigner' }}
          placeholder="Assign or remove member"
          memberIds={memberIds}
          onSelectMember={onSelectMember}
          isMemberSearchDisabled={!enableSearch}
        />
      </div>
    </TaskEditorSection>
  );
};

export default TaskEditorAssignees;
