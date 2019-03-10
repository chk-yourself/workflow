import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { withAuthorization } from '../Session';
import { taskActions, taskSelectors } from '../../ducks/tasks';
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
      name: this.props.name
    };
  }

  handleListDelete = e => {
    e.preventDefault();
    const { listId, projectId, firebase } = this.props;
    firebase.deleteList({ listId, projectId });
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
      console.log('updated list name!');
    }
  };

  render() {
    const {
      tasks,
      onTaskClick,
      listId,
      listIndex,
      isFetchingTasks,
      isRestricted,
      projectId,
      view
    } = this.props;
    if (isFetchingTasks) return null;

    const isBoardView = view === 'board';

    const { name } = this.state;

    return (
      <Draggable draggableId={listId} index={listIndex}>
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
                  classes={{
                    wrapper: 'list__popover-wrapper',
                    popover: 'list__popover'
                  }}
                  alignInner={isBoardView ? 'left' : 'right'}
                  buttonProps={{
                    size: 'medium',
                    iconOnly: true,
                    className: 'list__btn--more-actions',
                    children: <Icon name="more-vertical" />
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
                  listName={this.props.name}
                  projectId={projectId}
                  projectName={this.props.projectName}
                />
              ) : (
                <TaskComposer
                  listId={listId}
                  listName={this.props.name}
                  projectId={projectId}
                  projectName={this.props.projectName}
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
  return {};
};

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(List)
);
