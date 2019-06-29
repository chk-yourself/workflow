import React from 'react';
import PropTypes from 'prop-types';
import { Menu, MenuItem } from '../Menu';
import Autosuggestion from './Autosuggestion';

function getAutosuggestIndex(items, sectionIndex, itemIndex) {
  if (sectionIndex === 0) return itemIndex;
  let i = sectionIndex;
  let count = itemIndex;
  while (i > 0) {
    count += items[i - 1].items.length;
    i -= 1;
  }
  return count;
}

function getSelectedItemByIndex(items, index) {}

const Autosuggestions = ({
  items,
  multiSection,
  onSelect,
  selectedIndex,
  classes,
  renderItem,
  itemToString
}) => {
  return (
    <Menu className={classes.menu || ''}>
      {items.map((item, i) => {
        return !multiSection ? (
          <Autosuggestion
            key={i}
            index={i}
            onSelect={onSelect}
            isSelected={selectedIndex === i}
            item={item}
            value={itemToString(item)}
            renderItem={renderItem}
            className={classes.suggestion || ''}
          />
        ) : (
          <MenuItem className={classes.title || ''} key={i}>
            {item.title}
            <Menu className={classes.section || ''}>
              {item.items.map((option, k) => {
                const index = getAutosuggestIndex(items, i, k);
                return (
                  <Autosuggestion
                    key={index}
                    index={index}
                    onSelect={onSelect}
                    isSelected={selectedIndex === k}
                    renderItem={item.renderItem || renderItem}
                    className={classes.suggestion || ''}
                  />
                );
              })}
            </Menu>
          </MenuItem>
        );
      })}
    </Menu>
  );
};

Autosuggestions.defaultProps = {
  onSelect: () => {},
  renderItem: () => {},
  classes: {
    menu: '',
    title: '',
    section: '',
    suggestion: ''
  },
  multiSection: false,
  items: []
};

Autosuggestions.propTypes = {
  onSelect: PropTypes.func,
  renderItem: PropTypes.func,
  classes: PropTypes.shape({
    menu: PropTypes.string,
    title: PropTypes.string,
    section: PropTypes.string,
    suggestion: PropTypes.string
  }),
  multiSection: PropTypes.bool,
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.objectOf(PropTypes.any)])
  )
};

export default Autosuggestions;
