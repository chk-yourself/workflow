import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { taskActions, taskSelectors } from '../../ducks/tasks';
import { TaskComposer } from '../TaskComposer';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Menu, MenuItem } from '../Menu';
import { PopoverWrapper } from '../Popover';
import { Input } from '../Input';
import { Tasks } from '../Tasks';
import { ExpansionPanel } from '../ExpansionPanel';
import './Folder.scss';

class Folder extends Component {
  state = {
    name: this.props.name,
    isExpanded: this.props.taskIds.length > 0
  };

  toggleFolder = e => {
    if (e.target.matches('.folder__btn--more-actions')) return;
    this.setState(prevState => ({
      isExpanded: !prevState.isExpanded
    }));
  };

  render() {
    const { tasks, onTaskClick, folderId, index, isRestricted } = this.props;
    const { name, isExpanded } = this.state;
    return (
      <Draggable
        draggableId={folderId}
        index={index}
        isDragDisabled={isRestricted}
      >
        {provided => (
          <>
            <ExpansionPanel
              isExpanded={isExpanded}
              onToggle={this.toggleFolder}
              classes={{ panel: 'folder' }}
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
                      required={!isRestricted}
                      hideLabel
                      isReadOnly={isRestricted}
                      onBlur={this.onBlur}
                      onClick={this.toggleFolder}
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
                  </>
                )
              }}
            >
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
            </ExpansionPanel>
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
