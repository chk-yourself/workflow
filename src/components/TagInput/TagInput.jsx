import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withAuthorization } from '../Session';
import { Tag } from '../Tag';
import { Input } from '../Input';
import { ColorPicker } from '../ColorPicker';
import { projectSelectors } from '../../ducks/projects';
import * as keys from '../../constants/keys';
import TagSuggestions from './TagSuggestions';
import './TagInput.scss';

const INITIAL_STATE = {
  value: '',
  isColorPickerActive: false,
  selectedTag: '',
  selectedIndex: null,
  hasExactMatch: null,
  currentTag: null,
  focusedTag: '',
  filteredList: []
};

class TagInput extends Component {
  static defaultProps = {
    inputProps: {}
  };

  static propTypes = {
    taskId: PropTypes.string.isRequired,
    inputProps: PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
        PropTypes.func
      ])
    )
  };

  state = { ...INITIAL_STATE, isActive: false };

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
      ...INITIAL_STATE
    });
  };

  matchTag = (tag, value) => {
    const { name } = tag;
    const regExp = new RegExp(`\\b${value}`, 'i');
    return regExp.test(name);
  };

  onChange = e => {
    const { tagSuggestions } = this.props;
    const { selectedTag } = this.state;
    const { value } = e.target;
    const filteredList = tagSuggestions.filter(tag => this.matchTag(tag, value));
    const hasExactMatch = filteredList.findIndex(item => item.name === value) !== -1;
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
      e.key !== keys.ARROW_DOWN &&
      e.key !== keys.ARROW_UP &&
      e.key !== keys.ENTER &&
      e.key !== keys.BACKSPACE
    )
      return;

    const { filteredList, selectedIndex, selectedTag, value, focusedTag } = this.state;
    const { assignedTags } = this.props;
    const nextIndex =
      selectedIndex === filteredList.length - 1 || selectedIndex === null
        ? 0
        : selectedIndex + 1;
    const prevIndex = selectedIndex === 0 ? filteredList.length - 1 : selectedIndex - 1;

    // eslint-disable-next-line default-case
    switch (e.key) {
      case keys.ARROW_DOWN: {
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

  onContainerBlur = () => {
    this.timeoutId = setTimeout(() => {
      this.setState({
        isActive: false
      });
    });
  };

  // Cancel blur event if next active element is a descendant of the container element
  onContainerFocus = () => {
    clearTimeout(this.timeoutId);
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
    const { firebase, currentUser, projectTags, taskId, projectId } = this.props;
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
    const { firebase, taskId, currentUser, projectId } = this.props;
    const { userId } = currentUser;
    firebase.removeTag({ taskId, name, userId, projectId });
    this.setState({
      isColorPickerActive: false,
      focusedTag: '',
      currentTag: null
    });
  };

  setCurrentTagRef = ref => {
    this.currentTag = ref;
  };

  setInputRef = el => {
    this.input = el;
  };

  onClickSuggestion = e => {
    if (!e.target.matches('.tag-input__item')) return;
    const { tag } = e.target.dataset;
    this.reset();
    this.addTag(tag);
    if (this.input) {
      this.input.focus();
    }
  };

  render() {
    const { assignedTags, innerRef, inputProps } = this.props;
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
      const { offsetLeft, offsetWidth, offsetTop, offsetHeight } = this.currentTag;
      colorPickerStyle.left = offsetLeft + offsetWidth / 2 - 74; // 74 = 1/2 colorPicker width
      colorPickerStyle.top = offsetTop + offsetHeight + 9; // 9 = colorPicker arrow height
    }

    return (
      <div
        className={`tag-input__container ${isActive ? 'is-active' : ''} ${
          !hasTags ? 'no-tags' : ''
        }`}
        ref={innerRef}
        onBlur={this.onContainerBlur}
        onFocus={this.onContainerFocus}
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
          />
        ))}
        <div className="tag-input__wrapper">
          <Input
            className="tag-input"
            onChange={this.onChange}
            onBlur={this.onBlur}
            value={value}
            onFocus={this.onFocus}
            type="text"
            autoComplete="off"
            onKeyDown={this.onKeyDown}
            innerRef={this.setInputRef}
            {...inputProps}
          />
          {isActive && (
            <TagSuggestions
              items={filteredList}
              selectedTag={selectedTag}
              hasExactMatch={hasExactMatch}
              onClick={this.onClickSuggestion}
            />
          )}
        </div>
        <ColorPicker
          isActive={isColorPickerActive}
          selectColor={this.setTagColor}
          style={colorPickerStyle}
          onOutsideClick={this.hideColorPicker}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  projectTags: projectSelectors.getProjectTags(state, ownProps.projectId)
});

const condition = currentUser => !!currentUser;

export default compose(
  withAuthorization(condition),
  connect(mapStateToProps)
)(TagInput);
