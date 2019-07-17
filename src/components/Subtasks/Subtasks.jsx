import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

  static propTypes = {
    usePortal: PropTypes.bool,
    taskId: PropTypes.string.isRequired,
    subtaskIds: PropTypes.arrayOf(PropTypes.string).isRequired
  };

  state = {
    isLoading: !this.props.isLoaded,
    subtaskIds: this.props.subtaskIds
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

  componentDidUpdate(prevProps) {
    if (this.props.subtaskIds !== prevProps.subtaskIds) {
      this.resetSubtaskOrder();
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  moveSubtask = ({ destination, draggableId, source }) => {
    if (!destination || destination.index === source.index) return;
    const { firebase, subtaskIds } = this.props;
    const updatedSubtaskIds = [...subtaskIds];
    updatedSubtaskIds.splice(source.index, 1);
    updatedSubtaskIds.splice(destination.index, 0, draggableId);
    this.setState({
      subtaskIds: updatedSubtaskIds
    });
    firebase
      .updateDoc(['tasks', source.droppableId], {
        subtaskIds: updatedSubtaskIds
      })
      .catch(() => {
        this.resetSubtaskOrder();
      });
  };

  resetSubtaskOrder = () => {
    const { subtaskIds } = this.props;
    this.setState({ subtaskIds });
  };

  render() {
    const { taskId, subtasksById, usePortal } = this.props;
    const { isLoading, subtaskIds } = this.state;
    return (
      <DragDropContext onDragEnd={this.moveSubtask}>
        <Droppable droppableId={taskId} type={droppableTypes.SUBTASK}>
          {provided => (
            <ul className="subtasks" ref={provided.innerRef} {...provided.droppableProps}>
              {!isLoading &&
                subtasksById &&
                subtaskIds.map((subtaskId, index) => {
                  const { name, isCompleted } = subtasksById[subtaskId];
                  return (
                    <Subtask
                      subtaskId={subtaskId}
                      taskId={taskId}
                      index={index}
                      name={name}
                      isCompleted={isCompleted}
                      key={subtaskId}
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
    subtasksById: subtaskSelectors.getSubtasksById(state),
    selectedProjectId: getSelectedProjectId(state),
    isLoaded: taskSelectors.getTaskLoadedState(state, ownProps.taskId).subtasks
  };
};

const mapDispatchToProps = dispatch => {
  return {
    syncTaskSubtasks: taskId => dispatch(subtaskActions.syncTaskSubtasks(taskId))
  };
};

export default withFirebase(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Subtasks)
);
