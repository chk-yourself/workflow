import React from 'react';

const SearchHighlight = ({ className, query, string }) => {
  const regExp = new RegExp(`\\b${query}`, 'gi');
  return (
    <>
      {string.replace(regExp, match => (
        <span className={`search-highlight ${className}`}>{match}</span>
      ))}
    </>
  );
};

SearchHighlight.defaultProps = {
  className: ''
};

export default SearchHighlight;
