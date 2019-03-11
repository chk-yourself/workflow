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

export const getFolderIds = state => {
  const { currentUser } = state;
  if (!currentUser) return [];
  return currentUser.folderIds;
};

export const getFoldersArray = state => {
  const { currentUser } = state;
  if (!currentUser) return [];
  const { folders } = currentUser;
  if (!folders) return [];
  return Object.keys(folders).map(folderId => {
    return {
      ...folders[folderId],
      isDefault:
        folderId === '0' ||
        folderId === '1' ||
        folderId === '2' ||
        folderId === '3'
    };
  });
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
