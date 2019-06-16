import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { withFirebase } from '../Firebase';
import { Subtask } from '../Subtask';
import * as droppableTypes from '../../constants/droppableTypes';
import { subtaskActions, subtaskSelectors } from '../../ducks/subtasks';
import { taskSelectors } from '../../ducks/tasks';
import { getSelectedProjectId } from '../../ducks/selectedProject';
import './Subtasks.scss';

class Subtasks extends Component {
  static defaultProps = {
    usePortal: false
  };

  state = {
    isLoading: !this.props.isLoaded
  };

  async componentDidMount() {
    const { syncTaskSubtasks, taskId, selectedProjectId } = this.props;
    if (!selectedProjectId) {
      this.unsubscribe = await syncTaskSubtasks(taskId);
      this.setState({
        isLoading: false
      });
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  moveSubtask = ({ destination, draggableId, source }) => {
    if (!destination) return;
    if (destination.index === source.index) return;
    const { firebase, subtaskIds } = this.props;
    const updatedSubtaskIds = [...subtaskIds];
    updatedSubtaskIds.splice(source.index, 1);
    updatedSubtaskIds.splice(destination.index, 0, draggableId);
    firebase.updateDoc(['tasks', source.droppableId], {
      subtaskIds: updatedSubtaskIds
    });
  };

  render() {
    const { taskId, subtasks, usePortal } = this.props;
    const { isLoading } = this.state;
    return (
      <DragDropContext onDragEnd={this.moveSubtask}>
        <Droppable droppableId={taskId} type={droppableTypes.SUBTASK}>
          {provided => (
            <ul
              className="subtasks"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {!isLoading &&
                subtasks.map((subtask, index) => {
                  return (
                    <Subtask
                      subtaskId={subtask.subtaskId}
                      taskId={taskId}
                      index={index}
                      name={subtask.name}
                      isCompleted={subtask.isCompleted}
                      key={subtask.subtaskId}
                      usePortal={usePortal}
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
    subtasks: subtaskSelectors.getSubtasksArray(state, ownProps.subtaskIds),
    subtasksById: subtaskSelectors.getSubtasksById(state),
    selectedProjectId: getSelectedProjectId(state),
    isLoaded: taskSelectors.getTaskLoadedState(state, ownProps.taskId).subtasks
  };
};

const mapDispatchToProps = dispatch => {
  return {
    syncTaskSubtasks: taskId =>
      dispatch(subtaskActions.syncTaskSubtasks(taskId))
  };
};

export default withFirebase(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Subtasks)
);
