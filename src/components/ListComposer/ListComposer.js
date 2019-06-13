import React, { Component } from 'react';
import { Input } from '../Input';
import { Icon } from '../Icon';
import { withAuthorization } from '../Session';
import { Button } from '../Button';
import './ListComposer.scss';

class ListComposer extends Component {
  state = {
    name: ''
  };

  clear = () => {
    this.setState({ name: '' });
  };

  reset = () => {
    this.clear();
    const { toggle } = this.props;
    this.input.blur();
    toggle();
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
    const { toggle } = this.props;
    toggle(e);
    if (e.target.matches('button')) {
      this.input.focus();
    }
  };

  onBlur = e => {
    const { name } = this.state;
    if (name !== '') return;
    const { toggle } = this.props;
    toggle(e);
  };

  inputRef = ref => {
    this.input = ref;
    const { inputRef } = this.props;
    inputRef(ref);
  };

  render() {
    const { name } = this.state;
    const { layout, isActive } = this.props;
    return (
      <div
        className={`list-composer${
          isActive ? ' is-active' : ''
        } is-${layout}-layout`}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      >
        <form className="list-composer__form" onSubmit={this.onSubmit}>
          {!isActive && layout === 'list' && (
            <Button
              onClick={this.onFocus}
              color="primary"
              className="list-composer__btn--icon"
              iconOnly
            >
              <Icon name="plus-circle" />
            </Button>
          )}
          <Input
            innerRef={this.inputRef}
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

const condition = (currentUser, activeWorkspace) =>
  !!currentUser && !!activeWorkspace;

export default withAuthorization(condition)(ListComposer);
