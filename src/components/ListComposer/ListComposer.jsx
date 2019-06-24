import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from '../Input';
import { withAuthorization } from '../Session';
import { Button, IconButton } from '../Button';
import './ListComposer.scss';

const INITIAL_STATE = {
  name: ''
};

class ListComposer extends Component {
  static defaultProps = {
    onToggle: () => {},
    inputRef: () => null
  };

  static propTypes = {
    projectId: PropTypes.string.isRequired,
    onToggle: PropTypes.func,
    inputRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    ]),
    layout: PropTypes.oneOf(['board', 'list']).isRequired,
    isActive: PropTypes.bool.isRequired
  };

  state = { ...INITIAL_STATE };

  clear = () => {
    this.setState({ ...INITIAL_STATE });
  };

  reset = e => {
    this.clear();
    const { onToggle } = this.props;
    this.input.blur();
    onToggle(e);
  };

  onSubmit = e => {
    e.preventDefault();
    const { name } = this.state;
    if (!name) return;
    const { projectId, firebase, currentUser, activeWorkspace } = this.props;
    const { workspaceId } = activeWorkspace;
    const { userId } = currentUser;
    firebase.createList({ projectId, name, workspaceId, userId });
    this.clear();
  };

  onChange = e => {
    this.setState({
      name: e.target.value
    });
  };

  onFocus = e => {
    const { onToggle } = this.props;
    onToggle(e);
    if (e.target.matches('button')) {
      this.input.focus();
    }
  };

  onBlur = e => {
    const { name } = this.state;
    if (name !== '') return;
    const { onToggle } = this.props;
    onToggle(e);
  };

  setInputRef = el => {
    this.input = el;
    const { inputRef } = this.props;
    inputRef(el);
  };

  render() {
    const { name } = this.state;
    const { layout, isActive } = this.props;
    return (
      <div
        className={`list-composer${isActive ? ' is-active' : ''} is-${layout}-layout`}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      >
        <form className="list-composer__form" onSubmit={this.onSubmit}>
          {!isActive && layout === 'list' && (
            <IconButton
              onClick={this.onFocus}
              color="primary"
              className="list-composer__btn--icon"
              icon="plus-circle"
              label="Add list"
            />
          )}
          <Input
            innerRef={this.setInputRef}
            onChange={this.onChange}
            value={name}
            placeholder={isActive ? 'Enter list name...' : 'Add a list'}
            isRequired
            name="name"
            className="list-composer__input"
          />
          {isActive && (
            <div className="list-composer__footer">
              <Button
                className="list-composer__btn list-composer__btn--add"
                type="submit"
                onClick={this.onSubmit}
                color="primary"
                variant="contained"
                size="sm"
                disabled={!name}
              >
                Add List
              </Button>
              {layout === 'board' && (
                <Button
                  className="list-composer__btn list-composer__btn--close"
                  type="reset"
                  onClick={this.reset}
                  size="sm"
                >
                  Cancel
                </Button>
              )}
            </div>
          )}
        </form>
      </div>
    );
  }
}

const condition = (currentUser, activeWorkspace) => !!currentUser && !!activeWorkspace;

export default withAuthorization(condition)(ListComposer);
