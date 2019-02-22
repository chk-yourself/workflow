export const getUsersById = state => {
  return state.usersById;
};

export const getUserData = (state, userId) => {
  return state.usersById[userId];
};

export const getUsersArray = state => {
  const { usersById } = state;
  return Object.keys(usersById).map(userId => {
    return {
      userId,
      ...usersById[userId]
    };
  });
};
