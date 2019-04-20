import * as types from './types';
import { RESET_ACTIVE_WORKSPACE } from '../activeWorkspace/types';

const INITIAL_STATE = null;

const commentsById = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.LOAD_COMMENTS_BY_ID: {
      const { commentsById } = action;
      return {
        ...(state && state),
        ...commentsById
      };
    }
    case types.ADD_COMMENT: {
      const { commentId, commentData } = action;
      return {
        ...(state && state),
        [commentId]: {
          commentId,
          isLoaded: true,
          ...commentData
        }
      };
    }
    case types.REMOVE_COMMENT: {
      const { commentId } = action;
      const { [commentId]: removedComment, ...restOfComments } = state;
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
    case RESET_ACTIVE_WORKSPACE: {
      return INITIAL_STATE;
    }
    default:
      return state;
  }
};

export default commentsById;
