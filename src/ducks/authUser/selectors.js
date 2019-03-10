export const getAuthUser = state => {
  return state.authUser;
};

export const getAuthUserId = state => {
  return state.authUser.userId;
};

export const getFolders = state => {
  const { authUser } = state;
  return authUser.folders;
};

export const getFolderIds = state => {
  const { authUser } = state;
  return authUser.folderIds;
};

export const getFoldersArray = state => {
  const { folders } = state.authUser;
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
  const { authUser } = state;
  return authUser.folders[folderId];
};
