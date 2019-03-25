import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { withAuthorization } from '../Session';
import { taskActions, taskSelectors } from '../../ducks/tasks';
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

  render() {
    const {
      tasks,
      name: listName,
      onTaskClick,
      listId,
      index,
      isFetchingTasks,
      isRestricted,
      projectId,
      projectName,
      view
    } = this.props;
    if (isFetchingTasks) return null;

    const isBoardView = view === 'board';

    const { name, isMoreActionsMenuVisible } = this.state;

    return (
      <Draggable draggableId={listId} index={index}>
        {provided => (
          <>
            <section
              className={`list is-${view}-view`}
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
                  tasks={tasks}
                  listId={listId}
                  onTaskClick={onTaskClick}
                  view={view}
                />
              </div>
              {provided.placeholder}
              {isBoardView ? (
                <CardComposer
                  listId={listId}
                  listName={listName}
                  projectId={projectId}
                  projectName={projectName}
                />
              ) : (
                <TaskComposer
                  listId={listId}
                  listName={listName}
                  projectId={projectId}
                  projectName={projectName}
                />
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
    tasks: taskSelectors.getListTasks(state, ownProps.taskIds),
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
