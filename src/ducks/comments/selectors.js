export const getCommentsById = state => {
  const { commentsById } = state;
  return commentsById;
};

export const getComment = (state, commentId) => {
  const { commentsById } = state;
  return commentsById[commentId];
};

export const getCommentsArray = (state, commentIds) => {
  const { commentsById } = state;
  if (!commentIds) return [];
  let comments = [];

  for (let commentId of commentIds) {
    const comment = commentsById[commentId];
    if (!comment) break;
    comments = comments.concat(comment);
  }
  
  return comments;
};

export const getTaskComments = (state, taskId) => {
  const { commentsById, tasksById } = state;
  const task = tasksById[taskId];
  if (!task) return [];
  const { commentIds } = tasksById[taskId];
  return commentIds.map(commentId => commentsById[commentId]);
};