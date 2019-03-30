import React, { Component, createRef } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Icon } from '../Icon';
import * as keys from '../../constants/keys';
import { withOutsideClick } from '../withOutsideClick';
import './SearchBar.scss';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
      query: '',
      selectedValue: '',
      focusedTag: '',
      selectedIndex: null,
      hasExactMatch: null,
      filteredList: []
    };
    this.inputEl = createRef();
  }

  onChange = e => {
    const { suggestions } = this.props;
    const { selectedValue, selectedIndex } = this.state;
    const { value } = e.target;
    const filteredList = suggestions.filter(tag => this.matchTag(tag, value));
    const hasExactMatch =
      filteredList.findIndex(item => item.name === value) !== -1;
    const newIndex = filteredList.indexOf(selectedValue);
    const persistSelectedValue = newIndex !== -1;

    this.setState({
      selectedValue: persistSelectedValue
        ? selectedValue
        : filteredList.length > 0
        ? filteredList[0].name
        : '',
      selectedIndex: persistSelectedValue ? newIndex : 0,
      value,
      filteredList: hasExactMatch
        ? filteredList
        : [...filteredList, { name: value, color: 'default' }],
      hasExactMatch
    });
  };

  onKeyDown = e => {
    if (
      e.key !== keys.TAB &&
      e.key !== keys.ARROW_DOWN &&
      e.key !== keys.ARROW_UP &&
      e.key !== keys.ENTER &&
      e.key !== keys.BACKSPACE
    )
      return;

    const {
      filteredList,
      selectedIndex,
      selectedValue,
      value,
      focusedTag
    } = this.state;
    const { addTag, removeTag, assignedTags } = this.props;
    const nextIndex =
      selectedIndex === filteredList.length - 1 || selectedIndex === null
        ? 0
        : selectedIndex + 1;
    const prevIndex =
      selectedIndex === 0 ? filteredList.length - 1 : selectedIndex - 1;

    // eslint-disable-next-line default-case
    switch (e.key) {
      case keys.ARROW_DOWN:
      // eslint-disable-next-line no-fallthrough
      case keys.TAB: {
        this.setState({
          selectedValue: filteredList[nextIndex].name,
          selectedIndex: nextIndex
        });
        break;
      }
      case keys.ARROW_UP: {
        this.setState({
          selectedValue: filteredList[prevIndex].name,
          selectedIndex: prevIndex
        });
        break;
      }
      case keys.ENTER: {
        if (selectedValue === '' && value === '') return;
        this.resetForm();
        addTag(selectedValue === '' ? value : selectedValue);
        break;
      }
      case keys.BACKSPACE: {
        if (value !== '') return;
        if (focusedTag === '') {
          this.setState({
            focusedTag: assignedTags[assignedTags.length - 1].name
          });
        } else {
          this.resetForm();
          removeTag(focusedTag);
        }
      }
    }
    e.preventDefault();
  };

  handleClick = e => {
    const { query } = this.state;
    const { name } = e.target;
    e.stopPropagation();
    if (name === 'search' || query !== '') return;
    if (name === 'toggle') {
      this.inputEl.current.focus();
    }
    this.toggleSearchBar();
  };

  toggleSearchBar = () => {
    this.setState(prevState => ({
      isExpanded: !prevState.isExpanded
    }));
  };

  handleSubmit = e => {
    e.preventDefault();
  };

  onOutsideClick = e => {
    const { isExpanded } = this.state;
    if (!isExpanded) return;
    this.toggleSearchBar();
  };

  render() {
    const { innerRef } = this.props;
    const { isExpanded } = this.state;
    return (
      <div
        ref={innerRef}
        onClick={this.handleClick}
        className={`search-bar${isExpanded ? ' is-expanded' : ''}`}
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

export default withOutsideClick(SearchBar);
