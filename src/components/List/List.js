import React, { Component, createElement } from 'react';
import { connect } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { withAuthorization } from '../Session';
import { taskSelectors } from '../../ducks/tasks';
import { listActions } from '../../ducks/lists';
import { projectSelectors } from '../../ducks/projects';
import { TaskComposer } from '../TaskComposer';
import { CardComposer } from '../CardComposer';
import { Icon } from '../Icon';
import { Menu, MenuItem } from '../Menu';
import { PopoverWrapper } from '../Popover';
import { Input } from '../Input';
import { Tasks } from '../Tasks';
import './List.scss';

class List extends Component {
  static defaultProps = {
    isRestricted: false
  };

  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      isMoreActionsMenuVisible: false
    };
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
    const { name, listId, firebase } = this.props;
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

  applySortRule = tasks => {
    const { sortBy } = this.props;
    switch (sortBy) {
      case 'dueDate': {
        return [...tasks].sort((a, b) => {
          const dueDateA = a.dueDate ? a.dueDate.toMillis() : null;
          const dueDateB = b.dueDate ? b.dueDate.toMillis() : null;
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
        return tasks;
      }
    }
  };

  render() {
    const {
      tasksByViewFilter,
      name: listName,
      onTaskClick,
      listId,
      index,
      isFetchingTasks,
      isRestricted,
      projectId,
      projectName,
      layout,
      viewFilter,
      sortBy
    } = this.props;
    if (isFetchingTasks) return null;

    const isBoardView = layout === 'board';
    const { name, isMoreActionsMenuVisible } = this.state;
    const tasks = this.applySortRule(tasksByViewFilter[viewFilter]);

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
                  hideLabel
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
                    size: 'medium',
                    iconOnly: true,
                    className: `list__btn--more-actions ${
                      isMoreActionsMenuVisible ? 'is-active' : ''
                    }`,
                    children: <Icon name="more-vertical" />,
                    onClick: this.toggleMoreActionsMenu
                  }}
                >
                  <Menu>
                    <MenuItem>
                      {!isRestricted && (
                        <a href="" onClick={this.handleListDelete}>
                          Delete
                        </a>
                      )}
                    </MenuItem>
                  </Menu>
                </PopoverWrapper>
              </header>
              <div className="list__content">
                <Tasks
                  sortBy={sortBy}
                  tasks={tasks}
                  listId={listId}
                  onTaskClick={onTaskClick}
                  layout={layout}
                />
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
    tasksByViewFilter: taskSelectors.getTasksByViewFilter(state, ownProps.taskIds),
    projectName: projectSelectors.getProjectName(state, ownProps.projectId)
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
