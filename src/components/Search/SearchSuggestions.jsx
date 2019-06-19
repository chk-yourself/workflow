/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';

const SearchSuggestions = ({
  items,
  onClick,
  selectedItem,
  category,
  renderMatch
}) => {
  if (items.length === 0) return null;
  return (
    <li className="search-suggestions__item">
      <span className="search-suggestions__name">{category}</span>
      <ul className="search-suggestions__list">
        {items.map(item => {
          const isSelected =
            selectedItem === null
              ? false
              : (selectedItem.name === item.name &&
                  (category === 'Projects' &&
                    selectedItem.projectId === item.projectId)) ||
                (category === 'Tags' && selectedItem.color === item.color) ||
                (category === 'Tasks' && selectedItem.taskId === item.taskId);
          return (
            <li
              key={item.taskId || item.projectId || item.name}
              className={`search-suggestion ${isSelected ? 'is-selected' : ''}`}
              onClick={onClick}
              tabIndex={0}
              data-id={item.taskId || item.projectId || item.name}
              data-project-id={item.projectId || ''}
            >
              {renderMatch(item)}
            </li>
          );
        })}
      </ul>
    </li>
  );
};

SearchSuggestions.defaultProps = {
  onClick: () => null
};

export default SearchSuggestions;
