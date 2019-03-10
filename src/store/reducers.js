import { combineReducers } from 'redux';
import { projectsById } from '../ducks/projects';
import { tasksById } from '../ducks/tasks';
import { listsById } from '../ducks/lists';
import { usersById } from '../ducks/users';
import { current } from '../ducks/current';
import { subtasksById } from '../ducks/subtasks';
import { commentsById } from '../ducks/comments';
import { currentUser } from '../ducks/currentUser';

export default combineReducers({
  currentUser,
  projectsById,
  tasksById,
  listsById,
  usersById,
  current,
  subtasksById,
  commentsById
});
