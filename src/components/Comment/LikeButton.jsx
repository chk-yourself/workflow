import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../Button';
import { Icon } from '../Icon';

const LikeButton = ({ onClick, likesCount }) => {
  return (
    <Button className="comment__likes" onClick={onClick} size="sm">
      <Icon name="thumbs-up" />
      <span className="comment__likes-counter">{likesCount > 0 ? likesCount : ''}</span>
    </Button>
  );
};

LikeButton.defaultProps = {
  likesCount: 0,
  onClick: () => {}
};

LikeButton.propTypes = {
  likesCount: PropTypes.number,
  onClick: PropTypes.func
};

export default memo(LikeButton);
