import * as types from './types';
import { UPDATE_USER } from '../users/types';
import { RESET_ACTIVE_WORKSPACE } from '../activeWorkspace/types';

const INITIAL_STATE = null;

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_CURRENT_USER: {
      const { currentUser } = action;
      return currentUser;
    }
    case types.RESET_CURRENT_USER: {
      return INITIAL_STATE;
    }
    case types.LOAD_FOLDERS: {
      const { folders } = action;
      return {
        ...state,
        folders
      };
    }
    case types.LOAD_NOTIFICATIONS: {
      const { notifications } = action;
      return {
        ...state,
        notifications
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
    case types.REMOVE_FOLDER: {
      const { folderId } = action;
      const { [folderId]: removedFolder, ...restOfFolders } = state.folders;
      return {
        ...state,
        folders: restOfFolders
      };
    }
    case types.ADD_NOTIFICATION: {
      const { notificationId, notificationData } = action;
      return {
        ...state,
        notifications: {
          ...state.notifications,
          [notificationId]: {
            notificationId,
            ...notificationData
          }
        }
      };
    }
    case types.REMOVE_NOTIFICATION: {
      const { notificationId } = action;
      const {[notificationId]: removedNotification, ...restOfNotifications} = state.notifications;
      return {
        ...state,
        notifications: restOfNotifications
      };
    }
    case types.UPDATE_NOTIFICATION: {
      const { notificationId, notificationData } = action;
      return {
        ...state,
        notifications: {
          ...state.notifications,
          [notificationId]: {
            ...state.notifications[notificationId],
            ...notificationData
          }
        }
      };
    }
    case types.LOAD_ASSIGNED_TASKS: {
      const currentAssignedTasks = state.assignedTasks || [];
      const { assignedTasks } = action;
      return {
        ...state,
        assignedTasks: [...currentAssignedTasks, ...assignedTasks]
      };
    }
    case types.ADD_ASSIGNED_TASK: {
      const { taskId } = action;
      const assignedTasks = state.assignedTasks || [];
      return {
        ...state,
        assignedTasks: [...assignedTasks, taskId]
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
    case types.SET_TEMP_TASK_SETTINGS: {
      const { view, sortBy } = action;
      return {
        ...state,
        tempSettings: {
          ...state.tempSettings,
          tasks: {
            ...state.tempSettings.tasks,
            view: view || state.tempSettings.tasks.view,
            sortBy: sortBy || state.tempSettings.tasks.sortBy
          }
        }
      };
    }
    case UPDATE_USER: {
      const { userId, userData } = action;
      if (userId !== state.userId) return state;
      return {
        ...state,
        ...userData
      };
    }
    case RESET_ACTIVE_WORKSPACE: {
      const { assignedTasks, notifications, folders, projectIds, folderIds, ...rest } = state;
      return rest;
    }
    default:
      return state;
  }
};
