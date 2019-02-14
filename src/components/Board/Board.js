import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import * as droppableTypes from '../../constants/droppableTypes';
import { ListComposer } from '../List';

const Board = props => {
  const { boardId, children } = props;
  return (
    <Droppable
      droppableId={boardId}
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
          <ListComposer boardId={boardId} />
        </div>
      )}
    </Droppable>
  );
};

export default Board;
