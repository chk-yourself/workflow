import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { withFirebase } from '../Firebase';
import { Subtask } from '../Subtask';
import * as droppableTypes from '../../constants/droppableTypes';
import * as keys from '../../constants/keys';
import { subtaskActions, subtaskSelectors } from '../../ducks/subtasks';
import './Subtasks.scss';

class Subtasks extends Component {
  state = {
    isFetching: true
  };

  componentDidMount() {
    const { firebase, fetchTaskSubtasks, addSubtask, updateSubtask, deleteSubtask, taskId } = this.props;
    fetchTaskSubtasks(taskId).then(() => {
      this.setState({
        isFetching: false
      });
    });
    this.subtaskObserver = firebase.db
      .collection('subtasks')
      .where('taskId', '==', taskId)
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          const subtaskId = change.doc.id;
          const subtaskData = change.doc.data();
          if (change.type === 'added') {
            addSubtask({ subtaskId, subtaskData });
          }
          if (change.type === 'modified') {
            updateSubtask({ subtaskId, subtaskData });
          }
          if (change.type === 'removed') {
            deleteSubtask(subtaskId);
          }
        });
      });
  }
  
  shouldComponentUpdate(nextProps) {
    if (nextProps.subtasks.includes(undefined)) {
      return false;
    }
    return true;
  }

  moveSubtask = ({ destination, draggableId, source }) => {
    if (!destination) return;
    if (destination.index === source.index) return;
    const { firebase, subtaskIds } = this.props;
    const updatedSubtaskIds = [...subtaskIds];
    updatedSubtaskIds.splice(source.index, 1);
    updatedSubtaskIds.splice(destination.index, 0, draggableId);
    firebase.updateTask(source.droppableId, {
      subtaskIds: updatedSubtaskIds
    });
  };

  componentWillUnmount() {
    this.subtaskObserver();
  }

  render() {
    const { taskId, subtasks } = this.props;
    const { isFetching } = this.state;

    return (
      <DragDropContext onDragEnd={this.moveSubtask}>
        <Droppable droppableId={taskId} type={droppableTypes.SUBTASK}>
          {provided => (
            <ul
              className="subtasks"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {!isFetching && subtasks.map((subtask, index) => {
                return (
                  <Subtask
                    subtaskId={subtask.subtaskId}
                    taskId={taskId}
                    index={index}
                    name={subtask.name}
                    isCompleted={subtask.isCompleted}
                    key={subtask.subtaskId}
                  />
                );
              })}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    subtasks: subtaskSelectors.getSubtasksArray(state, ownProps.subtaskIds)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchTaskSubtasks: taskId =>
      dispatch(subtaskActions.fetchTaskSubtasks(taskId)),
      addSubtask: ({ subtaskId, subtaskData }) =>
      dispatch(subtaskActions.addSubtask({ subtaskId, subtaskData })),
    deleteSubtask: subtaskId =>
      dispatch(subtaskActions.deleteSubtask(subtaskId)),
    updateSubtask: ({ subtaskId, subtaskData }) =>
      dispatch(subtaskActions.updateSubtask({ subtaskId, subtaskData }))
  };
};

export default withFirebase(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Subtasks)
);

