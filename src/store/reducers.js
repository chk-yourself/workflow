import { combineReducers } from 'redux';
import { projectsById } from '../ducks/projects';
import { tasksById } from '../ducks/tasks';
import { listsById } from '../ducks/lists';
import { usersById } from '../ducks/users';
import { subtasksById } from '../ducks/subtasks';
import { commentsById } from '../ducks/comments';
import { currentUser } from '../ducks/currentUser';
import { selectedTask } from '../ducks/selectedTask';
import { selectedProject } from '../ducks/selectedProject';
import { activeWorkspace } from '../ducks/activeWorkspace';

export default combineReducers({
  currentUser,
  activeWorkspace,
  projectsById,
  listsById,
  tasksById,
  usersById,
  subtasksById,
  commentsById,
  selectedTask,
  selectedProject
});
