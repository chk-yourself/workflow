import React, { Component } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import * as droppableTypes from '../../constants/droppableTypes';
import { Card } from '../Card';
import { DraggableTask } from '../Task';

export default class Tasks extends Component {
  static defaultProps = {
    dropType: droppableTypes.TASK,
    isDragDisabled: false
  };

  shouldComponentUpdate(nextProps) {
    if (this.props.taskIds === nextProps.taskIds) {
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps) {
    if (this.props.taskIds.length > prevProps.taskIds.length) {
      this.scrollToBottom();
    }
  }

  scrollToBottom = () => {
    if (!this.listEnd) return;
    this.listEnd.scrollIntoView({ behavior: 'smooth' });
  };

  render() {
    const {
      listId,
      projectId,
      dueDate,
      taskIds,
      folderId,
      layout,
      dropType,
      isDragDisabled
    } = this.props;
    const isBoardLayout = layout === 'board';

    const inner = taskIds.map((taskId, i) => {
      return isBoardLayout ? (
        <Card key={taskId} index={i} taskId={taskId} />
      ) : (
        <DraggableTask
          key={taskId}
          isDragDisabled={isDragDisabled}
          index={i}
          taskId={taskId}
        />
      );
    });

    return (
      <Droppable
        droppableId={listId || folderId || projectId || `${dueDate}`}
        type={dropType}
      >
        {(provided, snapshot) =>
          isBoardLayout ? (
            <div
              className="list__cards"
              ref={provided.innerRef}
              style={{ minHeight: snapshot.isDraggingOver ? 80 : 4 }}
              {...provided.droppableProps}
            >
              {inner}
              {provided.placeholder}
              <div
                style={{ float: 'left', clear: 'both' }}
                ref={el => (this.listEnd = el)}
              />
            </div>
          ) : (
            <ul
              className="list__tasks"
              ref={provided.innerRef}
              style={{ minHeight: snapshot.isDraggingOver ? 60 : 4 }}
              {...provided.droppableProps}
            >
              {inner}
              {provided.placeholder}
            </ul>
          )
        }
      </Droppable>
    );
  }
}
