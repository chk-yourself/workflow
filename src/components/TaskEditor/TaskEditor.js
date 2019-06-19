import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withAuthorization } from '../Session';
import { taskActions } from '../../ducks/tasks';
import { selectTask as selectTaskAction } from '../../ducks/selectedTask';
import { listSelectors } from '../../ducks/lists';
import { Textarea } from '../Textarea';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Modal } from '../Modal';
import { Toolbar } from '../Toolbar';
import { debounce } from '../../utils/function';
import TaskEditorMoreActions from './TaskEditorMoreActions';
import TaskEditorPane from './TaskEditorPane';
import TaskEditorComments from './TaskEditorComments';
import TaskEditorSubtasks from './TaskEditorSubtasks';
import TaskEditorNotes from './TaskEditorNotes';
import TaskEditorDueDate from './TaskEditorDueDate';
import TaskEditorTags from './TaskEditorTags';
import TaskEditorAssignees from './TaskEditorAssignees';
import TaskEditorProjectDetails from './TaskEditorProjectDetails';
import './TaskEditor.scss';

const TaskEditorWrapper = ({ layout, onClose, onOutsideClick, children }) => {
  return layout === 'board' ? (
    <Modal
      onClose={onClose}
      classes={{
        modal: 'task-editor-modal',
        content: 'task-editor',
        button: 'task-editor__btn--close'
      }}
      size="lg"
      id="taskEditor"
      onOutsideClick={onOutsideClick}
    >
      {children}
    </Modal>
  ) : (
    <TaskEditorPane onClose={onClose}>{children}</TaskEditorPane>
  );
};

class TaskEditor extends Component {
  state = {
    name: this.props.name,
    isDatePickerActive: false,
    isMemberSearchActive: false,
    prevProps: {
      name: this.props.name
    },
    viewportWidth: null
  };

  componentDidMount() {
    const { layout } = this.props;
    if (layout !== 'board') return;
    this.setViewportWidth();
    this.handleResize = debounce(200, this.setViewportWidth);
    window.addEventListener('resize', this.handleResize);
    if (this.textarea) {
      this.textarea.focus();
    }
  }

  componentWillUnmount() {
    if (this.handleResize) {
      window.removeEventListener('resize', this.handleResize);
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.name !== state.prevProps.name) {
      return {
        name: props.name,
        prevProps: {
          name: props.name
        }
      };
    }
    return null;
  }

