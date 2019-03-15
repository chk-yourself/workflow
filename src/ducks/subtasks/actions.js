import * as types from './types';
import firebase from '../../store/firebase';
import { setProjectLoadedState } from '../projects/actions';

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

export const fetchProjectSubtasks = projectId => {
  return async dispatch => {
    try {
      const subtasksById = await firebase.db
        .collection('subtasks')
        .where('projectId', '==', projectId)
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

export const fetchTaskSubtasks = taskId => {
  return async dispatch => {
    try {
      const subtasksById = await firebase.db
        .collection('subtasks')
        .where('taskId', '==', taskId)
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

export const removeSubtask = ({ subtaskId, taskId }) => {
  return {
    type: types.REMOVE_SUBTASK,
    subtaskId,
    taskId
  };
};

export const updateSubtask = ({ subtaskId, subtaskData }) => {
  return {
    type: types.UPDATE_SUBTASK,
    subtaskId,
    subtaskData
  };
};

export const syncProjectSubtasks = projectId => {
  return async (dispatch, getState) => {
    try {
      const subscription = await firebase
        .queryCollection('subtasks', ['projectId', '==', projectId])
        .onSnapshot(snapshot => {
          const changes = snapshot.docChanges();

          if (changes.length > 1) {
            const subtasksById = {};
            changes.forEach(change => {
              subtasksById[change.doc.id] = {
                subtaskId: change.doc.id,
                ...change.doc.data()
              };
            });
            dispatch(loadSubtasksById(subtasksById));
            dispatch(setProjectLoadedState(projectId, 'subtasks'));
          } else {
            console.log(changes);
            changes.forEach(async change => {
              const [subtaskId, subtaskData, changeType] = await Promise.all([
                change.doc.id,
                change.doc.data(),
                change.type
              ]);
              const { subtasksById } = getState();
              if (changeType === 'added') {
                if (subtaskId in subtasksById) return;
                dispatch(addSubtask({ subtaskId, subtaskData }));
                console.log(`Subtask added: ${subtaskData.name}`);
              } else if (changeType === 'removed') {
                if (subtaskId in subtasksById === false) return;
                const { taskId } = subtaskData;
                dispatch(removeSubtask({ subtaskId, taskId }));
                console.log(`Subtask deleted: ${subtaskData.name}`);
              } else {
                dispatch(updateSubtask({ subtaskId, subtaskData }));
                console.log(`Subtask updated: ${subtaskData.name}`);
              }
            });
          }
        });
      console.log(typeof subscription);
      return subscription;
    } catch (error) {
      console.log(error);
    }
  };
};
