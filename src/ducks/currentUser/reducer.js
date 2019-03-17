import * as types from './types';
import { UPDATE_USER } from '../users/types';

const currentUser = (state = null, action) => {
  switch (action.type) {
    case types.SET_CURRENT_USER: {
      const { currentUser } = action;
      return currentUser;
    }
    case types.LOAD_FOLDERS: {
      const { folders } = action;
      return {
        ...state,
        folders
      };
    }
    case types.LOAD_USER_TAGS: {
      const { tags } = action;
      return {
        ...state,
        tags
      };
    }
    case types.CREATE_TAG: {
      const { tagId, tagData } = action;
      return {
        ...state,
        tags: {
          ...state.tags,
          [tagId]: tagData
        }
      };
    }
    case types.DELETE_TAG: {
      const { tagId } = action;
      const { [tagId]: deletedTag, ...restOfTags } = state.tags;
      return {
        ...state,
        tags: restOfTags
      };
    }
    case types.UPDATE_TAG: {
      const { tagId, tagData } = action;
      return {
        ...state,
        tags: {
          ...state.tags,
          [tagId]: {
            ...state.tags[tagId],
            ...tagData
          }
        }
      };
    }
    case types.ADD_FOLDER: {
      const { folderId, folderData } = action;
      return {
        ...state,
        folders: {
          ...state.folders,
          [folderId]: {
            folderId,
            ...folderData
          }
        }
      };
    }
    case types.DELETE_FOLDER: {
      const { folderId } = action;
      const { [folderId]: deletedFolder, ...restOfFolders } = state.folders;
      return {
        ...state,
        folders: restOfFolders
      };
    }
    case types.LOAD_ASSIGNED_TASKS: {
      const { assignedTasks } = action;
      return {
        ...state,
        assignedTasks
      };
    }
    case types.ADD_ASSIGNED_TASK: {
      const { taskId } = action;
      return {
        ...state,
        assignedTasks: [...state.assignedTasks, taskId]
      };
    }
    case types.REMOVE_ASSIGNED_TASK: {
      const { taskId } = action;
      return {
        ...state,
        assignedTasks: [...state.assignedTasks.filter(id => id !== taskId)]
      };
    }
    case types.UPDATE_FOLDER: {
      const { folderId, folderData } = action;
      return {
        ...state,
        folders: {
          ...state.folders,
          [folderId]: {
            ...state.folders[folderId],
            ...folderData
          }
        }
      };
    }
    case types.UPDATE_FOLDER_IDS:
    case types.REORDER_FOLDERS: {
      const { folderIds } = action;
      return {
        ...state,
        folderIds
      };
    }
    case types.LOAD_TASKS_DUE_SOON: {
      const { tasksDueSoon } = action;
      return {
        ...state,
        tasksDueSoon
      };
    }
    case types.ADD_TASK_DUE_SOON: {
      const { taskId, taskData } = action;
      return {
        ...state,
        tasksDueSoon: {
          ...state.tasksDueSoon,
          [taskId]: {
            taskId,
            ...taskData
          }
        }
      };
    }
    case types.DELETE_TASK_DUE_SOON: {
      const { taskId } = action;
      const { [taskId]: deletedTask, ...restOfTasks } = state.tasksDueSoon;
      return {
        ...state,
        tasksDueSoon: restOfTasks
      };
    }
    case types.UPDATE_TASK_DUE_SOON: {
      const { taskId, taskData } = action;
      return {
        ...state,
        tasksDueSoon: {
          ...state.tasksDueSoon,
          [taskId]: {
            ...state.tasksDueSoon[taskId],
            ...taskData
          }
        }
      };
    }
    case UPDATE_USER: {
      const { userData } = action;
      return {
        ...state,
        ...userData
      }
    }
    default:
      return state;
  }
};

export default currentUser;
