import React from 'react';
import { Tag } from '../Tag';

const TagSuggestions = ({ items, selectedTag, hasExactMatch, onClick }) => {
  return (
    <ul className="tag-input__list">
      {items.map((item, i) => {
        return (
          <li
            key={`${item.name}-${item.color}`}
            data-tag={item.name}
            onClick={onClick}
            tabIndex={0}
            className={`tag-input__item ${
              selectedTag === item.name ? 'is-selected' : ''
            } ${!hasExactMatch && i === items.length - 1 ? 'tag-input__item--new' : ''}`}
          >
            {!hasExactMatch && i === items.length - 1 ? (
              <>
                <span className="tag-input__item--heading">New Tag</span>
                <span className="tag-input__item--name">{item.name}</span>
              </>
            ) : (
              <Tag name={item.name} color={item.color} size="sm" disableLink />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default TagSuggestions;
