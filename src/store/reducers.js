import { combineReducers } from 'redux';
import { boardsById } from '../ducks/boards';
import { cardsById } from '../ducks/cards';
import { listsById } from '../ducks/lists';
import { user } from '../ducks/user';
import { current } from '../ducks/current';
import { tasksById } from '../ducks/tasks';

export default combineReducers({
  boardsById,
  cardsById,
  listsById,
  user,
  current,
  tasksById
});
