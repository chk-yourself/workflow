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

  /*

  shouldComponentUpdate(nextProps) {
    if (this.props.cards === nextProps.cards) {
      return false;
    }
    return true;
  }
*/
  componentDidUpdate(prevProps) {
    if (this.props.tasks.length > prevProps.tasks.length) {
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
      tasks,
      onTaskClick,
      folderId,
      layout,
      dropType,
      isDragDisabled
    } = this.props;
    const isBoardLayout = layout === 'board';

    const inner = tasks.map((task, i) => {
      return isBoardLayout ? (
        <Card key={task.taskId} index={i} onCardClick={onTaskClick} {...task} />
      ) : (
        <DraggableTask
          key={task.taskId}
          isDragDisabled={isDragDisabled}
          index={i}
          onTaskClick={onTaskClick}
          listId={listId}
          folderId={folderId}
          taskId={task.taskId}
          task={task}
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
              style={{ minHeight: snapshot.isDraggingOver ? 80 : 16 }}
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
