export const getUsersById = state => {
  return state.usersById;
};

export const getUserData = (state, userId) => {
  return state.usersById[userId];
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
  return memberIds.map(memberId => usersById[memberId]);
};
