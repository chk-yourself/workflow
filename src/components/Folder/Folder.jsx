import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { taskSelectors } from '../../ducks/tasks';
import { currentUserSelectors } from '../../ducks/currentUser';
import { TaskComposer } from '../TaskComposer';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Menu, MenuItem } from '../Menu';
import { PopoverWrapper } from '../Popover';
import { Input } from '../Input';
import { Tasks } from '../Tasks';
import { ExpansionPanel } from '../ExpansionPanel';
import * as droppableTypes from '../../constants/droppableTypes';
import './Folder.scss';

class Folder extends Component {
  static defaultProps = {
    userPermissions: {
      enableNameChange: false,
      enableTaskAdd: true,
      enableDragnDrop: true
    }
  };

  state = {
    name: this.props.name,
    isExpanded: this.props.taskIds.length > 0,
    prevProps: {
      taskIds: this.props.taskIds
    }
  };

  static getDerivedStateFromProps(props, state) {
    if (state.prevProps.taskIds.length === 0 && props.taskIds.length > 0 && !state.isExpanded) {
      return {
        isExpanded: true,
        prevProps: {
          ...state.prevProps,
          taskIds: props.taskIds
        }
      };
    }
    return null;
  }

  toggleFolder = e => {
    if (e.target.matches('.folder__btn--more-actions')) return;
    this.setState(prevState => ({
      isExpanded: !prevState.isExpanded
    }));
  };

  render() {
    const {
      tasks,
      onTaskClick,
      projectId,
      projectName,
      folderId,
      index,
      dueDate,
      userPermissions,
      tempTaskSettings
    } = this.props;
    const { name, isExpanded } = this.state;
    return (
      <Draggable
        draggableId={folderId || projectId || `${dueDate}`}
        index={index}
        isDragDisabled={!userPermissions.enableNameChange}
      >
        {(provided, snapshot) => (
          <>
            <ExpansionPanel
              isExpanded={isExpanded}
              onToggle={this.toggleFolder}
              classes={{ panel: 'folder', content: 'folder__content' }}
              innerRef={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              header={{
                className: 'folder__header',
                children: (
                  <>
                    <Button
                      type="button"
                      size="sm"
                      className={`folder__btn--toggle ${
                        isExpanded ? 'is-expanded' : ''
                      }`}
                      iconOnly
                    >
                      <Icon name="chevron-right" />
                    </Button>
                    <Input
                      className="folder__input--title"
                      name="name"
                      type="text"
                      value={name}
                      onChange={this.onChange}
                      required={userPermissions.enableNameChange}
                      hideLabel
                      isReadOnly={!userPermissions.enableNameChange}
                      onBlur={this.onBlur}
                      onClick={this.toggleFolder}
                    />
                    {/*
                    <PopoverWrapper
                      classes={{
                        wrapper: 'folder__popover-wrapper',
                        popover: 'folder__popover'
                      }}
                      align={{ inner: 'right' }}
                      buttonProps={{
                        size: 'md',
                        iconOnly: true,
                        className: 'folder__btn--more-actions',
                        children: <Icon name="more-vertical" />
                      }}
                    >
                      <Menu>
                        <MenuItem />
                      </Menu>
                    </PopoverWrapper>
                    */}
                  </>
                )
              }}
            >
              <div className="folder__tasks">
                <Tasks
                  tasks={tasks}
                  listId={null}
                  folderId={folderId}
                  projectId={projectId}
                  dueDate={dueDate}
                  onTaskClick={onTaskClick}
                  isDragDisabled={!userPermissions.enableDragNDrop}
                  dropType={!userPermissions.enableTaskAdd ? (projectId || folderId || dueDate) : droppableTypes.TASK }
                  layout="list"
                />
              </div>
              {userPermissions.enableTaskAdd && (
                <TaskComposer
                  listId={null}
                  listName={null}
                  dueDate={dueDate}
                  projectId={projectId}
                  projectName={projectName}
                  folderId={folderId}
                />
              )}
            </ExpansionPanel>
          </>
        )}
      </Draggable>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    tasks: taskSelectors.getFolderTasks(state, ownProps.taskIds),
    tempTaskSettings: currentUserSelectors.getTempTaskSettings(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Folder);
