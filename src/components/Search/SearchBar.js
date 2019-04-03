import React, { Component } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Icon } from '../Icon';
import { withOutsideClick } from '../withOutsideClick';
import './SearchBar.scss';

class SearchBar extends Component {

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

  onClick = e => {
    console.log(e.target);
  };

  render() {
    const {
      innerRef,
      value,
      onClick,
      onChange,
      onKeyDown,
      onSubmit,
      isExpanded
    } = this.props;
    return (
      <div
        ref={innerRef}
        className={`search-bar${isExpanded ? ' is-expanded' : ''}`}
      >
        <form className="search-form" onClick={onClick} onSubmit={onSubmit}>
          <Input
            autoComplete="off"
            value={value}
            name="search"
            className="search-form__input"
            type="text"
            innerRef={this.inputRef}
            hideLabel
            onChange={onChange}
            onKeyDown={onKeyDown}
          />
          <Input
            name="submit"
            className="search-form__submit"
            type="submit"
            hideLabel
          />
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

export default withOutsideClick(SearchBar);
