import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { Checkbox } from '../Checkbox';
import { Textarea } from '../Textarea';
import { withFirebase } from '../Firebase';
import * as keys from '../../constants/keys';
import { currentActions, currentSelectors } from '../../ducks/current';
import Task from './Task';
import './Task.scss';

class DraggableTask extends Component {
  onDragStart = e => {
    console.log('dragstart');
  };

  render() {
    const { taskId, index, onTaskClick, listId, defaultKey, task } = this.props;
    return (
      <Draggable draggableId={taskId} index={index}>
        {(provided, snapshot) => (
          <Task
            innerRef={provided.innerRef}
            provided={provided}
            onTaskClick={onTaskClick}
            listId={listId}
            defaultKey={defaultKey}
            {...task}
          />
        )}
      </Draggable>
    );
  }
}

const mapStateToProps = state => {
  return {
    userId: currentSelectors.getCurrentUserId(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default withFirebase(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DraggableTask)
);
