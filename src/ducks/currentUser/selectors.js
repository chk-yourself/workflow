/* eslint-disable no-param-reassign */
import { toDateString, isPriorDate } from '../../utils/date';
import { getTaskIdsByViewFilter } from '../tasks/selectors';
import { getProjectTags } from '../projects/selectors';

export const getCurrentUser = state => {
  return state.currentUser;
};

export const getCurrentUserId = state => {
  const { currentUser } = state;
  if (!currentUser) return null;
  return currentUser.userId;
};

export const getFolders = state => {
  const { currentUser } = state;
  if (!currentUser) return null;
  return currentUser.folders;
};

export const getNotificationsArray = state => {
  const { currentUser } = state;
  if (!currentUser) return [];
  const { notifications } = currentUser;
  if (!notifications) return [];
  const getMillis = obj =>
    obj.createdAt ? obj.createdAt.toMillis() : Date.now();
  return Object.keys(notifications)
    .sort((a, b) => {
      const notificationA = notifications[a];
      const notificationB = notifications[b];
      return getMillis(notificationB) - getMillis(notificationA);
    })
    .map(notificationId => notifications[notificationId]);
};

export const getNotifications = (state, isActive) => {
  const { currentUser } = state;
  if (!currentUser) return [];
  const { notifications } = currentUser;
  if (!notifications) return [];
  const getMillis = obj =>
    obj.createdAt ? obj.createdAt.toMillis() : Date.now();
  return Object.keys(notifications)
    .map(notificationId => notifications[notificationId])
    .filter(notification =>
      isActive ? notification.isActive : !notification.isActive
    )
    .sort((a, b) => {
      return getMillis(b) - getMillis(a);
    });
};

export const getTaskSettings = state => {
  const { currentUser } = state;
  if (!currentUser) return null;
  return currentUser.settings.tasks;
};

export const getTempTaskSettings = state => {
  const { currentUser } = state;
  if (!currentUser) return null;
  return currentUser.tempSettings.tasks;
};

export const getAssignedTasks = state => {
  const { currentUser } = state;
  if (!currentUser) return null;

  return currentUser.assignedTasks;
};

export const getFolderIds = state => {
  const { currentUser } = state;
  if (!currentUser) return [];
  return currentUser.folderIds;
};

export const getSortedFilteredTaskGroups = state => {
  const { currentUser, tasksById } = state;
  if (!currentUser || !tasksById) return [];
  const {
    tempSettings,
    assignedTasks,
    folders: foldersById,
    projectIds,
    folderIds
  } = currentUser;
  if (!foldersById || !assignedTasks || !projectIds || !folderIds) return [];
  const { sortBy, view } = tempSettings.tasks;
  switch (sortBy) {
    case 'project': {
      const projectTasks = projectIds.reduce((tasksByProject, projectId) => {
        const folder = foldersById[projectId];
        if (folder) {
          const { name, taskIds } = folder;
          const taskIdsByFilter = getTaskIdsByViewFilter(state, {
            folderId: projectId
          });
          return tasksByProject.concat(
            taskIds.length > 0
              ? {
                  taskIds: taskIdsByFilter[view],
                  projectId,
                  name,
                  activeTaskCount: taskIdsByFilter.active.length,
                  projectName: name,
                  dueDate: null,
                  folderId: projectId,
                  userPermissions: {
                    enableNameChange: false,
                    enableTaskAdd: false,
                    enableDragNDrop: true
                  }
                }
              : []
          );
        }
        return tasksByProject;
      }, []);
      const privateTaskIdsByFilter = getTaskIdsByViewFilter(state, {
        folderId: '4'
      });
      const noProject = {
        ...foldersById['4'],
        projectId: null,
        projectName: null,
        dueDate: null,
        taskIds: privateTaskIdsByFilter[view],
        activeTaskCount: privateTaskIdsByFilter.active.length,
        userPermissions: {
          enableNameChange: false,
          enableTaskAdd: true,
          enableDragNDrop: true
        }
      };
      return [...projectTasks, noProject];
    }
    case 'folder': {
      return folderIds.reduce((folders, folderId) => {
        const folder = foldersById[folderId];
        if (folder) {
          const taskIdsByFilter = getTaskIdsByViewFilter(state, { folderId });
          return folders.concat({
            ...folder,
            taskIds: taskIdsByFilter[view],
            activeTaskCount: taskIdsByFilter.active.length,
            projectId: null,
            projectName: null,
            dueDate: null,
            userPermissions: {
              enableNameChange: !['0', '1', '2', '3'].includes(folderId),
              enableTaskAdd: true,
              enableDragNDrop: true
            }
          });
        }
        return folders;
      }, []);
    }
    case 'dueDate': {
      let dueDates = [];
      const dueTasks = assignedTasks.reduce((tasksByDueDate, taskId) => {
        const task = tasksById[taskId];
        if (!task) return tasksByDueDate;
        const { dueDate, isCompleted } = task;
        if (
          (view === 'active' && isCompleted) ||
          (view === 'completed' && !isCompleted)
        )
          return tasksByDueDate;
        const isPastDue = dueDate && isPriorDate(dueDate.toDate());
        if (dueDate && !isPastDue) {
          const dueDateMillis = dueDate.toMillis();
          if (!(`${dueDateMillis}` in tasksByDueDate)) {
            tasksByDueDate[`${dueDateMillis}`] = {
              taskIds: [],
              projectId: null,
              name: toDateString(dueDate.toDate(), {
                useRelative: true,
                format: { weekday: 'short', month: 'short', day: 'numeric' }
              }),
              projectName: null,
              folderId: `${dueDateMillis}`,
              dueDate: dueDateMillis,
              userPermissions: {
                enableNameChange: false,
                enableTaskAdd: true,
                enableDragNDrop: true
              }
            };
            dueDates = [...dueDates, dueDateMillis];
          }
          tasksByDueDate[`${dueDateMillis}`].taskIds = [
            ...tasksByDueDate[`${dueDateMillis}`].taskIds,
            taskId
          ];
        } else if (dueDate && isPastDue) {
          if (!('pastDue' in tasksByDueDate)) {
            tasksByDueDate.pastDue = {
              taskIds: [],
              projectId: null,
              name: 'Past Due',
              projectName: null,
              folderId: null,
              dueDate: 'pastDue',
              userPermissions: {
                enableNameChange: false,
                enableTaskAdd: false,
                enableDragNDrop: false
              }
            };
          }
          tasksByDueDate.pastDue.taskIds = [
            ...tasksByDueDate.pastDue.taskIds,
            taskId
          ];
        }
        return tasksByDueDate;
      }, {});
      const noDueDate = {
        ...foldersById['5'],
        taskIds: getTaskIdsByViewFilter(state, { folderId: '5' })[view],
        projectId: null,
        projectName: null,
        dueDate: null,
        userPermissions: {
          enableNameChange: false,
          enableTaskAdd: true,
          enableDragNDrop: true
        }
      };
      const { pastDue, ...restOfDueTasks } = dueTasks;
      const sortedDueDates = [...dueDates].sort((a, b) => a - b);
      return [
        ...(pastDue ? [pastDue] : []),
        ...sortedDueDates.map(date =>
          `${date}` in foldersById
            ? {
                ...foldersById[`${date}`],
                taskIds: getTaskIdsByViewFilter(state, { folderId: `${date}` })[
                  view
                ],
                projectId: null,
                name: toDateString(new Date(date), {
                  useRelative: true,
                  format: { weekday: 'short', month: 'short', day: 'numeric' }
                }),
                projectName: null,
                folderId: `${date}`,
                dueDate: date,
                userPermissions: {
                  enableNameChange: false,
                  enableTaskAdd: true,
                  enableDragNDrop: true
                }
              }
            : restOfDueTasks[`${date}`]
        ),
        noDueDate
      ];
    }
    default: {
      return [];
    }
  }
};

