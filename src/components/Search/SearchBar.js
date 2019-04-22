import React, { Component } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Icon } from '../Icon';
import './SearchBar.scss';

export default class SearchBar extends Component {
  componentDidUpdate(prevProps) {
    const { isExpanded } = this.props;
    if (isExpanded && !prevProps.isExpanded) {
      this.input.focus();
    }
    if (!isExpanded && prevProps.isExpanded) {
      this.input.blur();
    }
  }

  inputRef = ref => {
    this.input = ref;
    const { setInputRef } = this.props;
    setInputRef(ref);
  };

  render() {
    const {
      value,
      onClick,
      onChange,
      onKeyDown,
      onSubmit,
      isExpanded,
      onFocus
    } = this.props;
    return (
      <div className={`search-bar${isExpanded ? ' is-expanded' : ''} clearfix`}>
        <form className="search-form" onClick={onClick} onSubmit={onSubmit}>
          <Input
            onFocus={onFocus}
            autoComplete="off"
            value={value}
            name="search"
            className="search-form__input"
            type="text"
            innerRef={this.inputRef}
            onChange={onChange}
            onKeyDown={onKeyDown}
          />
          <Input name="submit" className="search-form__submit" type="submit" />
          <Button
            type="button"
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
