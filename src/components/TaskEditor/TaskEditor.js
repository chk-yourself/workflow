import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirebase } from '../Firebase';
import { currentUserSelectors } from '../../ducks/currentUser';
import { taskActions, taskSelectors } from '../../ducks/tasks';
import { subtaskSelectors } from '../../ducks/subtasks';
import { Textarea } from '../Textarea';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Modal } from '../Modal';
import { Toolbar } from '../Toolbar';
import TaskEditorSection from './TaskEditorSection';
import TaskEditorMoreActions from './TaskEditorMoreActions';
import { Subtasks } from '../Subtasks';
import { SubtaskComposer } from '../SubtaskComposer';
import { TagsInput } from '../TagsInput';
import './TaskEditor.scss';
import { projectSelectors } from '../../ducks/projects';
import { listSelectors } from '../../ducks/lists';
import { DatePicker } from '../DatePicker';
import TaskEditorPane from './TaskEditorPane';
import { ProjectBadge } from '../ProjectBadge';
import { getSimpleDate, toDateString, isPriorDate } from '../../utils/date';
import { ProjectListDropdown } from '../ProjectListDropdown';
import { CommentComposer } from '../CommentComposer';
import { Comments } from '../Comments';
import { MemberAssigner } from '../MemberAssigner';
import { NotesEditor } from '../NotesEditor';
import { debounce } from '../../utils/function';


const TaskEditorWrapper = ({
  layout,
  handleTaskEditorClose,
  onOutsideClick,
  children
}) => {
  return layout === 'board' ? (
    <Modal
      onModalClose={handleTaskEditorClose}
      classes={{ content: 'task-editor', button: 'task-editor__btn--close' }}
      size="lg"
      id="taskEditor"
      onOutsideClick={onOutsideClick}
    >
      {children}
    </Modal>
  ) : (
    <TaskEditorPane onClose={handleTaskEditorClose}>{children}</TaskEditorPane>
  );
};

/*
  TODO: Break up logic in child components
  */

