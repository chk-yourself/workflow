import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from '../Input';
import { Popover } from '../Popover';
import { Menu, MenuItem } from '../Menu';
import Autosuggestions from './Autosuggestions';
import * as keys from '../../constants/keys';
import './Autocomplete.scss';

const INITIAL_STATE = {
  query: '',
  isActive: false,
  filteredItems: [],
  selected: null,
  selectedIndex: null,
  sectionIndex: null
};

export default class Autocomplete extends Component {
  static defaultProps = {
    autosuggest: true,
    openOnFocus: false,
    multiSection: false,
    classes: {
      input: ''
    },
    items: [],
    onSelect: val => this.setState({ query: val }),
    renderItem: item => item,
    itemToString: i => (i ? String(i) : ''),
    matchItem: () => {}
  };

  static propTypes = {
    autosuggest: PropTypes.bool,
    multiSection: PropTypes.bool,
    onSelect: PropTypes.func
  };

  state = { ...INITIAL_STATE };

  onFocus = () => {
    this.setState({
      isActive: true
    });
  };

  onReset = () => {
    this.setState({ ...INITIAL_STATE });
  };

  onChange = e => {
    const { items, matchItem, multiSection } = this.props;
    const { value: query } = e.target;
    const filteredItems = !multiSection
      ? items.filter(item => matchItem(item, query))
      : items.map(section => {
          const { items: sectionItems, matchItem: matchSectionItem } = section;
          const filter = matchSectionItem || matchItem;
          return {
            ...section,
            items: sectionItems.filter(item => filter(item, query))
          };
        });
    const filteredTotal = !multiSection
      ? filteredItems.length
      : filteredItems.reduce(
          (itemsTotal, section) => itemsTotal + section.items.length,
          0
        );
    this.setState(prevState => ({
      query,
      filteredItems,
      filteredTotal,
      selectedIndex:
        prevState.selectedIndex < filteredTotal ? prevState.selectedIndex : null
    }));
  };

  onKeyDown = e => {
    if (e.key !== keys.ARROW_DOWN && e.key !== keys.ARROW_UP && e.key !== keys.ENTER)
      return;
    e.preventDefault();

    const { filteredItems, selectedIndex, filteredTotal, sectionIndex } = this.state;
    const { multiSection } = this.props;
    
    let nextSectionIndex = sectionIndex;
    let prevSectionIndex = sectionIndex;
    if (multiSection) {
      nextSectionIndex = sectionIndex === null ? 0 : sectionIndex + 1;
      prevSectionIndex = sectionIndex === null ? filteredItems.length - 1 : sectionIndex - 1;
    }

    const nextIndex =
      selectedIndex === null || selectedIndex === filteredTotal - 1
        ? 0
        : selectedIndex + 1;
    const prevIndex =
      selectedIndex === null || selectedIndex === 0
        ? filteredTotal - 1
        : selectedIndex - 1;

    switch (e.key) {
      case keys.ARROW_DOWN: {
        this.setState({
          selectedItem: filteredItems[nextIndex],
          selectedIndex: nextIndex
        });
        break;
      }
      case keys.ARROW_UP: {
        this.setState({
          selectedItem: filteredItems[prevIndex],
          selectedIndex: prevIndex
        });
        break;
      }
      case keys.ENTER: {
        if (selectedIndex === null) return;
        this.selectItem(selectedIndex);
      }
    }
  };

  getItem = ({ sectionIndex, itemIndex }) => {
    const { multiSection } = this.props;
    const { filteredItems } = this.state;

    if (multiSection) {
      return filteredItems[sectionIndex].items[itemIndex];
    }

    return filteredItems[itemIndex];
  };

  onSelectItem = e => {
    if (e.type === 'keydown' && e.key !== keys.ENTER) return;
    let { selectedIndex } = this.state;
    if (e.type === 'click') {
      selectedIndex = e.target.dataset.autosuggestIndex;
    }
    this.selectItem(selectedIndex);
  };

  selectItem = index => {
    const item = this.getItem(index);
    const { onSelect } = this.props;
    onSelect(item);
  };


  setInputRef = el => {
    this.input = el;
    const { inputRef } = this.props;
    if (inputRef) {
      inputRef(el);
    }
  };

  render() {
    const { inputProps, classes, multiSection, renderItem, itemToString } = this.props;
    const { query, isActive, filteredItems, selectedIndex } = this.state;

    return (
      <Popover
        isActive={isActive}
        classes={{ wrapper: 'autocomplete' }}
        target={
          <Input
            className={`autocomplete__input ${classes.input || ''}`}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            value={query}
            onFocus={this.onFocus}
            type="text"
            autoComplete="off"
            innerRef={this.setInputRef}
            {...inputProps}
          />
        }
      >
        <Autosuggestions
          selectedIndex={selectedIndex}
          items={filteredItems}
          multiSection={multiSection}
          onSelect={this.onSelectItem}
          renderItem={renderItem}
          itemToString={itemToString}
        />
      </Popover>
    );
  }
}
