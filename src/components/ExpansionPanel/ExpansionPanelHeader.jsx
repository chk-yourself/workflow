import React, { memo } from 'react';
import PropTypes from 'prop-types';

const ExpansionPanelHeader = ({ children, classes, onClick, onKeyDown }) => {
  return (
    <div
      className={`expansion-panel__header ${classes.header || ''}`}
      role="button"
      onClick={onClick}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onDragOver={onClick}
    >
      <div
        tabIndex={-1}
        className={`expansion-panel__header-inner ${classes.inner || ''}`}
      >
        {children}
      </div>
    </div>
  );
};

ExpansionPanelHeader.defaultProps = {
  classes: {
    header: '',
    inner: ''
  },
  children: null,
  onClick: () => {},
  onKeyDown: () => {}
};

ExpansionPanelHeader.propTypes = {
  classes: PropTypes.shape({
    header: PropTypes.string,
    inner: PropTypes.string
  }),
  children: PropTypes.node,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func
};

export default memo(ExpansionPanelHeader);
