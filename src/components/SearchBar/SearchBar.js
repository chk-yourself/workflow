import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { Button } from '../Button';
import { Input } from '../Input';
import { Icon } from '../Icon';
import * as keys from '../../constants/keys';
import { withOutsideClick } from '../withOutsideClick';
import { currentUserSelectors } from '../../ducks/currentUser';
import SearchSuggestions from './SearchSuggestions';
import { selectTask as selectTaskAction } from '../../ducks/selectedTask';
import { taskSelectors } from '../../ducks/tasks';
import './SearchBar.scss';

class SearchBar extends Component {
  state = {
    isExpanded: false,
    query: '',
    selectedItem: null,
    selectedIndex: null,
    filteredList: []
  };

  reset = e => {
    this.setState({
      query: '',
      isExpanded: false,
      selectedItem: null,
      selectedIndex: null,
      filteredList: []
    });
  };

  onChange = e => {
    const { selectedItem, filteredList } = this.state;
    const { projects, tags } = this.props;
    const newIndex = selectedItem
      ? filteredList.findIndex(item => item.name === selectedItem.name)
      : -1;
    const persistSelectedItem = newIndex !== -1;

    this.setState({
      query: e.target.value,
      selectedItem: persistSelectedItem ? selectedItem : null,
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
        const { history } = this.props;
        if (selectedItem === null) return;
        if (selectedItem.projectId) {
          history.push(`/0/project/${selectedItem.projectId}`);
        } else if (selectedItem.taskId) {
          const { selectTask } = this.props;
          selectTask(selectedItem.taskId);
        } else {
          history.push(`/0/search/${selectedItem.name}/tags`);
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
    history.push(`/0/search/${e.target.dataset.id}/tags`);
    this.reset();
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
    const { isExpanded, query } = this.state;
    if (!isExpanded || query !== '') return;
    this.toggleSearchBar();
  };

  matchItem = ({ name }) => {
    const { query } = this.state;
    if (query === '') return false;
    const regExp = new RegExp(`\\b${query}`, 'i');
    return regExp.test(name);
  };

  inputRef = ref => {
    this.input = ref;
  };

  render() {
    const { innerRef, projects, tasks, tags } = this.props;
    const { isExpanded, selectedItem, query } = this.state;
    return (
      <div
        ref={innerRef}
        onClick={this.handleClick}
        className={`search-bar${isExpanded ? ' is-expanded' : ''}`}
      >
        <form className="search-form" onSubmit={this.handleSubmit}>
          <Input
            autoComplete="off"
            value={query}
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
        {query !== '' && (
          <ul className="search-suggestions__categories">
            <SearchSuggestions
              onClick={this.onClickProject}
              category="Projects"
              items={projects}
              filter={this.matchItem}
              selectedItem={selectedItem}
            />
            <SearchSuggestions
              onClick={this.onClickTask}
              category="Tasks"
              items={tasks}
              filter={this.matchItem}
              selectedItem={selectedItem}
            />
            <SearchSuggestions
              onClick={this.onClickTag}
              category="Tags"
              items={tags}
              filter={this.matchItem}
              selectedItem={selectedItem}
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

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withOutsideClick
)(SearchBar);
