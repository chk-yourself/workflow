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

export const getSortedFilteredTaskGroups = state => {
  const { currentUser } = state;
  if (!currentUser) return [];
  const { settings, assignedTasks } = currentUser;
  const { sortBy, view } = settings.tasks;
  switch (sortBy) {
    case 'project': {
      const { tasksById } = state;
      if (!assignedTasks || !tasksById) return [];
      const projectTasks = assignedTasks.reduce((tasksByProject, taskId) => {
        const { projectId, projectName, isCompleted } = tasksById[taskId];
        if (view === 'active' && isCompleted) return tasksByProject;
        if (view === 'completed' && !isCompleted) return tasksByProject;
        if (projectId) {
          if (!(projectId in tasksByProject)) {
            tasksByProject[projectId] = {
              taskIds: [],
              projectId,
              name: projectName,
              projectName,
              dueDate: null,
              folderId: null,
              userPermissions: {
                canChangeName: false,
                canAddTasks: false
              }
            };
          }
          tasksByProject[projectId].taskIds = [
            ...tasksByProject[projectId].taskIds,
            taskId
          ];
        } else {
          if (!('noProject' in tasksByProject)) {
            tasksByProject.noProject = {
              projectId: null,
              projectName: null,
              dueDate: null,
              name: 'No project',
              folderId: '0',
              taskIds: [],
              userPermissions: {
                canChangeName: false,
                canAddTasks: true
              }
            };
          }
          tasksByProject.noProject.taskIds = [
            ...tasksByProject.noProject.taskIds,
            taskId
          ];
        }
        return tasksByProject;
      }, {});
      const { noProject, ...restOfProjectTasks } = projectTasks;
      return [
        ...Object.keys(restOfProjectTasks).map(
          projectId => restOfProjectTasks[projectId]
        ),
        ...(noProject ? [noProject] : [])
      ];
    }
    case 'folder': {
      const { folders } = currentUser;
      if (!folders) return [];
      const { tasksById } = state;
      return Object.keys(folders).map(folderId => {
        const { taskIds } = folders[folderId];
        return {
          ...folders[folderId],
          taskIds:
            view === 'active'
              ? taskIds.filter(taskId => !tasksById[taskId].isCompleted)
              : view === 'completed'
              ? taskIds.filter(taskId => tasksById[taskId].isCompleted)
              : taskIds,
          projectId: null,
          projectName: null,
          dueDate: null,
          userPermissions: {
            canChangeName:
              folderId !== '0' &&
              folderId !== '1' &&
              folderId !== '2' &&
              folderId !== '3',
            canAddTasks: true
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
            tasksByDueDate[dueDate.toMillis()] = {
              taskIds: [],
              projectId: null,
              name: toDateString(dueDate.toDate(), {
                useRelative: true,
                format: { month: 'short', day: 'numeric' }
              }),
              projectName: null,
              folderId: '0',
              dueDate: dueDate.toMillis(),
              userPermissions: {
                canChangeName: false,
                canAddTasks: true
              }
            };
            dueDates = [...dueDates, dueDate.toMillis()];
          }
          tasksByDueDate[dueDate.toMillis()].taskIds = [
            ...tasksByDueDate[dueDate.toMillis()].taskIds,
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
                canChangeName: false,
                canAddTasks: false
              }
            };
          }
          tasksByDueDate.pastDue.taskIds = [
            ...tasksByDueDate.pastDue.taskIds,
            taskId
          ];
        } else {
          if (!('noDueDate' in tasksByDueDate)) {
            tasksByDueDate.noDueDate = {
              taskIds: [],
              projectId: null,
              name: 'No Due Date',
              projectName: null,
              folderId: '0',
              dueDate: null,
              userPermissions: {
                canChangeName: false,
                canAddTasks: true
              }
            };
          }
          tasksByDueDate.noDueDate.taskIds = [
            ...tasksByDueDate.noDueDate.taskIds,
            taskId
          ];
        }
        console.log(tasksByDueDate);
        return tasksByDueDate;
      }, {});
      const { pastDue, noDueDate, ...restOfDueTasks } = dueTasks;
      const sortedDueDates = [...dueDates].sort((a, b) => a - b);
      return [
        ...(pastDue ? [pastDue] : []),
        ...sortedDueDates.map(date => restOfDueTasks[date]),
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
