import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
import * as droppableTypes from '../../constants/droppableTypes';
import { Card } from '../Card';

export default class Cards extends Component {
  static propTypes = {
    listId: PropTypes.string.isRequired
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
    this.listEnd.scrollIntoView({ behavior: 'smooth' });
  };

  render() {
    const { listId, tasks, onCardClick, onCardDelete } = this.props;

    return (
      <Droppable droppableId={listId} type={droppableTypes.CARD}>
        {(provided, snapshot) => (
          <div
            className="list__cards"
            ref={provided.innerRef}
            style={{ minHeight: snapshot.isDraggingOver ? 80 : 16 }}
            {...provided.droppableProps}
          >
            {tasks.map((task, taskIndex) => {
              return (
                <Card
                  key={task.taskId}
                  taskIndex={taskIndex}
                  onCardClick={onCardClick}
                  onCardDelete={onCardDelete}
                  {...task}
                />
              );
            })}
            {provided.placeholder}
            <div
              style={{ float: 'left', clear: 'both' }}
              ref={el => (this.listEnd = el)}
            />
          </div>
        )}
      </Droppable>
    );
  }
}
