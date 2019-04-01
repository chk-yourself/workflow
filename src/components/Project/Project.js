import React, { Component } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import * as droppableTypes from '../../constants/droppableTypes';
import { ListComposer } from '../ListComposer';

class Project extends Component {

  render() {
    const { projectId, children, layout, isListComposerActive, toggleListComposer, inputRef } = this.props;
  return (
    <Droppable
      droppableId={projectId}
      type={droppableTypes.LIST}
      direction={layout === 'board' ? 'horizontal' : 'vertical'}
    >
      {provided => (
        <div
          className={`project is-${layout}-layout`}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {children}
          {provided.placeholder}
          <ListComposer inputRef={inputRef} toggle={toggleListComposer} isActive={isListComposerActive} layout={layout} projectId={projectId} />
        </div>
      )}
    </Droppable>
  );
}
}

export default Project;
