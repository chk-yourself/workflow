import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withAuthorization } from '../Session';
import { Tag } from '../Tag';
import { Input } from '../Input';
import { ColorPicker } from '../ColorPicker';
import { withOutsideClick } from '../withOutsideClick';
import { taskActions } from '../../ducks/tasks';
import { projectSelectors } from '../../ducks/projects';
import * as keys from '../../constants/keys';
import './TagsInput.scss';

class TagsInput extends Component {
  state = {
    value: '',
    isActive: false,
    isColorPickerActive: false,
    selectedTag: '',
    currentTag: null,
    focusedTag: '',
    selectedIndex: null,
    hasExactMatch: null,
    filteredList: []
  };

  shouldComponentUpdate(nextProps) {
    if (nextProps.assignedTags.indexOf(undefined) !== -1) {
      return false;
    }
    return true;
  }

  onFocus = () => {
    this.setState({
      isActive: true
    });
  };

  onBlur = () => {
    this.setState({
      selectedTag: '',
      selectedIndex: null
    });
  };

  reset = () => {
    this.setState({
      value: '',
      isColorPickerActive: false,
      selectedTag: '',
      selectedIndex: null,
      hasExactMatch: null,
      focusedTag: '',
      currentTag: null,
      filteredList: []
    });
  };

  matchTag = (tag, value) => {
    const { name } = tag;
    const regExp = new RegExp(value, 'i');
    return regExp.test(name);
  };

