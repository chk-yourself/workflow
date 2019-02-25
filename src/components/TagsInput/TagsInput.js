import React, { Component } from 'react';
import { Tag } from '../Tag';
import { Input } from '../Input';
import { ColorPicker } from '../ColorPicker';
import * as keys from '../../constants/keys';
import './TagsInput.scss';

export default class TagsInput extends Component {
  state = {
    value: '',
    isActive: false,
    isTouchEnabled: false,
    selectedTag: '',
    focusedTag: '',
    selectedIndex: null,
    hasExactMatch: null,
    filteredList: []
  };

  componentDidMount() {
    document.addEventListener('touchstart', this.handleTouch);
    document.addEventListener('click', this.handleOutsideClick, false);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.assignedTags.indexOf(undefined) !== -1) {
      return false;
    }
    return true;
  }

  componentWillUnmount() {
    const { isTouchEnabled } = this.state;

    if (isTouchEnabled) {
      document.removeEventListener('touchstart', this.handleOutsideClick);
    } else {
      document.removeEventListener('click', this.handleOutsideClick);
      document.removeEventListener('touchstart', this.handleTouch);
    }
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

  resetForm = () => {
    this.setState({
      value: '',
      selectedTag: '',
      selectedIndex: null,
      hasExactMatch: null,
      focusedTag: '',
      filteredList: []
    });
  };

  matchTag = (tag, value) => {
    const { text } = tag;
    const regExp = new RegExp(value, 'i');
    return regExp.test(text);
  };

  onChange = e => {
    const { tagSuggestions } = this.props;
    const { selectedTag, selectedIndex } = this.state;
    const { value } = e.target;
    const filteredList = tagSuggestions.filter(tag =>
      this.matchTag(tag, value)
    );
    const hasExactMatch =
      filteredList.findIndex(item => item.text === value) !== -1;
    const newIndex = filteredList.indexOf(selectedTag);
    const persistSelectedTag = newIndex !== -1;

    this.setState({
      selectedTag: persistSelectedTag
        ? selectedTag
        : filteredList.length > 0
        ? filteredList[0].text
        : '',
      selectedIndex: persistSelectedTag ? newIndex : 0,
      value,
      filteredList: hasExactMatch
        ? filteredList
        : [...filteredList, { text: value, color: 'default' }],
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

    const { filteredList, selectedIndex, selectedTag, value, focusedTag } = this.state;
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
          selectedTag: filteredList[nextIndex].text,
          selectedIndex: nextIndex
        });
        break;
      }
      case keys.ARROW_UP: {
        this.setState({
          selectedTag: filteredList[prevIndex].text,
          selectedIndex: prevIndex
        });
        break;
      }
      case keys.ENTER: {
        this.resetForm();
        addTag(selectedTag === '' ? value : selectedTag);
        break;
      }
      case keys.BACKSPACE: {
        if (value !== '') return;
        if (focusedTag === '') {
        this.setState({
          focusedTag: assignedTags[assignedTags.length - 1].text
        });
      } else {
        this.resetForm();
        removeTag(focusedTag);
      }
      }
    }
    e.preventDefault();
  };

  handleOutsideClick = e => {
    if (this.el.contains(e.target)) return;

    this.setState({
      isActive: false
    });
  };

  handleTouch = () => {
    this.setState({
      isTouchEnabled: true
    });
    // remove touch handler to prevent unnecessary refires
    document.removeEventListener('touchstart', this.handleTouch);
    // remove outside click handler from click events
    document.removeEventListener('click', this.handleOutsideClick);
    // reattach outside click handler to touchstart events
    document.addEventListener('touchstart', this.handleOutsideClick);
  };

  handleTagDelete = tag => {
    const { removeTag } = this.props;
    this.resetForm();
    removeTag(tag);
  };

  render() {
    const {
      isColorPickerActive,
      assignedTags,
      setTagColor,
      currentTag,
      removeTag
    } = this.props;
    const {
      value,
      isActive,
      filteredList,
      selectedTag,
      hasExactMatch,
      focusedTag
    } = this.state;
    console.log(assignedTags);
    console.log({ focusedTag });

    const colorPickerStyle = {};
    if (this.currentTagEl) {
      const {
        offsetLeft,
        offsetWidth,
        offsetTop,
        offsetHeight
      } = this.currentTagEl;
      colorPickerStyle.left = offsetLeft + offsetWidth / 2 - 74; // 74 = 1/2 colorPicker width
      colorPickerStyle.top = offsetTop + offsetHeight + 9; // 9 = colorPicker arrow height
    }

    return (
      <div className={`tags__container ${isActive ? 'is-active' : ''}`} ref={el => (this.el = el)}>
        {assignedTags.map(tag => (
          <Tag
            key={tag.text}
            color={tag.color}
            size="md"
            text={tag.text}
            onDelete={() => this.handleTagDelete(tag.text)}
            className={focusedTag === tag.text ? 'is-focused' : ''}
            tagRef={
              currentTag === tag.text ? el => (this.currentTagEl = el) : null
            }
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
            hideLabel
          />
          {isActive && (
            <ul className="tags-input__list">
              {filteredList.map((item, i) => {
                return (
                  <li
                    key={item.text}
                    className={`tags-input__item ${
                      selectedTag === item.text ? 'is-selected' : ''
                    } ${
                      !hasExactMatch && i === filteredList.length - 1
                        ? 'tags-input__item--new'
                        : ''
                    }`}
                  >
                    {!hasExactMatch && i === filteredList.length - 1 ? (
                      <>
                        <h4 className="tags-input__item--heading">New Tag</h4>
                        <span className="tags-input__item--text">
                          {item.text}
                        </span>
                      </>
                    ) : (
                      <Tag text={item.text} color={item.color} size="sm" />
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {isActive && isColorPickerActive && (
          <ColorPicker
            isActive={isColorPickerActive}
            selectColor={setTagColor}
            style={colorPickerStyle}
          />
        )}
      </div>
    );
  }
}
