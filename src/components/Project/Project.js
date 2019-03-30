import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import * as droppableTypes from '../../constants/droppableTypes';
import { ListComposer } from '../ListComposer';

const Project = props => {
  const { projectId, children, view } = props;
  return (
    <Droppable
      droppableId={projectId}
      type={droppableTypes.LIST}
      direction={view === 'board' ? 'horizontal' : 'vertical'}
    >
      {provided => (
        <div
          className={`project is-${view}-view`}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {children}
          {provided.placeholder}
          <ListComposer view={view} projectId={projectId} />
        </div>
      )}
    </Droppable>
  );
};

export default Project;
