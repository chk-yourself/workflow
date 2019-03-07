import * as types from './types';

const commentsById = (state = {}, action) => {
  switch (action.type) {
    case types.LOAD_COMMENTS_BY_ID: {
      const { commentsById } = action;
      return {
        ...state,
        ...commentsById
      };
    }
    case types.ADD_COMMENT: {
      const { commentId, commentData } = action;
      return {
        ...state,
        [commentId]: {
          commentId,
          ...commentData
        }
      };
    }
    case types.DELETE_COMMENT: {
      const { commentId } = action;
      const { [commentId]: deletedComment, ...restOfComments } = state;
      return restOfComments;
    }
    case types.UPDATE_COMMENT: {
      const { commentId, commentData } = action;
      return {
        ...state,
        [commentId]: {
          ...state[commentId],
          ...commentData
        }
      };
    }
    default:
      return state;
  }
};

export default commentsById;
