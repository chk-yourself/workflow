/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirebase } from '../Firebase';
import { currentUserSelectors } from '../../ducks/currentUser';
import { taskActions, taskSelectors } from '../../ducks/tasks';
import { subtaskActions, subtaskSelectors } from '../../ducks/subtasks';
import { userSelectors } from '../../ducks/users';
import { commentActions, commentSelectors } from '../../ducks/comments';
import { Textarea } from '../Textarea';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Modal } from '../Modal';
import { Toolbar } from '../Toolbar';
import { Avatar } from '../Avatar';
import TaskEditorAssignMember from './TaskEditorAssignMember';
import TaskEditorSection from './TaskEditorSection';
import { MemberSearch } from '../MemberSearch';
import TaskEditorMoreActions from './TaskEditorMoreActions';
import * as keys from '../../constants/keys';
import { Subtasks } from '../Subtasks';
import { SubtaskComposer } from '../SubtaskComposer';
import { Comment } from '../Comment';
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

const TaskEditorWrapper = ({
  view,
  handleTaskEditorClose,
  onOutsideClick,
  children
}) => {
  return view === 'board' ? (
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
    <TaskEditorPane onClose={handleTaskEditorClose}>
      {children}
    </TaskEditorPane>
  );
};

/*
  TODO: Break up logic in child components
  */

class TaskEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      notes: this.props.notes,
      currentFocus: null,
      isColorPickerActive: false,
      currentTag: null,
      isDatePickerActive: false,
      isMemberSearchActive: false,
      prevProps: {
        name: this.props.name,
        notes: this.props.notes
      }
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.name !== state.prevProps.name) {
      return {
        name: props.name,
        prevProps: {
          ...state.prevProps,
          name: props.name
        }
      };
    }
    if (props.notes !== state.prevProps.notes) {
      return {
        notes: props.notes,
        prevProps: {
          ...state.prevProps,
          notes: props.notes
        }
      };
    }
    return null;
  }

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
      firebase.updateTask(taskId, {
        [taskKey]: updatedValue
      });
      console.log('updated task!');
    }

    this.setState({
      currentFocus: null
    });
  };

  resetForm = key => {
    this.setState({
      [key]: ''
    });
  };

  onFocus = e => {
    this.setState({
      currentFocus: e.target.name
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
    const { taskId, projectId, projectName, assignedTo, firebase, folders, dueDate } = this.props;

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

  addTag = name => {
    const {
      firebase,
      currentUser,
      projectTags,
      taskId,
      projectId,
      addTag
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
    firebase.moveTaskToList({ taskId, origListId, newListId, updatedTaskIds, newListName });
  };

  toggleMemberSearch = () => {
    this.setState(prevState => ({
      isMemberSearchActive: !prevState.isMemberSearchActive
    }));
  }

  hideMemberSearch = e => {
    if (e.target.matches('.task-editor__btn--add-member')) return;
    this.setState({
      isMemberSearchActive: false
    });
  }

  onOutsideClick = e => {
    const { handleTaskEditorClose } = this.props;
    if (e.target.matches('.member-search__item')) return;
    console.log(e.target);
    handleTaskEditorClose();
  }

  render() {
    const {
      handleTaskEditorClose,
      taskId,
      commentIds,
      assignedTo,
      usersArray,
      membersArray,
      currentUser,
      taskTags,
      mergedTags,
      dueDate,
      subtaskIds,
      projectId,
      completedSubtasks,
      view,
      listName,
      listId,
      isCompleted
    } = this.props;
    const {
      name,
      notes,
      currentFocus,
      subtasks,
      isColorPickerActive,
      isDatePickerActive,
      isMemberSearchActive,
      currentTag
    } = this.state;
    const hasSubtasks = subtaskIds && subtaskIds.length > 0;
    const hasComments = commentIds && commentIds.length > 0;
    const isAssigned = !!assignedTo && assignedTo.length > 0;
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
        view={view}
      >
        <Toolbar className="task-editor__toolbar">
          {projectId && (
            <TaskEditorAssignMember isActive={isMemberSearchActive} onClose={this.hideMemberSearch} onToggle={this.toggleMemberSearch}>
            {isMemberSearchActive && (
              <MemberSearch
                users={usersArray}
                assignedMembers={assignedTo}
                onMemberClick={this.assignMember}
                onClose={this.hideMemberSearch}
              />
            )}
            </TaskEditorAssignMember>
          )}
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
          onFocus={this.onFocus}
          className="task-editor__edit-task-form"
        >
          <Textarea
            className="task-editor__textarea--title"
            name="name"
            value={name}
            onChange={this.onChange}
            required
            onBlur={this.onBlur}
            onFocus={this.onFocus}
          />
          {projectId && (
            <TaskEditorSection size="sm">
              <div className="task-editor__project-name">
                <ProjectBadge
                  projectId={projectId}
                  size="md"
                  variant="icon"
                  classes={{badge: 'task-editor__project-badge', icon: 'task-editor__project-badge-icon'}}
                />
              </div>
              <div className="task-editor__list-name">
                <ProjectListDropdown classes={{ button: 'task-editor__project-list-dropdown-btn--toggle', menu: 'task-editor__project-list-dropdown-menu' }} projectId={projectId} selectedList={{ value: listId, label: listName }} onChange={this.moveToList} />
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
            {isAssigned && (
              <div className="task-editor__members">
                {membersArray.map(member => {
                  const { name, photoURL, userId } = member;
                  return (
                    <Avatar
                      classes={{
                        avatar: 'task-editor__avatar',
                        placeholder: 'task-editor__avatar-placeholder'
                      }}
                      name={name}
                      size="sm"
                      variant="circle"
                      imgSrc={photoURL}
                      key={userId}
                    />
                  );
                })}
              </div>
            )}
            {projectId && (
              <Button
                type="button"
                className="task-editor__btn--add-member"
                onClick={this.toggleMemberSearch}
              >
                <Icon name="plus" />
              </Button>
            )}
          </TaskEditorSection>
          <TaskEditorSection>
            <div className="task-editor__section-icon">
              <Icon name="tag" />
            </div>
            <TagsInput
              addTag={this.addTag}
              tagSuggestions={mergedTags}
              assignedTags={taskTags}
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
            <Textarea
              className="task-editor__textarea task-editor__textarea--description"
              name="notes"
              value={notes}
              onChange={this.onChange}
              placeholder="Add a description"
              onBlur={this.onBlur}
              onFocus={this.onFocus}
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
          {hasSubtasks && (
            <Subtasks
              taskId={taskId}
              subtaskIds={subtaskIds}
              projectId={projectId}
            />
          )}
          <SubtaskComposer taskId={taskId} projectId={projectId} classes={{
            iconWrapper: "task-editor__section-icon",
            form: 'task-editor__new-subtask-form',
            textarea: "task-editor__textarea task-editor__textarea--new-subtask",
            button: "task-editor__btn--add-subtask"
          }} />
        </TaskEditorSection>
        <TaskEditorSection>
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
          <CommentComposer taskId={taskId} projectId={projectId} classes={{
            avatar: 'task-editor__avatar',
            avatarPlaceholder: 'task-editor__avatar-placeholder',
            form: 'task-editor__comment-form',
            textarea: 'task-editor__textarea task-editor__textarea--comment',
            button: 'task-editor__btn--submit-comment'
          }} />
        </TaskEditorSection>
      </TaskEditorWrapper>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: currentUserSelectors.getCurrentUser(state),
    usersArray: userSelectors.getUsersArray(state),
    membersArray: userSelectors.getMembersArray(state, ownProps.assignedTo),
    taskTags: taskSelectors.getTaskTags(state, ownProps),
    mergedTags: currentUserSelectors.getMergedTags(state),
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
