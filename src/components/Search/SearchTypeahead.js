import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Icon } from '../Icon';
import * as keys from '../../constants/keys';
import { currentUserSelectors } from '../../ducks/currentUser';
import SearchSuggestions from './SearchSuggestions';
import SearchBar from './SearchBar';
import { selectTask as selectTaskAction } from '../../ducks/selectedTask';
import { taskSelectors } from '../../ducks/tasks';
import Highlight from './Highlight';
import './SearchTypeahead.scss';

class SearchTypeahead extends Component {
  state = {
    isSearchBarExpanded: false,
    query: '',
    selectedItem: null,
    selectedIndex: null,
    filteredList: []
  };

  reset = e => {
    this.setState({
      query: '',
      isSearchBarExpanded: false,
      selectedItem: null,
      selectedIndex: null,
      filteredList: []
    });
  };

  onChange = e => {
    const { value } = e.target;
    const { selectedItem, filteredList } = this.state;
    const { projects, tasks, tags } = this.props;
    const newIndex = selectedItem
      ? filteredList.findIndex(item => item.name === selectedItem.name)
      : -1;
    const persistSelectedItem = newIndex !== -1;
    this.setState(() => ({
      query: value,
      selectedItem: persistSelectedItem ? selectedItem : null,
      selectedIndex: persistSelectedItem ? newIndex : -1,
      filteredList: [...projects, ...tasks, ...tags].filter(item =>
        this.matchItem(item)
      )
    }));
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
        const { history } = this.props;
        if (selectedItem === null) return;
        if (selectedItem.taskId) {
          const { selectTask } = this.props;
          selectTask(selectedItem.taskId);
        } else if (selectedItem.projectId) {
          history.push(`/0/project/${selectedItem.projectId}`);
        } else {
          history.push(`/0/search?tag=${selectedItem.name}`);
        }
        this.reset();
        break;
      }
    }

    e.preventDefault();
  };

  onClickProject = e => {
    const { history } = this.props;
    if (!e.target.matches('li')) return;
    history.push(`/0/project/${e.target.dataset.id}`);
    this.reset();
  };

  onClickTask = e => {
    if (!e.target.matches('li')) return;
    const { selectTask } = this.props;
    selectTask(e.target.dataset.id);
    this.reset();
  };

  onClickTag = e => {
    const { history } = this.props;
    if (!e.target.matches('li')) return;
    history.push(`/0/search?tag=${e.target.dataset.id}`);
    this.reset();
  };

  handleClick = e => {
    const { query } = this.state;
    const { name } = e.target;
    if (name === 'search' || (name === 'submit' && query !== '')) return;
    e.stopPropagation();
    this.toggleSearchBar();
  };

  toggleSearchBar = () => {
    this.setState(prevState => ({
      isSearchBarExpanded: !prevState.isSearchBarExpanded
    }));
  };

  handleSubmit = e => {
    e.preventDefault();
  };

  onOutsideClick = e => {
    const { isSearchBarExpanded, query } = this.state;
    if (
      !isSearchBarExpanded ||
      query !== '' ||
      (this.suggestions && this.suggestions.contains(e.target))
    )
      return;
    this.toggleSearchBar();
  };

  matchItem = ({ name }) => {
    const { value } = this.input;
    if (value === '') return false;
    const regExp = new RegExp(`\\b${value}`, 'i');
    return regExp.test(name);
  };

  // If separator is a regular expression that contains capturing parentheses (), matched results are included in the array.

  highlightMatch = ({ name }) => {
    const { value } = this.input;
    if (value === '') return name;
    const regExp = new RegExp(`(\\b${value})`, 'gi');
    return name.split(regExp).map(text => (
      regExp.test(text) ? <Highlight>{text}</Highlight> : text
    ));
  };

  suggestionsRef = ref => {
    this.suggestions = ref;
  };

  inputRef = ref => {
    this.input = ref;
  };

  render() {
    const { projects, tasks, tags } = this.props;
    const { isSearchBarExpanded, selectedItem, query } = this.state;
    return (
      <div className="search-typeahead">
        <SearchBar
          setInputRef={this.inputRef}
          onClick={this.handleClick}
          onOutsideClick={this.onOutsideClick}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          onSubmit={this.handleSubmit}
          isExpanded={isSearchBarExpanded}
          value={query}
        />
        {query !== '' && (
          <ul
            ref={this.suggestionsRef}
            className="search-suggestions__categories"
          >
            <SearchSuggestions
              onClick={this.onClickProject}
              category="Projects"
              items={projects}
              filter={this.matchItem}
              selectedItem={selectedItem}
              query={query}
              highlight={this.highlightMatch}
            />
            <SearchSuggestions
              onClick={this.onClickTask}
              category="Tasks"
              items={tasks}
              filter={this.matchItem}
              selectedItem={selectedItem}
              query={query}
              highlight={this.highlightMatch}
            />
            <SearchSuggestions
              onClick={this.onClickTag}
              category="Tags"
              items={tags}
              filter={this.matchItem}
              selectedItem={selectedItem}
              query={query}
              highlight={this.highlightMatch}
            />
          </ul>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    projects: currentUserSelectors.getCurrentUserProjects(state),
    tags: currentUserSelectors.getAllMergedTags(state),
    tasks: taskSelectors.getTasksArray(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectTask: taskId => dispatch(selectTaskAction(taskId))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SearchTypeahead)
);
