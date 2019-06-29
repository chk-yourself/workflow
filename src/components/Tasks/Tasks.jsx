import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
import { TASK } from '../../constants/droppableTypes';
import { Card } from '../Card';
import { DraggableTask } from '../Task';

export default class Tasks extends Component {
  static defaultProps = {
    dropType: TASK,
    isDragDisabled: false
  };

  static propTypes = {
    dropType: PropTypes.string,
    layout: PropTypes.oneOf(['board', 'list']).isRequired,
    isDragDisabled: PropTypes.bool
  };

  shouldComponentUpdate(nextProps) {
    const { taskIds, layout } = this.props;
    if (
      taskIds === nextProps.taskIds &&
      layout === nextProps.layout
    ) {
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
    if (!this.end) return;
    this.end.scrollIntoView({ behavior: 'smooth' });
  };

  setEndRef = el => {
    this.end = el;
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
              <div style={{ float: 'left', clear: 'both' }} ref={this.setEndRef} />
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
