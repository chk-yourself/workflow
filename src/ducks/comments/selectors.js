export const getCommentsById = state => {
  const { commentsById } = state;
  return commentsById;
};

export const getCommentsArray = (state, commentIds) => {
  const { commentsById } = state;
  if (!commentIds) return [];
  return commentIds.map(commentId => {
    return commentsById[commentId];
  });
};
