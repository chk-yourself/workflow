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

export const getTaskSettings = state => {
  const { currentUser } = state;
  if (!currentUser) return null;
  return currentUser.settings.tasks;
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

export const getFoldersArray = state => {
  const { currentUser } = state;
  if (!currentUser) return [];
  const { settings, folders, assignedTasks } = currentUser;
  switch (settings.tasks.sortBy) {
    case 'project': {
      const { tasksById } = state;
      if (!assignedTasks || !tasksById) return [];
      const projectTasks = assignedTasks.reduce((tasksByProject, taskId) => {
        const { projectId, projectName } = tasksById[taskId];
        if (projectId && projectId in tasksByProject) {
          tasksByProject[projectId] = {
            ...tasksByProject[projectId],
            taskIds: [...tasksByProject[projectId].taskIds, taskId]
          }
        } else if (projectId) {
          tasksByProject[projectId] = {
            taskIds: [taskId],
            projectId: projectId,
            name: projectName,
            projectName: projectName,
            dueDate: null,
            folderId: null
          }
        }
        return tasksByProject;
      }, {});
      return [...Object.keys(projectTasks).map(projectId => projectTasks[projectId]), {
        projectId: null,
        projectName: null,
        dueDate: null,
        name: 'No project',
        folderId: '0',
        taskIds: assignedTasks.filter(taskId => tasksById[taskId].projectId === null),
        isDefault: true
      }];
    }
    case 'folder': {
      if (!folders) return [];
      return Object.keys(folders).map(folderId => {
        return {
          ...folders[folderId],
          projectId: null,
          projectName: null,
          dueDate: null,
          isDefault: folderId === '0' ||
            folderId === '1' ||
            folderId === '2' ||
            folderId === '3'
        };
      });
    }
    case 'dueDate': {
      const { tasksById } = state;
      if (!assignedTasks || !tasksById) return [];
      let dueDates = [];
      const dueTasks = assignedTasks.reduce((tasksByDueDate, taskId) => {
        const { dueDate } = tasksById[taskId];
        const isPastDue = dueDate && isPriorDate(dueDate.toDate());
        if (dueDate && +dueDate.toDate() in tasksByDueDate) {
          tasksByDueDate[+dueDate.toDate()] = {
            ...tasksByDueDate[dueDate],
            taskIds: [...tasksByDueDate[dueDate].taskIds, taskId]
          }
        } else if (dueDate && !isPastDue) {
          tasksByDueDate[+dueDate.toDate()] = {
            taskIds: [taskId],
            projectId: null,
            name: toDateString(dueDate.toDate(), {
                useRelative: true,
                format: { month: 'short', day: 'numeric' }
              }),
            projectName: null,
            folderId: null,
            dueDate: +dueDate.toDate()
          }
          dueDates = [...dueDates, +dueDate.toDate()];
        } else if (dueDate && isPastDue && 'pastDue' in tasksByDueDate) {
          tasksByDueDate.pastDue = {
            ...tasksByDueDate.pastDue,
            taskIds: [...tasksByDueDate.pastDue.taskIds, taskId]
          }
        } else if (dueDate && isPastDue) {
          tasksByDueDate.pastDue = {
            taskIds: [taskId],
            projectId: null,
            name: 'Past Due',
            projectName: null,
            folderId: null,
            dueDate: 'pastDue',
            isDefault: true
        }
        } else if (!dueDate && 'noDueDate' in tasksByDueDate) {
          tasksByDueDate.noDueDate = {
            ...tasksByDueDate.noDueDate,
            taskIds: [...tasksByDueDate.noDueDate.taskIds, taskId]
          }
      } else {
        tasksByDueDate.noDueDate = {
          taskIds: [taskId],
          projectId: null,
          name: 'No Due Date',
          projectName: null,
          folderId: '0',
          dueDate: null,
          isDefault: true
      }
    }
        return tasksByDueDate;
      }, {});
      console.log(dueTasks);
      let emptyArr = [];
      const { pastDue, noDueDate, ...restOfDueTasks } = dueTasks;
      console.log(dueDates);
      dueDates.sort((a, b) => a - b);
      if (pastDue && noDueDate && dueDates.length > 0) {
        return [
          pastDue,
          ...dueDates.map(date => restOfDueTasks[date]),
          noDueDate
        ];
      } else if (pastDue && !noDueDate && dueDates.length > 0) {
        return [
          pastDue,
          ...dueDates.map(date => restOfDueTasks[date])
        ];
      } else if (noDueDate && !pastDue && dueDates.length > 0) {
        return [
          ...dueDates.map(date => restOfDueTasks[date]),
          noDueDate
        ];
      } else if (!pastDue && !noDueDate && dueDates.length > 0) {
        return [...dueDates.map(date => restOfDueTasks[date])];
      } else {
        return [];
      }
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
  const { tasksDueSoon } = state.currentUser;
  if (!tasksDueSoon) return [];
  return Object.keys(tasksDueSoon).map(taskId => tasksDueSoon[taskId]);
};

export const getMergedTags = state => {
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
