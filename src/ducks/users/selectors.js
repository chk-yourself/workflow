export const getUsersById = state => {
  return state.usersById;
};

export const getUserData = (state, userId) => {
  const { usersById } = state;
  return usersById ? usersById[userId] : null;
};

export const getUserTaskIds = (state, userId) => {
  const { taskIds } = state.usersById[userId];
  if (!taskIds) return [];
  return taskIds;
};

// returns array of all users
export const getUsersArray = state => {
  const { usersById } = state;
  return usersById
    ? Object.keys(usersById).map(userId => usersById[userId])
    : [];
};

// returns array of user emails
export const getUserEmails = state => {
  const { usersById } = state;
  return usersById ? Object.keys(usersById).map(userId => usersById[userId].email) : [];
};

// returns subset of users
export const getMembersArray = (state, memberIds) => {
  const { usersById } = state;
  if (!memberIds || !usersById) return [];
  return memberIds.map(memberId => usersById[memberId]);
};
