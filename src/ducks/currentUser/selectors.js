import { toDateString, isPriorDate } from '../../utils/date';

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

export const getNotifications = state => {
  const { currentUser } = state;
  if (!currentUser) return null;
  return currentUser.notifications;
};

export const getNotificationsArray = state => {
  const { currentUser } = state;
  if (!currentUser) return [];
  const { notifications } = currentUser;
  if (!notifications) return [];
  const getMillis = obj => obj.createdAt ? obj.createdAt.toMillis() : Date.now();
  return Object.keys(notifications).map(notificationId => notifications[notificationId]).sort((a, b) => {
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
  const { currentUser } = state;
  if (!currentUser) return [];
  const { tempSettings, assignedTasks } = currentUser;
  const { sortBy, view } = tempSettings.tasks;
  const { folders } = currentUser;
  if (!folders) return [];
  switch (sortBy) {
    case 'project': {
      const { tasksById } = state;
      if (!assignedTasks || !tasksById) return [];
      const { projectIds } = currentUser;
      const projectTasks = projectIds.reduce((tasksByProject, projectId) => {
        const { name, taskIds } = folders[projectId];
        return tasksByProject.concat(taskIds.length > 0 ? {
          taskIds: view === 'active'
          ? taskIds.filter(taskId => !tasksById[taskId].isCompleted)
          : view === 'completed'
          ? taskIds.filter(taskId => tasksById[taskId].isCompleted)
          : taskIds,
          projectId,
          name,
          projectName: name,
          dueDate: null,
          folderId: projectId,
          userPermissions: {
            enableNameChange: false,
            enableTaskAdd: false,
            enableDragNDrop: true
          }
        } : []);
      }, []);
      const miscFolder = folders['4'];
      const noProject = miscFolder.taskIds.length > 0 ? {
        ...miscFolder,
        projectId: null,
        projectName: null,
        dueDate: null,
        taskIds: view === 'active'
        ? miscFolder.taskIds.filter(taskId => !tasksById[taskId].isCompleted)
        : view === 'completed'
        ? miscFolder.taskIds.filter(taskId => tasksById[taskId].isCompleted)
        : miscFolder.taskIds,
        userPermissions: {
          enableNameChange: false,
          enableTaskAdd: true,
          enableDragNDrop: true
        }
      } : null;
      return [
        ...projectTasks,
        ...(noProject ? [noProject] : [])
      ];
    }
    case 'folder': {
      if (!folders) return [];
      const { folderIds } = currentUser;
      const { tasksById } = state;
      return folderIds.map(folderId => {
        const { taskIds } = folders[folderId];
        return {
          ...folders[folderId],
          taskIds: view === 'active'
              ? taskIds.filter(taskId => !tasksById[taskId].isCompleted)
              : view === 'completed'
              ? taskIds.filter(taskId => tasksById[taskId].isCompleted)
              : taskIds,
          projectId: null,
          projectName: null,
          dueDate: null,
          userPermissions: {
            enableNameChange:
              folderId !== '0' &&
              folderId !== '1' &&
              folderId !== '2' &&
              folderId !== '3',
            enableTaskAdd: true,
            enableDragNDrop: true
          }
        };
      });
    }
    case 'dueDate': {
      const { tasksById } = state;
      if (!assignedTasks || !tasksById) return [];
      let dueDates = [];
      const dueTasks = assignedTasks.reduce((tasksByDueDate, taskId) => {
        const { dueDate, isCompleted } = tasksById[taskId];
        if (view === 'active' && isCompleted) return tasksByDueDate;
        if (view === 'completed' && !isCompleted) return tasksByDueDate;
        const isPastDue = dueDate && isPriorDate(dueDate.toDate());
        if (dueDate && !isPastDue) {
          if (!(`${dueDate.toMillis()}` in tasksByDueDate)) {
            tasksByDueDate[`${dueDate.toMillis()}`] = {
              taskIds: [],
              projectId: null,
              name: toDateString(dueDate.toDate(), {
                useRelative: true,
                format: { weekday: 'short', month: 'short', day: 'numeric' }
              }),
              projectName: null,
              folderId: `${dueDate.toMillis()}`,
              dueDate: dueDate.toMillis(),
              userPermissions: {
                enableNameChange: false,
                enableTaskAdd: true,
                enableDragNDrop: true
              }
            };
            dueDates = [...dueDates, dueDate.toMillis()];
          }
          tasksByDueDate[`${dueDate.toMillis()}`].taskIds = [
            ...tasksByDueDate[`${dueDate.toMillis()}`].taskIds,
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
                enableDragNDrop: true
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
      const unscheduled = folders['5'];
      const noDueDate = unscheduled.taskIds.length > 0 ? {
        ...unscheduled,
        taskIds: view === 'active'
          ? unscheduled.taskIds.filter(taskId => !tasksById[taskId].isCompleted)
          : view === 'completed'
          ? unscheduled.taskIds.filter(taskId => tasksById[taskId].isCompleted)
          : unscheduled.taskIds,
        projectId: null,
        projectName: null,
        dueDate: null,
        userPermissions: {
        enableNameChange: false,
        enableTaskAdd: true,
        enableDragNDrop: true
        }
      } : null;
      const { pastDue, ...restOfDueTasks } = dueTasks;
      const sortedDueDates = [...dueDates].sort((a, b) => a - b);
      return [
        ...(pastDue ? [pastDue] : []),
        ...sortedDueDates.map(date => `${date}` in folders ? ({
          ...folders[`${date}`],
          taskIds: view === 'active'
          ? folders[`${date}`].taskIds.filter(taskId => !tasksById[taskId].isCompleted)
          : view === 'completed'
          ? folders[`${date}`].taskIds.filter(taskId => tasksById[taskId].isCompleted)
          : folders[`${date}`].taskIds,
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
        }) : restOfDueTasks[`${date}`]),
        ...(noDueDate ? [noDueDate] : [])
      ];
    }
    default: {
      return [];
    }
  }
};

export const getFolder = (state, folderId) => {
  const { currentUser } = state;
  if (!currentUser) return null;
  return currentUser.folders[folderId];
};

export const getTasksDueSoonById = state => {
  const { currentUser } = state;
  if (!currentUser) return {};
  return currentUser.tasksDueSoon;
};

export const getTasksDueSoonArr = state => {
  const { currentUser } = state;
  if (!currentUser) return [];
  const { tasksDueSoon } = currentUser;
  if (!tasksDueSoon) return [];
  return Object.keys(tasksDueSoon).map(taskId => tasksDueSoon[taskId]);
};

export const getMergedProjectTags = state => {
  const {
    selectedProject: projectId,
    projectsById,
    usersById,
    currentUser
  } = state;
  const { userId } = currentUser;
  if (!projectId) return [];
  const { tags: projectTags } = projectsById[projectId];
  const { tags: userTags } = usersById[userId];
  const mergedTags = { ...userTags, ...projectTags };
  return Object.keys(mergedTags).map(tag => mergedTags[tag]);
};


export const getAllMergedTags = state => {
  const {
    projectsById,
    usersById,
    currentUser
  } = state;
  if (!currentUser) return [];
  const { tags: userTags, projectIds } = currentUser;
  const projectTags = projectIds.reduce((tags, projectId) => {
    const project = projectsById[projectId];
    if (project && project.tags) {
      tags = {
        ...tags,
        ...project.tags
      };
    }
    return tags;
  }, {});
  const mergedTags = { ...userTags, ...projectTags };
  return Object.keys(mergedTags).map(tag => mergedTags[tag]);
};

export const getCurrentUserProjects = state => {
  const { currentUser, projectsById } = state;
  if (!currentUser) return [];
  const { projectIds } = currentUser;
  return projectIds.map(projectId => projectsById[projectId]);
};