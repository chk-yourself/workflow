import { combineReducers } from 'redux';
import { projectsById } from '../ducks/projects';
import { tasksById } from '../ducks/tasks';
import { listsById } from '../ducks/lists';
import { usersById } from '../ducks/users';
import { current } from '../ducks/current';
import { subtasksById } from '../ducks/subtasks';
import { commentsById } from '../ducks/comments';
import { dashboard } from '../ducks/dashboard';

export default combineReducers({
  projectsById,
  tasksById,
  listsById,
  usersById,
  current,
  subtasksById,
  commentsById,
  dashboard
});
