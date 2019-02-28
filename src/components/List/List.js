import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { withAuthorization } from '../Session';
import { cardActions, cardSelectors } from '../../ducks/cards';
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
      listTitle: this.props.listTitle
    };
  }

  handleListDelete = e => {
    e.preventDefault();
    const { listId, boardId, firebase } = this.props;
    firebase.deleteList({ listId, boardId });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onBlur = e => {
    const { listTitle, listId, firebase } = this.props;
    const { listTitle: newListTitle } = this.state;

    // When field loses focus, update list title if change is detected

    if (newListTitle !== listTitle) {
      firebase.updateList(listId, {
        listTitle: newListTitle
      });
      console.log('updated!');
    }
  };

  render() {
    const {
      cards,
      onCardClick,
      listId,
      listIndex,
      isFetchingCards
    } = this.props;
    if (isFetchingCards) return null;

    const { listTitle, viewportHeight } = this.state;

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
                  name="listTitle"
                  type="text"
                  value={listTitle}
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
              <Cards
                cards={cards}
                listId={listId}
                onCardClick={onCardClick}
                onCardDelete={this.handleCardDelete}
              />
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
    cards: cardSelectors.getCardsArray(state, ownProps)
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
