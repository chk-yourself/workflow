import React, { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { withAuthorization } from '../Session';
import { taskSelectors } from '../../ducks/tasks';
import { listActions, listSelectors } from '../../ducks/lists';
import { TaskComposer } from '../TaskComposer';
import { CardComposer } from '../CardComposer';
import { Input } from '../Input';
import { Tasks } from '../Tasks';
import { Confirm } from '../Confirm';
import MoreListActions from './MoreListActions';
import './List.scss';

class List extends Component {
  static defaultProps = {
    isRestricted: false
  };

  static propTypes = {
    isRestricted: PropTypes.bool,
    listId: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    layout: PropTypes.oneOf(['board', 'list']).isRequired,
    index: PropTypes.number.isRequired
  };

  state = {
    name: this.props.list ? this.props.list.name : '',
    prevName: this.props.list ? this.props.list.name : '',
    isFocused: false,
    pointX: null,
    pointY: null
  };

  static getDerivedStateFromProps(props, state) {
    if (props.list.name !== state.prevName) {
      return {
        name: props.list.name,
        prevName: props.list.name
      };
    }
    return null;
  }

  setInputRef = el => {
    this.input = el;
  };

  handleDelete = e => {
    e.preventDefault();
    const { listId, projectId, deleteList } = this.props;
    deleteList({ listId, projectId });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onBlur = () => {
    const { list, listId, firebase } = this.props;
    const { name: prevName } = list;
    const { name } = this.state;
    const newState = {
      isFocused: false
    };

    if (name !== prevName) {
      if (name === '') {
        newState.name = prevName; // prevent nameless lists
      } else {
        firebase.updateListName({ listId, name });
      }
    }

    this.setState({ ...newState });
  };

  onFocus = () => {
    this.setState({
      isFocused: true
    });
  };

  applySortRule = taskIds => {
    const { sortBy, tasksById } = this.props;
    switch (sortBy) {
      case 'dueDate': {
        return [...taskIds].sort((a, b) => {
          const taskA = tasksById[a];
          const taskB = tasksById[b];
          const dueDateA = taskA && taskA.dueDate ? taskA.dueDate.toMillis() : null;
          const dueDateB = taskB && taskB.dueDate ? taskB.dueDate.toMillis() : null;
          if (!dueDateA && dueDateB) {
            return 1;
          }
          if (dueDateA && !dueDateB) {
            return -1;
          }
          if (!dueDateA && !dueDateB) {
            return 0;
          }
          return dueDateA - dueDateB;
        });
      }
      default: {
        return taskIds;
      }
    }
  };

  onMouseDown = e => {
    if (e.target.matches('input') || e.target.matches('label')) return;
    this.setState({
      pointX: e.pageX,
      pointY: e.pageY
    });
  };

  onMouseUp = e => {
    const { pointX, pointY, isFocused } = this.state;
    if (isFocused) return;
    if (e.pageX === pointX && e.pageY === pointY) {
      this.input.focus();
    }
    this.setState({
      pointX: null,
      pointY: null
    });
  };

  render() {
    const {
      taskIdsByViewFilter,
      listId,
      index,
      isRestricted,
      projectId,
      projectName,
      layout,
      viewFilter,
      list
    } = this.props;
    if (!list) return null;
    const { name: listName } = list;
    const isBoardView = layout === 'board';
    const { name, isFocused } = this.state;
    const taskIds = this.applySortRule(taskIdsByViewFilter[viewFilter]);

    return (
      <Confirm>
        {confirm => (
          <Draggable draggableId={listId} index={index}>
            {(provided, snapshot) => (
              <>
                <section
                  className={`list is-${layout}-layout ${isFocused ? 'is-focused' : ''} ${
                    snapshot.isDragging ? 'is-dragging' : ''
                  }`}
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <header className="list__header">
                    <div
                      className="list__input-wrapper"
                      onMouseDown={this.onMouseDown}
                      onMouseUp={this.onMouseUp}
                    >
                      <Input
                        className="list__input--title"
                        name="name"
                        type="text"
                        value={name}
                        onChange={this.onChange}
                        required={!isRestricted}
                        isReadOnly={isRestricted}
                        onBlur={this.onBlur}
                        onFocus={this.onFocus}
                        innerRef={this.setInputRef}
                      />
                    </div>
                    <MoreListActions
                      isRestricted={isRestricted}
                      onDelete={confirm(this.handleDelete, {
                        label: 'Delete List',
                        intent: 'danger',
                        title: `Delete "${listName}" list?`
                      })}
                    />
                  </header>
                  <div className="list__content">
                    <Tasks taskIds={taskIds} listId={listId} layout={layout} />
                  </div>
                  {provided.placeholder}
                  {createElement(
                    isBoardView ? CardComposer : TaskComposer,
                    {
                      listId,
                      listName,
                      projectId,
                      projectName
                    },
                    null
                  )}
                </section>
                {provided.placeholder}
              </>
            )}
          </Draggable>
        )}
      </Confirm>
    );
  }
}

const condition = authUser => !!authUser;

const mapStateToProps = (state, ownProps) => {
  return {
    taskIdsByViewFilter: taskSelectors.getTaskIdsByViewFilter(state, {
      listId: ownProps.listId
    }),
    tasksById: taskSelectors.getTasksById(state),
    list: listSelectors.getList(state, ownProps.listId)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deleteList: ({ listId, projectId }) =>
      dispatch(listActions.deleteList({ listId, projectId }))
  };
};

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(List)
);
