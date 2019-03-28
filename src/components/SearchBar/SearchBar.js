import React, { Component, createRef } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Icon } from '../Icon';
import './SearchBar.scss';

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
      query: ''
    };
    this.inputEl = createRef();
  }

  handleClick = e => {
    const { query } = this.state;
    const { name } = e.target;
    e.stopPropagation();
    if (name === 'search' || query !== '') return;
    if (name === 'toggle') {
      this.inputEl.current.focus();
    }
    this.setState(state => ({
      isExpanded: !state.isExpanded
    }));
  };

  handleSubmit = e => {
    e.preventDefault();
  };

  render() {
    return (
      <div
        onClick={this.handleClick}
        className={`search-bar${this.state.isExpanded ? ' is-expanded' : ''}`}
      >
        <form className="search-form" onSubmit={this.handleSubmit}>
          <Input
            name="search"
            className="search-form__input"
            type="text"
            innerRef={this.inputEl}
            hideLabel
          />
          <Input
            name="submit"
            className="search-form__submit"
            type="submit"
            hideLabel
          />
          <Button
            type="button"
            onClick={this.handleClick}
            className="search-form__btn"
            name="toggle"
            iconOnly
          >
            <Icon name="search" />
          </Button>
        </form>
      </div>
    );
  }
}
