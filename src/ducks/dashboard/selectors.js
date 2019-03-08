export const getTasksDueSoonById = state => {
  return state.dashboard.tasksDueSoon;
};

export const getTasksDueSoonArr = state => {
  const { tasksDueSoon } = state.dashboard;
  return Object.keys(tasksDueSoon).map(taskId => tasksDueSoon[taskId]);
};
