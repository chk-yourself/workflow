import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Task from './Task';

const DraggableTask = ({
  taskId,
  index,
  onTaskClick,
  listId,
  folderId,
  task
}) => (
  <Draggable draggableId={taskId} index={index}>
    {(provided, snapshot) => (
      <Task
        innerRef={provided.innerRef}
        provided={provided}
        onTaskClick={onTaskClick}
        listId={listId}
        folderId={folderId}
        {...task}
      />
    )}
  </Draggable>
);

export default DraggableTask;
