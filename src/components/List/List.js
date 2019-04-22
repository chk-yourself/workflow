import React, { Component, createElement } from 'react';
import { connect } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { withAuthorization } from '../Session';
import { taskSelectors } from '../../ducks/tasks';
import { listActions, listSelectors } from '../../ducks/lists';
import { TaskComposer } from '../TaskComposer';
import { CardComposer } from '../CardComposer';
import { Icon } from '../Icon';
import { Menu, MenuItem } from '../Menu';
import { PopoverWrapper } from '../Popover';
import { Input } from '../Input';
import { Tasks } from '../Tasks';
import { Button } from '../Button';
import './List.scss';

class List extends Component {
  static defaultProps = {
    isRestricted: false
  };

  state = {
    name: this.props.list ? this.props.list.name : '',
    prevName: this.props.list ? this.props.list.name : '',
    isMoreActionsMenuVisible: false
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

  handleListDelete = e => {
    e.preventDefault();
    const { listId, projectId, deleteList } = this.props;
    deleteList({ listId, projectId });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onBlur = e => {
    const { list, listId, firebase } = this.props;
    const { name } = list;
    const { name: newName } = this.state;

    // When field loses focus, update list title if change is detected

    if (newName !== name) {
      firebase.updateListName({ listId, name: newName });
    }
  };

  toggleMoreActionsMenu = e => {
    this.setState(prevState => ({
      isMoreActionsMenuVisible: !prevState.isMoreActionsMenuVisible
    }));
  };

  closeMoreActionsMenu = e => {
    this.setState({
      isMoreActionsMenuVisible: false
    });
  };

  applySortRule = taskIds => {
    const { sortBy, tasksById } = this.props;
    switch (sortBy) {
      case 'dueDate': {
        return [...taskIds].sort((a, b) => {
          const taskA = tasksById[a];
          const taskB = tasksById[b];
          const dueDateA =
            taskA && taskA.dueDate ? taskA.dueDate.toMillis() : null;
          const dueDateB =
            taskB && taskB.dueDate ? taskB.dueDate.toMillis() : null;
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
    const { name, isMoreActionsMenuVisible } = this.state;
    const taskIds = this.applySortRule(taskIdsByViewFilter[viewFilter]);

    return (
      <Draggable draggableId={listId} index={index}>
        {provided => (
          <>
            <section
              className={`list is-${layout}-layout`}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <header className="list__header">
                <Input
                  className="list__input--title"
                  name="name"
                  type="text"
                  value={name}
                  onChange={this.onChange}
                  required={!isRestricted}
                  isReadOnly={isRestricted}
                  onBlur={this.onBlur}
                />
                <PopoverWrapper
                  isActive={isMoreActionsMenuVisible}
                  onOutsideClick={this.closeMoreActionsMenu}
                  classes={{
                    wrapper: 'list__popover-wrapper',
                    popover: 'list__popover'
                  }}
                  align={{ inner: 'right' }}
                  buttonProps={{
                    size: 'md',
                    iconOnly: true,
                    isActive: isMoreActionsMenuVisible,
                    className: 'list__btn--more-actions',
                    children: <Icon name="more-vertical" />,
                    onClick: this.toggleMoreActionsMenu
                  }}
                >
                  <Menu>
                    <MenuItem className="list__more-actions-item">
                      {!isRestricted && (
                        <Button
                          className="list__btn"
                          onClick={this.handleListDelete}
                        >
                          Delete
                        </Button>
                      )}
                    </MenuItem>
                  </Menu>
                </PopoverWrapper>
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
