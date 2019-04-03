import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from '../Tag';
import SearchHighlight from './SearchHighlight';

const SearchSuggestions = ({
  items,
  filter,
  onClick,
  selectedItem,
  category,
  query
}) => {
  const filteredItems = items.filter(item => filter(item));
  if (filteredItems.length === 0) return null;
  return (
    <li className="search-suggestions__category">
      <span className="search-suggestions__category-name">{category}</span>
      <ul className="search-suggestions__list">
        {filteredItems.map((item, i) => {
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
              key={item.name}
              className={`search-suggestion ${isSelected ? 'is-selected' : ''}`}
              onClick={onClick}
              tabIndex={0}
              data-id={
                category === 'Projects'
                  ? item.projectId
                  : category === 'Tasks'
                  ? item.taskId
                  : item.name
              }
            >
              {
                {
                  Tags: <Tag name={item.name} color={item.color} size="sm" />,
                  Projects: (
                    <Link
                      className="search-suggestion__link"
                      to={`/0/project/${item.projectId}`}
                    >
                      {item.name}
                    </Link>
                  ),
                  Tasks: (
                    <span className="search-suggestion__task">{item.name}</span>
                  )
                }[category]
              }
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
