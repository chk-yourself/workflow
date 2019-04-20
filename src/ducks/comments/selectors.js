export const getCommentsById = state => {
  const { commentsById } = state;
  return commentsById;
};

export const getComment = (state, commentId) => {
  const { commentsById } = state;
  return commentsById ? commentsById[commentId] : null;
};

export const getCommentsArray = (state, commentIds) => {
  const { commentsById } = state;
  if (commentIds && commentsById) {
    return commentIds.reduce((comments, commentId) => {
      const comment = commentsById[commentId];
      if (comment) {
        return comments.concat(comment);
      }
      return comments;
    }, []);
  }
  return [];
};

export const getTaskComments = (state, taskId) => {
  const { commentsById, tasksById } = state;
  if (commentsById && tasksById) {
    const task = tasksById[taskId];
    if (task) {
      const { commentIds } = task;
      return commentIds.map(commentId => commentsById[commentId]);
    }
  }
  return [];
};