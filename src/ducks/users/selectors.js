export const getUsersById = state => {
  return state.usersById;
};

export const getUserData = (state, userId) => {
  return state.usersById[userId];
};
