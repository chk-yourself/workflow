import React, { Component } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import * as droppableTypes from '../../constants/droppableTypes';
import { Card } from '../Card';
import { DraggableTask } from '../Task';

export default class Tasks extends Component {
  static defaultProps = {
    dropType: droppableTypes.TASK
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

  applyViewFilter = tasks => {
    const { viewFilter } = this.props;
    switch (viewFilter) {
      case 'completed': {
        return tasks.filter(task => task.isCompleted);
      }
      case 'active': {
        return tasks.filter(task => !task.isCompleted);
      }
      default: {
        return tasks;
      }
    }
  };

  applySortRule = tasks => {
    const { sortBy } = this.props;
    switch (sortBy) {
      case 'dueDate': {
        const noDueDate = Date.now();
        return [...tasks].sort((a, b) => {
          const dueDateA = a.dueDate ? a.dueDate.toMillis() : noDueDate;
          const dueDateB = b.dueDate ? b.dueDate.toMillis() : noDueDate;
          return dueDateA - dueDateB;
        });
      }
      default: {
        return tasks;
      }
    }
  };

  applyTaskSettings = tasks => {
    return this.applySortRule(this.applyViewFilter(tasks));
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
      viewFilter,
      sortBy
    } = this.props;
    const isBoardLayout = layout === 'board';

    const inner = this.applyTaskSettings(tasks).map((task, taskIndex) => {
      return isBoardLayout ? (
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
