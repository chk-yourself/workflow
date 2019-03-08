export const getCommentsById = state => {
  const { commentsById } = state;
  return commentsById;
};

export const getCommentsArray = (state, commentIds) => {
  const { commentsById } = state;
  if (!commentIds) return [];
  console.log(commentIds);
  console.log(commentsById);

  return commentIds.map(commentId => {
    return commentsById[commentId];
  });
};
