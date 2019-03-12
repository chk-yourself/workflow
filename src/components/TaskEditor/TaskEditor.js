/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirebase } from '../Firebase';
import {
  currentUserActions,
  currentUserSelectors
} from '../../ducks/currentUser';
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
import TaskEditorComment from './TaskEditorComment';
import { TagsInput } from '../TagsInput';
import './TaskEditor.scss';
import { projectSelectors } from '../../ducks/projects';
import { DatePicker } from '../DatePicker';
import { dateUtils } from '../Calendar';
import TaskEditorPane from './TaskEditorPane';
import { ProjectIcon } from '../ProjectIcon';

const TaskEditorWrapper = ({
  view,
  handleTaskEditorClose,
  handleClick,
  children
}) => {
  return view === 'board' ? (
    <Modal
      onModalClose={handleTaskEditorClose}
      classes={{ content: 'task-editor', button: 'task-editor__btn--close' }}
      onModalClick={handleClick}
      size="lg"
      id="taskEditor"
    >
      {children}
    </Modal>
  ) : (
    <TaskEditorPane onClose={handleTaskEditorClose} onClick={handleClick}>
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
      isFetching: this.props.commentIds && this.props.commentIds.length > 0,
      name: this.props.name,
      notes: this.props.notes,
      newSubtask: '',
      newComment: '',
      currentFocus: null,
      isColorPickerActive: false,
      currentTag: null,
      isDatePickerActive: false,
      prevProps: {
        name: this.props.name,
        notes: this.props.notes
      }
    };
    this.membersListButton = React.createRef();
  }

  componentDidMount() {
    const {
      taskId,
      firebase,
      fetchTaskComments,
      addComment,
      deleteComment,
      updateComment
    } = this.props;

    console.log(taskId);
    fetchTaskComments(taskId).then(() => {
      this.setState({
        isFetching: false
      });
    });

    this.commentObserver = firebase.db
      .collection('comments')
      .where('taskId', '==', taskId)
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          const commentId = change.doc.id;
          const commentData = change.doc.data();
          if (change.type === 'added') {
            addComment({ commentId, commentData });
          }
          if (change.type === 'modified') {
            updateComment({ commentId, commentData });
          }
          if (change.type === 'removed') {
            deleteComment(commentId);
          }
        });
      });
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

  addComment = e => {
    if (e.type === 'keydown' && e.key !== keys.ENTER) return;
    const { userId, firebase, taskId, projectId } = this.props;
    const { newComment: content } = this.state;
    firebase.addComment({ userId, content, taskId, projectId });
    this.resetForm('newComment');
    e.preventDefault();
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

  handleClick = e => {
    const { currentFocus } = this.state;
    if (
      (currentFocus === 'newComment' &&
        !this.commentFormEl.contains(e.target)) ||
      (currentFocus === 'newSubtask' &&
        !this.newSubtaskFormEl.contains(e.target))
    ) {
      this.setState({
        currentFocus: null
      });
    }
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

  handleCommentLike = commentId => {
    const { firebase, userId, commentsById } = this.props;
    const { likes } = commentsById[commentId];

    if (likes.indexOf(userId) === -1) {
      firebase.updateComment(commentId, {
        likes: firebase.addToArray(userId)
      });
    } else {
      firebase.updateComment(commentId, {
        likes: firebase.removeFromArray(userId)
      });
    }
  };

  assignMember = userId => {
    const { taskId, projectId, assignedTo, firebase } = this.props;

    if (assignedTo.includes(userId)) {
      console.log(projectId);
      if (!projectId) return;
      const folderId = this.props.folders[userId];
      firebase.removeAssignee({ taskId, userId, folderId });
    } else {
      firebase.addAssignee({ taskId, projectId, userId });
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

  setDueDate = date => {
    const { firebase, taskId } = this.props;

    firebase.updateTask(taskId, {
      dueDate: date
    });
  };

  toggleDatePicker = () => {
    this.setState(prevState => ({
      isDatePickerActive: !prevState.isDatePickerActive
    }));
  };

  addSubtask = e => {
    if (e.type === 'keydown' && e.key !== keys.ENTER) return;
    const { userId, firebase, taskId, projectId } = this.props;
    console.log({ userId, projectId });
    const { newSubtask: name } = this.state;
    firebase.addSubtask({ userId, name, taskId, projectId });
    this.resetForm('newSubtask');
    e.preventDefault();
  };

  componentWillUnmount() {
    this.commentObserver();
  }

  render() {
    const {
      handleTaskEditorClose,
      taskId,
      commentIds,
      assignedTo,
      commentsArray,
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
      projectName,
      listName,
      projectColor
    } = this.props;
    const {
      name,
      notes,
      newComment,
      currentFocus,
      newSubtask,
      subtasks,
      isFetching,
      isColorPickerActive,
      isDatePickerActive,
      currentTag
    } = this.state;
    const hasSubtasks = subtaskIds && subtaskIds.length > 0;
    const hasComments = commentIds && commentIds.length > 0;
    const isAssigned = !!assignedTo && assignedTo.length > 0;
    const isNewCommentInvalid = newComment === '';
    const isNewSubtaskInvalid = newSubtask === '';
    const commentFormIsFocused = currentFocus === 'newComment';
    const newSubtaskFormIsFocused = currentFocus === 'newSubtask';
    const taskDueDate = dueDate
      ? dateUtils.getSimpleDate(dueDate.toDate())
      : dateUtils.getSimpleDate(new Date());
    const dueDateStr = dueDate
      ? dateUtils.toDateString(dueDate.toDate(), {
          useRelative: true,
          format: { month: 'short', day: 'numeric' }
        })
      : null;
    const isDueToday = dueDateStr === 'Today';
    const isDueTmrw = dueDateStr === 'Tomorrow';
    const isPastDue = dueDate && dateUtils.isPriorDate(dueDate.toDate());

    return (
      <TaskEditorWrapper
        handleTaskEditorClose={handleTaskEditorClose}
        handleClick={this.handleClick}
        view={view}
      >
        <Toolbar className="task-editor__toolbar">
          {projectId && (
            <TaskEditorAssignMember buttonRef={this.membersListButton}>
              <MemberSearch
                users={usersArray}
                assignedMembers={assignedTo}
                onMemberClick={this.assignMember}
              />
            </TaskEditorAssignMember>
          )}
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
            <TaskEditorSection>
              <div className="task-editor__project-name">
                <ProjectIcon
                  color={projectColor}
                  className="task-editor__project-icon"
                />
                {projectName}
              </div>
              <div className="task-editor__list-name">
                <Icon name="chevron-right" />
                {listName}
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
                      fullName={name}
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
                onClick={() => this.membersListButton.current.click()}
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
          <div className="task-editor__section-icon">
            {newSubtaskFormIsFocused ? (
              <div className="task-editor__checkbox" />
            ) : (
              <Icon name="plus-circle" />
            )}
          </div>
          <form
            name="newSubtaskForm"
            className={`task-editor__new-subtask-form ${
              currentFocus === 'newSubtask' ? 'is-focused' : ''
            }`}
            ref={el => (this.newSubtaskFormEl = el)}
            onSubmit={this.addSubtask}
          >
            <Textarea
              className="task-editor__textarea task-editor__textarea--new-subtask"
              name="newSubtask"
              value={newSubtask}
              onChange={this.onChange}
              placeholder="Add a subtask"
              onFocus={this.onFocus}
              onKeyDown={this.addSubtask}
            />
            {currentFocus === 'newSubtask' && (
              <Button
                type="submit"
                color="primary"
                size="small"
                variant="contained"
                disabled={isNewSubtaskInvalid}
                onClick={this.addSubtask}
                className="task-editor__btn--add-subtask"
              >
                Add subtask
              </Button>
            )}
          </form>
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

          {!isFetching && hasComments && (
            <div className="task-editor__comments">
              {commentsArray.map(comment => {
                const { commentId } = comment;
                return (
                  <TaskEditorComment
                    key={commentId}
                    comment={comment}
                    handleLike={this.handleCommentLike}
                  />
                );
              })}
            </div>
          )}
          <Avatar
            classes={{
              avatar: 'task-editor__avatar',
              placeholder: 'task-editor__avatar-placeholder'
            }}
            fullName={currentUser.name}
            size="sm"
            variant="circle"
            imgSrc={currentUser.photoURL}
          />
          <form
            name="commentForm"
            className={`task-editor__comment-form ${
              commentFormIsFocused ? 'is-focused' : ''
            }`}
            ref={el => (this.commentFormEl = el)}
            onSubmit={this.addComment}
          >
            <Textarea
              className="task-editor__textarea task-editor__textarea--comment"
              name="newComment"
              value={newComment}
              onChange={this.onChange}
              placeholder="Write a comment..."
              onFocus={this.onFocus}
              onKeyDown={this.addComment}
            />
            {commentFormIsFocused && (
              <Button
                type="submit"
                color="primary"
                size="small"
                variant="contained"
                disabled={isNewCommentInvalid}
                onClick={this.addComment}
                name="newCommentSubmit"
                className="task-editor__btn--submit-comment"
              >
                Send
              </Button>
            )}
          </form>
        </TaskEditorSection>
      </TaskEditorWrapper>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: currentUserSelectors.getCurrentUser(state),
    commentsArray: commentSelectors.getCommentsArray(
      state,
      ownProps.commentIds
    ),
    commentsById: commentSelectors.getCommentsById(state),
    usersArray: userSelectors.getUsersArray(state),
    membersArray: userSelectors.getMembersArray(state, ownProps.assignedTo),
    taskTags: taskSelectors.getTaskTags(state, ownProps),
    mergedTags: currentUserSelectors.getMergedTags(state),
    projectTags: projectSelectors.getProjectTags(state, ownProps.projectId),
    completedSubtasks: subtaskSelectors.getCompletedSubtasks(
      state,
      ownProps.subtaskIds
    ),
    projectColor: projectSelectors.getProjectColor(state, ownProps.projectId)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deleteTask: ({ taskId, listId }) =>
      dispatch(taskActions.deleteTask({ taskId, listId })),
    fetchTaskComments: taskId =>
      dispatch(commentActions.fetchTaskComments(taskId)),
    syncTaskComments: taskId =>
      dispatch(commentActions.syncTaskComments(taskId)),
    addComment: ({ commentId, commentData }) =>
      dispatch(commentActions.addComment({ commentId, commentData })),
    deleteComment: commentId =>
      dispatch(commentActions.deleteComment(commentId)),
    updateComment: ({ commentId, commentData }) =>
      dispatch(commentActions.updateComment({ commentId, commentData })),
    addTag: (taskId, tag) => dispatch(taskActions.addTag(taskId, tag)),
    removeTaskTag: ({ taskId, name, userId, projectId }) => dispatch(taskActions.removeTaskTag({ taskId, name, userId, projectId }))
  };
};

export default withFirebase(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TaskEditor)
);
