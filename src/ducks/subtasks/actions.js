import * as types from './types';
import firebase from '../../store/firebase';

export const loadSubtasksById = subtasksById => {
  return {
    type: types.LOAD_SUBTASKS_BY_ID,
    subtasksById
  };
};

export const fetchSubtasksById = () => {
  return async dispatch => {
    try {
      const subtasksById = await firebase.db
        .collection('subtasks')
        .get()
        .then(snapshot => {
          const subtasks = {};
          snapshot.forEach(doc => {
            subtasks[doc.id] = {
              subtaskId: doc.id,
              ...doc.data()
            };
          });
          return subtasks;
        });
      dispatch(loadSubtasksById(subtasksById));
    } catch (error) {
      console.log(error);
    }
  };
};

export const updateSubtasksById = subtask => {
  return {
    type: types.UPDATE_SUBTASKS_BY_ID,
    subtask
  };
};

export const fetchCardSubtasks = boardId => {
  return async dispatch => {
    try {
      const subtasksById = await firebase.db
        .collection('subtasks')
        .where('boardId', '==', boardId)
        .get()
        .then(snapshot => {
          const subtasks = {};
          snapshot.forEach(doc => {
            subtasks[doc.id] = {
              subtaskId: doc.id,
              ...doc.data()
            };
          });
          return subtasks;
        });
      dispatch(loadSubtasksById(subtasksById));
    } catch (error) {
      console.log(error);
    }
  };
};

export const fetchUserSubtasks = userId => {
  return async dispatch => {
    try {
      const subtasksById = await firebase.db
        .collection('subtasks')
        .where('assignedTo', 'array-contains', userId)
        .get()
        .then(snapshot => {
          const subtasks = {};
          snapshot.forEach(doc => {
            subtasks[doc.id] = {
              subtaskId: doc.id,
              ...doc.data()
            };
          });
          return subtasks;
        });
      dispatch(loadSubtasksById(subtasksById));
    } catch (error) {
      console.log(error);
    }
  };
};

export const addSubtask = ({ subtaskId, subtaskData }) => {
  return {
    type: types.ADD_SUBTASK,
    subtaskId,
    subtaskData
  };
};

export const deleteSubtask = subtaskId => {
  return {
    type: types.DELETE_SUBTASK,
    subtaskId
  };
};

export const updateSubtask = ({ subtaskId, subtaskData }) => {
  return {
    type: types.UPDATE_SUBTASK,
    subtaskId,
    subtaskData
  };
};
