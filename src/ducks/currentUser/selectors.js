export const getCurrentUser = state => {
  return state.currentUser;
};

export const getCurrentUserId = state => {
  return state.currentUser.userId;
};

export const getFolders = state => {
  const { currentUser } = state;
  return currentUser.folders;
};

export const getFolderIds = state => {
  const { currentUser } = state;
  return currentUser.folderIds;
};

export const getFoldersArray = state => {
  const { folders } = state.currentUser;
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
  return currentUser.folders[folderId];
};

export const getTasksDueSoonById = state => {
  return state.currentUser.tasksDueSoon;
};

export const getTasksDueSoonArr = state => {
  const { tasksDueSoon } = state.currentUser;
  if (!tasksDueSoon) return [];
  return Object.keys(tasksDueSoon).map(taskId => tasksDueSoon[taskId]);
};
