import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { TaskComposer } from '../TaskComposer';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Menu, MenuItem } from '../Menu';
import { Popover } from '../Popover';
import { Input } from '../Input';
import { Tasks } from '../Tasks';
import { ExpansionPanel } from '../ExpansionPanel';
import * as droppableTypes from '../../constants/droppableTypes';
import './Folder.scss';

export default class Folder extends Component {
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
    if (
      state.prevProps.taskIds.length === 0 &&
      props.taskIds.length > 0 &&
      !state.isExpanded
    ) {
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
      taskIds,
      projectId,
      projectName,
      folderId,
      index,
      dueDate,
      userPermissions
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
              classes={{
                panel: 'folder',
                content: 'folder__content',
                header: 'folder__header'
              }}
              innerRef={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              header={
                <>
                  <Button
                    type="button"
                    size="sm"
                    className="folder__btn--toggle"
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
                    isRequired={userPermissions.enableNameChange}
                    isReadOnly={!userPermissions.enableNameChange}
                    onBlur={this.onBlur}
                    onClick={this.toggleFolder}
                  />
                  {/*
                    <Popover
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
                    </Popover>
                    */}
                </>
              }
            >
              <div className="folder__tasks">
                <Tasks
                  taskIds={taskIds}
                  listId={null}
                  folderId={folderId}
                  projectId={projectId}
                  dueDate={dueDate}
                  isDragDisabled={!userPermissions.enableDragNDrop}
                  dropType={
                    !userPermissions.enableTaskAdd
                      ? projectId || folderId || dueDate
                      : droppableTypes.TASK
                  }
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
