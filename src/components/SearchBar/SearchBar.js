import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from '../Button';
import { Input } from '../Input';
import { Icon } from '../Icon';
import * as keys from '../../constants/keys';
import { withOutsideClick } from '../withOutsideClick';
import { currentUserSelectors } from '../../ducks/currentUser';
import SearchSuggestions from './SearchSuggestions';
import './SearchBar.scss';

class SearchBar extends Component {
  state = {
    isExpanded: false,
    query: '',
    selectedItem: null,
    selectedIndex: null,
    hasExactMatch: null,
    filteredList: []
  };

  reset = e => {
    this.setState({
      query: '',
      isActive: false,
      selectedItem: null,
      selectedIndex: null,
      filteredList: []
    });
  };

  onChange = e => {
    const { selectedItem, filteredList } = this.state;
    const { projects, tags } = this.props;
    const newIndex = selectedItem ? filteredList.findIndex(item => item.name === selectedItem.name) : -1;
    const persistSelectedItem = newIndex !== -1;
    
    this.setState({
      query: e.target.value,
      selectedItem: persistSelectedItem
        ? selectedItem
        : null,
      selectedIndex: persistSelectedItem ? newIndex : -1,
      filteredList: [...projects, ...tags].filter(item => this.matchItem(item))
    });
  };

  onKeyDown = e => {
    if (
      e.key !== keys.TAB &&
      e.key !== keys.ARROW_DOWN &&
      e.key !== keys.ARROW_UP &&
      e.key !== keys.ENTER
    )
      return;

    const { filteredList, selectedIndex, selectedItem } = this.state;
    const nextIndex =
      selectedIndex === filteredList.length - 1 ? 0 : selectedIndex + 1;
    const prevIndex =
      selectedIndex === 0 ? filteredList.length - 1 : selectedIndex - 1;

    // eslint-disable-next-line default-case
    switch (e.key) {
      case keys.ARROW_DOWN:
      // eslint-disable-next-line no-fallthrough
      case keys.TAB: {
        this.setState({
          selectedItem: filteredList[nextIndex],
          selectedIndex: nextIndex
        });
        break;
      }
      case keys.ARROW_UP: {
        this.setState({
          selectedItem: filteredList[prevIndex],
          selectedIndex: prevIndex
        });
        break;
      }
      case keys.ENTER: {
        if (selectedItem === null) return;
        break;
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
      this.input.focus();
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

  matchItem = ({ name }) => {
    const { query } = this.state;
    if (query === '') return false;
    const regExp = new RegExp(query, 'i');
    return regExp.test(name);
  };

  inputRef = ref => {
    this.input = ref;
  };

  render() {
    const { innerRef, projects, tags } = this.props;
    const { isExpanded, selectedItem, query } = this.state;
    console.log(this.state.filteredList, selectedItem);
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
            innerRef={this.inputRef}
            hideLabel
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
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
        {query !== '' &&
        <ul className="search-suggestions__categories">
        <SearchSuggestions category="Projects" items={projects} filter={this.matchItem} selectedItem={selectedItem} />
        <SearchSuggestions category="Tags" items={tags} filter={this.matchItem} selectedItem={selectedItem} />
        </ul>
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    projects: currentUserSelectors.getCurrentUserProjects(state),
    tags: currentUserSelectors.getAllMergedTags(state)
  };
};

export default withOutsideClick(
  connect(
    mapStateToProps
  )(SearchBar)
  );
