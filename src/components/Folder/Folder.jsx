import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { taskActions, taskSelectors } from '../../ducks/tasks';
import { TaskComposer } from '../TaskComposer';
import { Icon } from '../Icon';
import { Menu, MenuItem } from '../Menu';
import { PopoverWrapper } from '../Popover';
import { Input } from '../Input';
import { Tasks } from '../Tasks';
import { ExpansionPanel } from '../ExpansionPanel';
import './Folder.scss';

class Folder extends Component {
  state = {
    name: this.props.name
  };

  render() {
    const { tasks, onTaskClick, folderId, index, isRestricted } = this.props;
    const { name } = this.state;
    return (
      <Draggable
        draggableId={folderId}
        index={index}
        isDragDisabled={isRestricted}
      >
        {provided => (
          <>
            <section
              className="folder"
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <header className="folder__header">
                <Input
                  className="folder__input--title"
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
                    wrapper: 'folder__popover-wrapper',
                    popover: 'folder__popover'
                  }}
                  alignInner="right"
                  buttonProps={{
                    size: 'medium',
                    iconOnly: true,
                    className: 'folder__btn--more-actions',
                    children: <Icon name="more-vertical" />
                  }}
                >
                  <Menu>
                    <MenuItem />
                  </Menu>
                </PopoverWrapper>
              </header>
              <div className="folder__content">
                <Tasks
                  tasks={tasks}
                  listId={null}
                  folderId={folderId}
                  onTaskClick={onTaskClick}
                  view="list"
                />
              </div>
              {provided.placeholder}
              <TaskComposer
                listId={null}
                listName={null}
                projectId={null}
                projectName={null}
                folderId={folderId}
              />
            </section>
            {provided.placeholder}
          </>
        )}
      </Draggable>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    tasks: taskSelectors.getFolderTasks(state, ownProps.taskIds)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Folder);
