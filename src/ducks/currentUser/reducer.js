import * as types from './types';
import { UPDATE_USER } from '../users/types';

export default (state = null, action) => {
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
      const {
        [notificationId]: removedNotification,
        ...restOfNotifications
      } = state.notifications;
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
      const { assignedTasks } = action;
      return {
        ...state,
        assignedTasks
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
    case types.REMOVE_TASK_DUE_SOON: {
      const { taskId } = action;
      const { [taskId]: removedTask, ...restOfTasks } = state.tasksDueSoon;
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
      const { userData } = action;
      return {
        ...state,
        ...userData
      };
    }
    default:
      return state;
  }
};
