import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { withAuthorization } from '../Session';
import { taskActions, taskSelectors } from '../../ducks/tasks';
import { CardComposer } from '../CardComposer';
import { Icon } from '../Icon';
import { Menu, MenuItem } from '../Menu';
import { PopoverWrapper } from '../Popover';
import { Input } from '../Input';
import Cards from './Cards';
import './List.scss';

class List extends Component {
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
    const { name: newName} = this.state;

    // When field loses focus, update list title if change is detected

    if (newName !== name) {
      firebase.updateList(listId, {
        name: newName
      });
      console.log('updated list name!');
    }
  };

  render() {
    const {
      tasks,
      onTaskClick,
      listId,
      listIndex,
      isFetchingTasks
    } = this.props;
    if (isFetchingTasks) return null;

    const { name, viewportHeight } = this.state;

    return (
      <Draggable draggableId={listId} index={listIndex}>
        {provided => (
          <>
            <section
              className="list"
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <header
                className="list__header"
                ref={el => (this.listHeaderEl = el)}
              >
                <Input
                  className="list__input--title"
                  name="name"
                  type="text"
                  value={name}
                  onChange={this.onChange}
                  required
                  hideLabel
                  onBlur={this.onBlur}
                />
                <PopoverWrapper
                  classes={{
                    wrapper: 'list__popover-wrapper',
                    popover: 'list__popover'
                  }}
                  alignInner="left"
                  buttonProps={{
                    size: 'medium',
                    iconOnly: true,
                    className: 'list__btn--more-actions',
                    children: <Icon name="more-vertical" />
                  }}
                >
                  <Menu>
                    <MenuItem>
                      <a href="" onClick={this.handleListDelete}>
                        Delete
                      </a>
                    </MenuItem>
                  </Menu>
                </PopoverWrapper>
              </header>
              <div className="list__content">
              <Cards
                tasks={tasks}
                listId={listId}
                onCardClick={onTaskClick}
                onCardDelete={this.handleTaskDelete}
              />
              </div>
              {provided.placeholder}
              <CardComposer listId={listId} />
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
    tasks: taskSelectors.getListTasks(state, ownProps.taskIds)
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
