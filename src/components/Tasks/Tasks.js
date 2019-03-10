import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
import * as droppableTypes from '../../constants/droppableTypes';
import { Card } from '../Card';
import { DraggableTask } from '../Task';

export default class Tasks extends Component {
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
    const { listId, tasks, onTaskClick, folderId, view } = this.props;
    const isBoardView = view === 'board';

    const inner = tasks.map((task, taskIndex) => {
      return isBoardView ? (
        <Card
          key={task.taskId}
          taskIndex={taskIndex}
          onCardClick={onTaskClick}
          {...task}
        />
      ) : (
        <DraggableTask
          key={task.taskId}
          index={taskIndex}
          onTaskClick={onTaskClick}
          listId={listId}
          folderId={folderId}
          taskId={task.taskId}
          task={task}
        />
      );
    });

    return (
      <Droppable droppableId={listId || folderId} type={droppableTypes.TASK}>
        {(provided, snapshot) =>
          isBoardView ? (
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
