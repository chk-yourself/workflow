import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import * as droppableTypes from '../../constants/droppableTypes';
import { ListComposer } from '../ListComposer';

const Board = props => {
  const { projectId, children } = props;
  return (
    <Droppable
      droppableId={projectId}
      type={droppableTypes.LIST}
      direction="horizontal"
    >
      {provided => (
        <div
          className="board"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {children}
          {provided.placeholder}
          <ListComposer projectId={projectId} />
        </div>
      )}
    </Droppable>
  );
};

export default Board;