export const getFolder = (state, folderId) => {
  const { currentUser } = state;
  if (currentUser) {
    const { folders } = currentUser;
    if (folders) {
      return folders[folderId];
    }
  }
  return null;
};

// Returns array of tasks due within next given number of days
export const getTasksDueWithinDays = (state, days = 7) => {
  const { currentUser, tasksById } = state;
  if (!currentUser || !tasksById) return [];
  const { assignedTasks } = currentUser;
  if (!assignedTasks) return [];
  const timeStart = new Date().setHours(0, 0, 0, 0);
  const endingDate = new Date(timeStart);
  const timeEnd = +new Date(endingDate.setDate(endingDate.getDate() + days));
  return assignedTasks
    .reduce((tasksDueSoon, taskId) => {
      const task = tasksById[taskId];
      if (task) {
        const { isCompleted, dueDate } = task;
        if (!isCompleted && dueDate && dueDate.toMillis() <= timeEnd) {
          return tasksDueSoon.concat(task);
        }
      }
      return tasksDueSoon;
    }, [])
    .sort((a, b) => a.dueDate.toMillis() - b.dueDate.toMillis());
};

export const getOverdueTasks = state => {
  const { currentUser, tasksById } = state;
  if (!currentUser || !tasksById) return [];
  const { assignedTasks } = currentUser;
  if (!assignedTasks) return [];
  const timeEnd = new Date().setHours(0, 0, 0, 0);
  return assignedTasks
    .reduce((overdueTasks, taskId) => {
      const task = tasksById[taskId];
      if (task) {
        const { isCompleted, dueDate } = task;
        if (!isCompleted && dueDate && dueDate.toMillis() < timeEnd) {
          return overdueTasks.concat(task);
        }
      }
      return overdueTasks;
    }, [])
    .sort((a, b) => a.dueDate.toMillis() - b.dueDate.toMillis());
};

export const getMergedProjectTags = (state, projectId) => {
  const { projectsById, currentUser } = state;
  if (!currentUser || !projectsById) return [];
  const { tags: userTags } = currentUser;
  const projectTags = getProjectTags(state, projectId);
  const mergedTags = { ...userTags, ...projectTags };
  return Object.keys(mergedTags).map(tag => mergedTags[tag]);
};

/*
export const getAllMergedTags = state => {
  const { projectsById, currentUser } = state;
  if (!currentUser || !projectsById) return [];
  const { tags: userTags, projectIds } = currentUser;
  if (!projectIds) return [];
  const projectTags = projectIds.reduce((tags, projectId) => {
    const project = projectsById[projectId];
    if (project && project.tags) {
      return {
        ...tags,
        ...project.tags
      };
    }
    return tags;
  }, {});
  const mergedTags = { ...userTags, ...projectTags };
  return Object.keys(mergedTags).map(tag => mergedTags[tag]);
};
*/

export const getAllMergedTags = state => {
  const { projectsById, currentUser } = state;
  if (!currentUser || !projectsById) return [];
  const { tags: userTags, projectIds } = currentUser;
  if (!projectIds) return [];
  const projectTags = projectIds.reduce((tags, projectId) => {
    return {
      ...tags,
      ...getProjectTags(state, projectId)
    };
  }, {});
  const mergedTags = { ...userTags, ...projectTags };
  return Object.keys(mergedTags).map(tag => mergedTags[tag]);
};

export const getCurrentUserProjects = state => {
  const { currentUser, projectsById } = state;
  if (!currentUser || !projectsById) return [];
  const { projectIds } = currentUser;
  if (!projectIds) return [];
  return projectIds.map(projectId => projectsById[projectId]);
};
