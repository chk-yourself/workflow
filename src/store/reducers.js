import { combineReducers } from 'redux';
import { boardsById } from '../ducks/boards';
import { cardsById } from '../ducks/cards';
import { listsById } from '../ducks/lists';
import { usersById } from '../ducks/users';
import { current } from '../ducks/current';
import { tasksById } from '../ducks/tasks';
import { commentsById } from '../ducks/comments';

export default combineReducers({
  boardsById,
  cardsById,
  listsById,
  usersById,
  current,
  tasksById,
  commentsById
});