  setViewportWidth = () => {
    this.setState({
      viewportWidth: window.innerWidth || document.documentElement.clientWidth
    });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  deleteTask = () => {
    const { taskId, listId, deleteTask } = this.props;
    deleteTask({ taskId, listId });
    this.closeTaskEditor();
  };

  onBlur = e => {
    const taskKey = e.target.name;
    const { [taskKey]: currentValue, taskId, firebase } = this.props;
    const { [taskKey]: updatedValue } = this.state;

    // When field loses focus, update task if change is detected

    if (updatedValue !== currentValue) {
      firebase.updateDoc(['tasks', taskId], {
        [taskKey]: updatedValue
      });
      console.log('Updated task!');
    }
  };

  resetForm = key => {
    this.setState({
      [key]: ''
    });
  };

  assignMember = userId => {
    const {
      taskId,
      projectId,
      projectName,
      assignedTo,
      firebase,
      folders,
      dueDate,
      activeWorkspace
    } = this.props;
    const { workspaceId } = activeWorkspace;

    if (assignedTo.includes(userId)) {
      if (!projectId) return;
      const folderId = folders[userId];
      firebase.removeAssignee({
        taskId,
        projectId,
        userId,
        folderId,
        dueDate,
        workspaceId
      });
    } else {
      firebase.addAssignee({
        taskId,
        projectId,
        projectName,
        userId,
        dueDate,
        workspaceId
      });
    }
  };

  setDueDate = newDueDate => {
    const {
      firebase,
      taskId,
      assignedTo,
      dueDate,
      activeWorkspace
    } = this.props;
    const { workspaceId } = activeWorkspace;
    const prevDueDate = dueDate ? new Date(dueDate.toDate()) : null;
    firebase.setTaskDueDate({
      taskId,
      prevDueDate,
      newDueDate,
      assignedTo,
      workspaceId
    });
  };

  toggleDatePicker = () => {
    this.setState(prevState => ({
      isDatePickerActive: !prevState.isDatePickerActive
    }));
  };

  toggleCompleted = () => {
    const { taskId, isCompleted, firebase } = this.props;
    firebase.updateDoc(['tasks', taskId], {
      isCompleted: !isCompleted,
      completedAt: !isCompleted ? firebase.getTimestamp() : null
    });
  };

  moveToList = e => {
    e.stopPropagation();
    const { firebase, taskId, listsById, listId: origListId } = this.props;
    const newListId = e.target.value;
    const newListName = e.target.dataset.label;
    const updatedTaskIds = [...listsById[newListId].taskIds, taskId];
    firebase.moveTaskToList({
      taskId,
      origListId,
      newListId,
      updatedTaskIds,
      newListName
    });
  };

  toggleMemberSearch = () => {
    this.setState(prevState => ({
      isMemberSearchActive: !prevState.isMemberSearchActive
    }));
  };

  hideMemberSearch = e => {
    if (e.target.matches('.task-editor__btn--add-member')) return;
    this.setState({
      isMemberSearchActive: false
    });
  };

  onOutsideClick = e => {
    if (
      e.target.matches('.member-search__item') ||
      e.target.matches('.tags-input__item')
    )
      return;
    this.closeTaskEditor();
  };

  closeTaskEditor = () => {
    const { selectTask } = this.props;
    selectTask(null);
  };

  setTextareaRef = el => {
    this.textarea = el;
  };

  render() {
    const {
      taskId,
      commentIds,
      assignedTo,
      dueDate,
      subtaskIds,
      projectId,
      layout,
      listId,
      isCompleted,
      notes
    } = this.props;
    const { name, isDatePickerActive, viewportWidth } = this.state;
    const isPrivate = !projectId;
    return (
      <TaskEditorWrapper
        onClose={this.closeTaskEditor}
        onOutsideClick={this.onOutsideClick}
        layout={layout}
      >
        <Toolbar className="task-editor__toolbar">
          <Button
            type="button"
            onClick={this.toggleCompleted}
            size="md"
            variant="text"
            color="neutral"
            className={`task-editor__btn--toggle-completed ${
              isCompleted ? 'is-completed' : ''
            }`}
          >
            <Icon name="check" />
            <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
          </Button>
          <TaskEditorMoreActions onDelete={this.deleteTask} />
        </Toolbar>
        <div className="task-editor__wrapper">
          <form name="editTaskForm" className="task-editor__edit-task-form">
            <Textarea
              className="task-editor__textarea--title"
              name="name"
              value={name}
              onChange={this.onChange}
              onBlur={this.onBlur}
              innerRef={this.setTextareaRef}
              required
            />
            <TaskEditorProjectDetails
              isPrivate={isPrivate}
              projectId={projectId}
              listId={listId}
              onSelectList={this.moveToList}
            />
            <TaskEditorDueDate
              dueDate={dueDate}
              onToggleDatePicker={this.toggleDatePicker}
              isDatePickerActive={isDatePickerActive}
              onSelectDueDate={this.setDueDate}
            />
            <TaskEditorAssignees
              memberIds={assignedTo}
              onSelectMember={this.assignMember}
              enableSearch={!isPrivate}
            />
            <TaskEditorTags taskId={taskId} projectId={projectId} />
            <TaskEditorNotes
              taskId={taskId}
              value={notes}
              enableMentions={!isPrivate}
            />
          </form>
          <TaskEditorSubtasks
            taskId={taskId}
            projectId={projectId}
            subtaskIds={subtaskIds}
            usePortal={layout === 'board' && viewportWidth >= 576}
          />
          {!isPrivate && (
            <TaskEditorComments
              taskId={taskId}
              projectId={projectId}
              commentIds={commentIds}
            />
          )}
        </div>
      </TaskEditorWrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    listsById: listSelectors.getListsById(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deleteTask: ({ taskId, listId }) =>
      dispatch(taskActions.deleteTask({ taskId, listId })),
    selectTask: taskId => dispatch(selectTaskAction(taskId))
  };
};

const condition = (currentUser, activeWorkspace) =>
  !!currentUser && !!activeWorkspace;

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TaskEditor)
);