  onChange = e => {
    const { tagSuggestions } = this.props;
    const { selectedTag } = this.state;
    const { value } = e.target;
    const filteredList = tagSuggestions.filter(tag =>
      this.matchTag(tag, value)
    );
    const hasExactMatch =
      filteredList.findIndex(item => item.name === value) !== -1;
    const newIndex = filteredList.indexOf(selectedTag);
    const persistSelectedTag = newIndex !== -1;

    this.setState({
      selectedTag: persistSelectedTag
        ? selectedTag
        : filteredList.length > 0
        ? filteredList[0].name
        : '',
      selectedIndex: persistSelectedTag ? newIndex : 0,
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
      selectedTag,
      value,
      focusedTag
    } = this.state;
    const { assignedTags } = this.props;
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
          selectedTag: filteredList[nextIndex].name,
          selectedIndex: nextIndex
        });
        break;
      }
      case keys.ARROW_UP: {
        this.setState({
          selectedTag: filteredList[prevIndex].name,
          selectedIndex: prevIndex
        });
        break;
      }
      case keys.ENTER: {
        if (selectedTag === '' && value === '') return;
        this.reset();
        this.addTag(selectedTag === '' ? value : selectedTag);
        break;
      }
      case keys.BACKSPACE: {
        if (value !== '') return;
        if (focusedTag === '') {
          this.setState({
            focusedTag: assignedTags[assignedTags.length - 1].name
          });
        } else {
          this.removeTag(focusedTag);
        }
      }
    }
    e.preventDefault();
  };

  onOutsideClick = e => {
    if (e.target.matches('.tags-input__item')) return;
    this.setState({
      isActive: false
    });
  };

  toggleColorPicker = () => {
    this.setState(prevState => ({
      isColorPickerActive: !prevState.isColorPickerActive
    }));
  };

  hideColorPicker = () => {
    const { isColorPickerActive } = this.state;
    if (!isColorPickerActive) return;
    this.toggleColorPicker();
  };

  addTag = name => {
    const {
      firebase,
      currentUser,
      projectTags,
      taskId,
      projectId
    } = this.props;
    const { userId, tags: userTags } = currentUser;
    const isProjectTag = projectTags && name in projectTags;
    const isUserTag = userTags && name in userTags;
    const projectTag = isProjectTag ? projectTags[name] : null;
    const userTag = isUserTag ? userTags[name] : null;
    const tagData = isProjectTag
      ? { ...projectTag }
      : isUserTag
      ? { ...userTag }
      : { name };

    firebase
      .addTag({
        userId,
        taskId,
        projectId,
        ...tagData
      })
      .then(() => {
        if (!isUserTag && !isProjectTag) {
          this.setState({
            currentTag: name
          });
          this.toggleColorPicker();
        }
      });
  };

  setTagColor = color => {
    const { taskId, currentUser, projectId, firebase } = this.props;
    const { userId } = currentUser;
    const { currentTag: tag } = this.state;
    firebase.setTagColor({ userId, projectId, taskId, tag, color });
  };

  removeTag = name => {
    const { firebase, taskId, currentUser, projectId, removeTaskTag } = this.props;
    const { userId } = currentUser;
    firebase.removeTag({ taskId, name, userId, projectId });
    /*
    removeTaskTag({ taskId, name, userId, projectId });
    */
    this.setState({
      isColorPickerActive: false,
      focusedTag: '',
      currentTag: null
    });
  };

  setCurrentTagRef = ref => {
    this.currentTag = ref;
  };

  onClickSuggestion = e => {
    if (!e.target.matches('.tags-input__item')) return;
    const { tag } = e.target.dataset;
    this.reset();
    this.addTag(tag);
  };

  render() {
    const { assignedTags, innerRef } = this.props;
    const {
      value,
      isActive,
      isColorPickerActive,
      filteredList,
      selectedTag,
      currentTag,
      hasExactMatch,
      focusedTag
    } = this.state;

    const hasTags = assignedTags && assignedTags.length > 0;

    const colorPickerStyle = {};
    if (this.currentTag) {
      const {
        offsetLeft,
        offsetWidth,
        offsetTop,
        offsetHeight
      } = this.currentTag;
      colorPickerStyle.left = offsetLeft + offsetWidth / 2 - 74; // 74 = 1/2 colorPicker width
      colorPickerStyle.top = offsetTop + offsetHeight + 9; // 9 = colorPicker arrow height
    }

    return (
      <div
        className={`tags__container ${isActive ? 'is-active' : ''} ${
          !hasTags ? 'no-tags' : ''
        }`}
        ref={innerRef}
      >
        {assignedTags.map(tag => (
          <Tag
            key={tag.name}
            color={tag.color}
            size="md"
            name={tag.name}
            onDelete={() => this.removeTag(tag.name)}
            isFocused={focusedTag === tag.name}
            innerRef={currentTag === tag.name ? this.setCurrentTagRef : null}
            isLinkDisabled
          />
        ))}
        <div className="tags-input__wrapper">
          <Input
            className="tags-input"
            onChange={this.onChange}
            onBlur={this.onBlur}
            value={value}
            onFocus={this.onFocus}
            type="text"
            autoComplete="off"
            onKeyDown={this.onKeyDown}
          />
          {isActive && (
            <ul className="tags-input__list">
              {filteredList.map((item, i) => {
                return (
                  <li
                    key={item.name}
                    data-tag={item.name}
                    onClick={this.onClickSuggestion}
                    tabIndex={0}
                    className={`tags-input__item ${
                      selectedTag === item.name ? 'is-selected' : ''
                    } ${
                      !hasExactMatch && i === filteredList.length - 1
                        ? 'tags-input__item--new'
                        : ''
                    }`}
                  >
                    {!hasExactMatch && i === filteredList.length - 1 ? (
                      <>
                        <span className="tags-input__item--heading">
                          New Tag
                        </span>
                        <span className="tags-input__item--name">
                          {item.name}
                        </span>
                      </>
                    ) : (
                      <Tag name={item.name} color={item.color} size="sm" />
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {isActive && (
          <ColorPicker
            isActive={isColorPickerActive}
            selectColor={this.setTagColor}
            style={colorPickerStyle}
            onOutsideClick={this.hideColorPicker}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  projectTags: projectSelectors.getProjectTags(state, ownProps.projectId)
});

const mapDispatchToProps = dispatch => ({
  removeTaskTag: ({ taskId, name, userId, projectId }) =>
    dispatch(taskActions.removeTaskTag({ taskId, name, userId, projectId }))
});

const condition = currentUser => !!currentUser;

export default compose(
  withAuthorization(condition),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withOutsideClick
)(TagsInput);
