import * as types from './types';
import { ADD_TASK, REMOVE_TASK } from '../tasks/types';

const listsById = (state = {}, action) => {
  switch (action.type) {
    case types.LOAD_LISTS_BY_ID: {
      const { listsById } = action;
      return {
        ...state,
        ...listsById
      };
    }
    case types.UPDATE_LIST: {
      const { listId, listData } = action;
      return {
        ...state,
        [listId]: {
          ...state[listId],
          ...listData
        }
      };
    }
    case types.ADD_LIST: {
      const { listId, listData } = action;
      return {
        ...state,
        [listId]: {
          listId,
          ...listData
        }
      };
    }
    case types.REMOVE_LIST: {
      const { listId } = action;
      const { [listId]: deletedList, ...restOfLists } = state;
      return restOfLists;
    }
    case ADD_TASK: {
      const { taskId, taskData } = action;
      const { listId } = taskData;
      if (!listId) return state;
      return {
        ...state,
        [listId]: {
          ...state[listId],
          taskIds: [...state[listId].taskIds, taskId]
        }
      };
    }
    case REMOVE_TASK: {
      const { taskId, listId } = action;
      if (!listId || !(listId in state)) return state;
      return {
        ...state,
        [listId]: {
          ...state[listId],
          listIds: state[listId].taskIds.filter(id => id !== taskId)
        }
      };
    }
    default:
      return state;
  }
};

export default listsById;