class TaskEditor extends Component {
  state = {
    name: this.props.name,
    isColorPickerActive: false,
    currentTag: null,
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
      viewportWidth: window.innerWidth
    });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  deleteTask = () => {
    const { taskId, listId, handleTaskEditorClose, deleteTask } = this.props;
    deleteTask({ taskId, listId });
    handleTaskEditorClose();
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

  handleMoreActions = e => {
    if (!e.target.matches('a')) return;
    const { action } = e.target.dataset;
    switch (action) {
      case 'delete':
        this.deleteTask();
        break;
    }
    e.preventDefault(); // prevents page reload
  };

  assignMember = (userId, e) => {
    const {
      taskId,
      projectId,
      projectName,
      assignedTo,
      firebase,
      folders,
      dueDate
    } = this.props;

    if (assignedTo.includes(userId)) {
      if (!projectId) return;
      const folderId = folders[userId];
      firebase.removeAssignee({ taskId, projectId, userId, folderId, dueDate });
    } else {
      firebase.addAssignee({ taskId, projectId, projectName, userId, dueDate });
    }
  };

  toggleColorPicker = value => {
    this.setState({
      isColorPickerActive: value
    });
  };

  hideColorPicker = () => {
    this.toggleColorPicker(false);
  };

  addTag = name => {
    const {
      firebase,
      currentUser,
      projectTags,
      taskId,
      projectId
    } = this.props;
    const { userId, tags: userTags } = currentUser;
    const isProjectTag = projectTags && name in projectTags;
    const isUserTag = userTags && name in userTags;
    const projectTag = isProjectTag ? projectTags[name] : null;
    const userTag = isUserTag ? userTags[name] : null;
    const projectCount = isProjectTag ? projectTag.count + 1 : 1;
    const userCount = isUserTag ? userTag.count + 1 : 1;
    const tagData = isProjectTag
      ? { ...projectTag, projectCount, userCount }
      : isUserTag
      ? { ...userTag, projectCount, userCount }
      : { name, userCount, projectCount };

    firebase
      .addTag({
        userId,
        taskId,
        projectId,
        ...tagData
      })
      .then(() => {
        if (!isUserTag && !isProjectTag) {
          this.setState({
            currentTag: name
          });
          this.toggleColorPicker(true);
        }
      });
  };

  setTagColor = color => {
    const { userId, projectId, firebase } = this.props;
    const { currentTag: tag } = this.state;
    firebase.setTagColor({ userId, projectId, tag, color });
  };

  removeTag = name => {
    const { taskId, currentUser, projectId, removeTaskTag } = this.props;
    const { userId } = currentUser;
    removeTaskTag({ taskId, name, userId, projectId });
    this.toggleColorPicker(false);
  };

  setDueDate = newDueDate => {
    const { firebase, taskId, assignedTo, dueDate } = this.props;
    const prevDueDate = dueDate ? new Date(dueDate.toDate()) : null;
    firebase.setTaskDueDate({ taskId, prevDueDate, newDueDate, assignedTo });
  };

  toggleDatePicker = () => {
    this.setState(prevState => ({
      isDatePickerActive: !prevState.isDatePickerActive
    }));
  };

  toggleCompleted = e => {
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
    const { handleTaskEditorClose } = this.props;
    if (e.target.matches('.member-search__item')) return;
    handleTaskEditorClose();
  };

  render() {
    const {
      handleTaskEditorClose,
      taskId,
      commentIds,
      assignedTo,
      taskTags,
      mergedTags,
      dueDate,
      subtaskIds,
      projectId,
      completedSubtasks,
      layout,
      listName,
      listId,
      isCompleted,
      notes
    } = this.props;
    const {
      name,
      isColorPickerActive,
      isDatePickerActive,
      currentTag,
      viewportWidth
    } = this.state;
    const hasSubtasks = subtaskIds && subtaskIds.length > 0;
    const hasComments = commentIds && commentIds.length > 0;
    const taskDueDate = dueDate
      ? getSimpleDate(dueDate.toDate())
      : getSimpleDate(new Date());
    const dueDateStr = dueDate
      ? toDateString(dueDate.toDate(), {
          useRelative: true,
          format: { month: 'short', day: 'numeric' }
        })
      : null;
    const isDueToday = dueDateStr === 'Today';
    const isDueTmrw = dueDateStr === 'Tomorrow';
    const isPastDue = dueDate && isPriorDate(dueDate.toDate());
    return (
      <TaskEditorWrapper
        handleTaskEditorClose={handleTaskEditorClose}
        onOutsideClick={this.onOutsideClick}
        layout={layout}
      >
        <Toolbar className="task-editor__toolbar">
          <Button
            type="button"
            onClick={this.toggleCompleted}
            size="md"
            variant={isCompleted ? 'contained' : 'outlined'}
            color="success"
            className="task-editor__btn--toggle-completed"
          >
            <Icon name="check" />
            {isCompleted ? 'Completed' : 'Mark Completed'}
          </Button>
          <TaskEditorMoreActions onMenuClick={this.handleMoreActions} />
        </Toolbar>
        <form
          name="editTaskForm"
          className="task-editor__edit-task-form"
        >
          <Textarea
            className="task-editor__textarea--title"
            name="name"
            value={name}
            onChange={this.onChange}
            required
            onBlur={this.onBlur}
          />
          {projectId && (
            <TaskEditorSection size="sm">
              <div className="task-editor__project-name">
                <ProjectBadge
                  projectId={projectId}
                  size="md"
                  variant="icon"
                  classes={{
                    badge: 'task-editor__project-badge',
                    icon: 'task-editor__project-badge-icon'
                  }}
                />
              </div>
              <div className="task-editor__list-name">
                <ProjectListDropdown
                  classes={{
                    button: 'task-editor__project-list-dropdown-btn--toggle',
                    menu: 'task-editor__project-list-dropdown-menu'
                  }}
                  projectId={projectId}
                  selectedList={{ value: listId, label: listName }}
                  onChange={this.moveToList}
                />
              </div>
            </TaskEditorSection>
          )}
          <TaskEditorSection>
            <Button
              onClick={this.toggleDatePicker}
              type="button"
              className={`task-editor__btn--due-date ${
                isDatePickerActive ? 'is-active' : ''
              }`}
            >
              <span className="task-editor__due-date-icon">
                <Icon name="calendar" />
              </span>
              <span className="task-editor__due-date-wrapper">
                {!dueDate ? (
                  <span className="task-editor__no-due-date">Set due date</span>
                ) : (
                  <>
                    <span className="task-editor__section-title--sm">
                      Due Date
                    </span>
                    <span
                      className={`task-editor__due-date ${
                        isDueToday
                          ? 'is-due-today'
                          : isDueTmrw
                          ? 'is-due-tmrw'
                          : isPastDue
                          ? 'is-past-due'
                          : ''
                      }`}
                    >
                      {dueDateStr}
                    </span>
                  </>
                )}
              </span>
            </Button>
            <DatePicker
              innerRef={el => (this.datePickerEl = el)}
              onClose={this.toggleDatePicker}
              selectedDate={dueDate ? taskDueDate : null}
              currentMonth={taskDueDate.month}
              currentYear={taskDueDate.year}
              selectDate={this.setDueDate}
              isActive={isDatePickerActive}
            />
          </TaskEditorSection>
          <TaskEditorSection>
            <div className="task-editor__section-icon">
              <Icon name="user" />
            </div>
            <div className="task-editor__members">
              <MemberAssigner
                classes={{ memberAssigner: 'task-editor__member-assigner'}}
                placeholder="Assign or remove member"
                memberIds={assignedTo}
                onSelectMember={this.assignMember}
                memberSearchIsDisabled={!projectId}
              />
            </div>
          </TaskEditorSection>
          <TaskEditorSection>
            <div className="task-editor__section-icon">
              <Icon name="tag" />
            </div>
            <TagsInput
              addTag={this.addTag}
              tagSuggestions={mergedTags}
              assignedTags={taskTags}
              hideColorPicker={this.hideColorPicker}
              isColorPickerActive={isColorPickerActive}
              setTagColor={this.setTagColor}
              removeTag={this.removeTag}
              currentTag={currentTag}
            />
          </TaskEditorSection>
          <TaskEditorSection>
            <div className="task-editor__section-icon">
              <Icon name="edit-3" />
            </div>
            <NotesEditor
              placeholder="Add a description"
              type="task"
              key={`notes--${taskId}`}
              id={taskId}
              value={notes}
              classes={{
                editor:
                  'task-editor__textarea task-editor__textarea--description'
              }}
            />
          </TaskEditorSection>
        </form>
        <TaskEditorSection>
          <div className="task-editor__section-header">
            <div className="task-editor__section-icon">
              <Icon name="check-square" />
            </div>
            <h3 className="task-editor__section-title">
              {hasSubtasks && (
                <span className="task-editor__section-detail">
                  {completedSubtasks.length}/{subtaskIds.length}
                </span>
              )}
              Subtasks
            </h3>
            <hr className="task-editor__hr" />
          </div>
          <div className="task-editor__subtasks-container">
          {hasSubtasks && (
            <Subtasks
              taskId={taskId}
              subtaskIds={subtaskIds}
              projectId={projectId}
              usePortal={layout === 'board' && viewportWidth >= 576}
            />
          )}
          <SubtaskComposer
            taskId={taskId}
            projectId={projectId}
            classes={{
              composer: 'task-editor__subtask-composer',
              iconWrapper: 'task-editor__subtask-composer-icon-wrapper',
              form: 'task-editor__new-subtask-form',
              textarea: 'task-editor__textarea--new-subtask',
              button: 'task-editor__btn--add-subtask'
            }}
          />
          </div>
        </TaskEditorSection>
        <TaskEditorSection className="comments">
          <div className="task-editor__section-header">
            <div className="task-editor__section-icon">
              <Icon name="message-circle" />
            </div>
            <h3 className="task-editor__section-title">
              {hasComments && (
                <span className="task-editor__section-detail">
                  {commentIds.length}
                </span>
              )}
              {hasComments && commentIds.length === 1 ? 'Comment' : 'Comments'}
            </h3>
            <hr className="task-editor__hr" />
          </div>

          {hasComments && (
            <div className="task-editor__comments">
              <Comments taskId={taskId} commentIds={commentIds} />
            </div>
          )}
          <CommentComposer
            key={`comment-composer--${taskId}`}
            id={`comment-composer--${taskId}`}
            taskId={taskId}
            projectId={projectId}
            classes={{
              avatar: 'task-editor__avatar',
              avatarPlaceholder: 'task-editor__avatar-placeholder',
              composer: 'task-editor__comment-composer',
              button: 'task-editor__btn--submit-comment'
            }}
          />
        </TaskEditorSection>
      </TaskEditorWrapper>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: currentUserSelectors.getCurrentUser(state),
    taskTags: taskSelectors.getTaskTags(state, ownProps),
    mergedTags: currentUserSelectors.getMergedProjectTags(state),
    projectTags: projectSelectors.getProjectTags(state, ownProps.projectId),
    completedSubtasks: subtaskSelectors.getCompletedSubtasks(
      state,
      ownProps.subtaskIds
    ),
    listsById: listSelectors.getListsById(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deleteTask: ({ taskId, listId }) =>
      dispatch(taskActions.deleteTask({ taskId, listId })),
    addTag: (taskId, tag) => dispatch(taskActions.addTag(taskId, tag)),
    removeTaskTag: ({ taskId, name, userId, projectId }) =>
      dispatch(taskActions.removeTaskTag({ taskId, name, userId, projectId }))
  };
};

export default withFirebase(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TaskEditor)
);
