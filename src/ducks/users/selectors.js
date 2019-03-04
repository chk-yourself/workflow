export const getUsersById = state => {
  return state.usersById;
};

export const getUserData = (state, userId) => {
  return state.usersById[userId];
};

export const getUserTaskIds = (state, userId) => {
  const { taskIds } = state.usersById[userId];
  if (!taskIds) return [];
  return taskIds;
};

export const getCurrentUserData = state => {
  const currentUserId = state.current.userId;
  return state.usersById[currentUserId];
};

// returns array of all users
export const getUsersArray = state => {
  const { usersById } = state;
  return Object.keys(usersById).map(userId => {
    return {
      userId,
      ...usersById[userId]
    };
  });
};

// returns subset of users
export const getMembersArray = (state, memberIds) => {
  const { usersById } = state;
  if (!memberIds) return [];
  return memberIds.map(memberId => usersById[memberId]);
};
