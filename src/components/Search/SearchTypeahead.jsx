import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { Icon } from '../Icon';
import { JamIcon } from '../JamIcon';
import * as keys from '../../constants/keys';
import { currentUserSelectors } from '../../ducks/currentUser';
import SearchSuggestions from './SearchSuggestions';
import SearchBar from './SearchBar';
import { selectTask as selectTaskAction } from '../../ducks/selectedTask';
import { taskSelectors } from '../../ducks/tasks';
import { generateKey } from '../../utils/react';
import { withOutsideClick } from '../withOutsideClick';
import Mark from './Mark';
import './SearchTypeahead.scss';

class SearchTypeahead extends Component {
  state = {
    isActive: false,
    isSearchBarExpanded: false,
    query: '',
    selectedItem: null,
    selectedIndex: null,
    filteredList: []
  };

  reset = () => {
    this.setState({
      isActive: false,
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
      selectedIndex: persistSelectedItem ? newIndex : 0,
      filteredList: [null, ...projects, ...tasks, ...tags].filter(item => {
        return item === null || this.matchItem(item);
      })
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
    e.preventDefault();

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
        if (selectedItem === null) {
          this.handleSubmit(e);
          this.input.blur();
        } else {
          const { taskId, projectId, name } = selectedItem;
          if (taskId) {
            this.openTask({ taskId, projectId });
          } else if (projectId) {
            this.openProject(projectId);
          } else {
            this.openTaggedTasks(name);
          }
        }
      }
    }
  };

  onClickProject = e => {
    if (!e.target.matches('li')) return;
    this.openProject(e.target.dataset.id);
  };

  onClickTask = e => {
    if (!e.target.matches('li')) return;
    const { id: taskId, projectId } = e.target.dataset;
    this.openTask({ taskId, projectId });
  };

  onClickTag = e => {
    if (!e.target.matches('li')) return;
    this.openTaggedTasks(e.target.dataset.id);
  };

  openTaggedTasks = tag => {
    const { history } = this.props;
    history.push(`/0/tasks?tag=${tag}`);
    this.reset();
  };

  openProject = projectId => {
    const { history } = this.props;
    history.push(`/0/projects/${projectId}/tasks`);
    this.reset();
  };

  openTask = ({ taskId, projectId }) => {
    const { history, userId, selectTask } = this.props;
    if (projectId) {
      this.openProject(projectId);
    } else {
      history.push(`/0/${userId}/tasks`);
    }
    selectTask(taskId);
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
    const { history } = this.props;
    const { query } = this.state;
    if (query === '') return;
    history.push(`/0/search?q=${query}`);
    this.reset();
  };

  onOutsideClick = e => {
    const { isSearchBarExpanded, isActive, query } = this.state;
    if (
      !isSearchBarExpanded ||
      !isActive ||
      (this.suggestions && this.suggestions.contains(e.target))
    )
      return;

    if (query === '') {
      this.setState({
        isActive: false,
        isSearchBarExpanded: false
      });
    } else {
      this.toggleSuggestions();
    }
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
    return name
      .split(regExp)
      .map(text =>
        regExp.test(text) ? <Mark key={generateKey()}>{text}</Mark> : text
      );
  };

  suggestionsRef = ref => {
    this.suggestions = ref;
  };

  inputRef = ref => {
    this.input = ref;
  };

  toggleSuggestions = e => {
    this.setState(prevState => ({
      isActive: !prevState.isActive
    }));
  };

  onFocus = () => {
    const { isActive } = this.state;
    if (isActive) return;
    this.toggleSuggestions();
  };

  render() {
    const { projects, tasks, tags, innerRef } = this.props;
    const { isActive, isSearchBarExpanded, selectedItem, query } = this.state;
    return (
      <div className="search-typeahead" ref={innerRef}>
        <SearchBar
          setInputRef={this.inputRef}
          onFocus={this.onFocus}
          onClick={this.handleClick}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          onSubmit={this.handleSubmit}
          isExpanded={isSearchBarExpanded}
          value={query}
        />
        {query !== '' && isActive && (
          <ul ref={this.suggestionsRef} className="search-suggestions">
            <li
              tabIndex={0}
              onClick={this.handleSubmit}
              className={`search-suggestions__item search-suggestion ${
                selectedItem === null ? 'is-selected' : ''
              }`}
            >
              <Icon name="search" />
              Items with <Mark>{query}</Mark>
            </li>
            <SearchSuggestions
              onClick={this.onClickProject}
              category="Projects"
              items={projects.filter(item => this.matchItem(item))}
              selectedItem={selectedItem}
              query={query}
              renderMatch={item => (
                <>
                  {item.settings.layout === 'board' ? (
                    <Icon name="trello" />
                  ) : (
                    <JamIcon name="task-list" />
                  )}
                  {this.highlightMatch(item)}
                </>
              )}
            />
            <SearchSuggestions
              onClick={this.onClickTask}
              category="Tasks"
              items={tasks.filter(item => this.matchItem(item))}
              selectedItem={selectedItem}
              query={query}
              renderMatch={item => (
                <>
                  <Icon name="check-circle" />
                  {this.highlightMatch(item)}
                </>
              )}
            />
            <SearchSuggestions
              onClick={this.onClickTag}
              category="Tags"
              items={tags.filter(item => this.matchItem(item))}
              selectedItem={selectedItem}
              query={query}
              renderMatch={item => (
                <>
                  <Icon name="tag" />
                  {this.highlightMatch(item)}
                </>
              )}
            />
          </ul>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userId: currentUserSelectors.getCurrentUserId(state),
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

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withOutsideClick
)(SearchTypeahead);
