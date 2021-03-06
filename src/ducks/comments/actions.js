import * as types from './types';
import { setTaskLoadedState } from '../tasks/actions';
import firebase from '../../store/firebase';

export const loadCommentsById = commentsById => {
  return {
    type: types.LOAD_COMMENTS_BY_ID,
    commentsById
  };
};

export const addComment = ({ commentId, commentData }) => {
  return {
    type: types.ADD_COMMENT,
    commentId,
    commentData
  };
};

export const removeComment = commentId => {
  return {
    type: types.REMOVE_COMMENT,
    commentId
  };
};

export const updateComment = ({ commentId, commentData }) => {
  return {
    type: types.UPDATE_COMMENT,
    commentId,
    commentData
  };
};

// Thunks

export const fetchCommentsById = () => {
  return async dispatch => {
    try {
      const commentsById = await firebase.fs
        .collection('comments')
        .get()
        .then(snapshot => {
          const comments = {};
          snapshot.forEach(doc => {
            comments[doc.id] = {
              commentId: doc.id,
              ...doc.data()
            };
          });
          return comments;
        });
      dispatch(loadCommentsById(commentsById));
    } catch (error) {
      console.log(error);
    }
  };
};

export const fetchTaskComments = taskId => {
  return async dispatch => {
    try {
      const commentsById = await firebase.fs
        .collection('comments')
        .where('taskId', '==', taskId)
        .get()
        .then(snapshot => {
          const comments = {};
          snapshot.forEach(doc => {
            comments[doc.id] = {
              commentId: doc.id,
              ...doc.data()
            };
          });
          return comments;
        });
      dispatch(loadCommentsById(commentsById));
    } catch (error) {
      console.log(error);
    }
  };
};

export const fetchUserComments = userId => {
  return async dispatch => {
    try {
      const commentsById = await firebase.fs
        .collection('comments')
        .where('to', 'array-contains', userId)
        .get()
        .then(snapshot => {
          const comments = {};
          snapshot.forEach(doc => {
            comments[doc.id] = {
              commentId: doc.id,
              ...doc.data()
            };
          });
          return comments;
        });
      dispatch(loadCommentsById(commentsById));
    } catch (error) {
      console.log(error);
    }
  };
};

export const syncTaskComments = taskId => {
  return async (dispatch, getState) => {
    try {
      const subscription = await firebase.fs
        .collection('comments')
        .where('taskId', '==', taskId)
        .onSnapshot(async snapshot => {
          const changes = await snapshot.docChanges();
          const { tasksById } = getState();
          const task = tasksById[taskId];
          const isInitialLoad =
            snapshot.size === changes.length &&
            changes.every(change => change.type === 'added');

          if (isInitialLoad) {
            const comments = {};
            changes.forEach(change => {
              const commentId = change.doc.id;
              const commentData = change.doc.data();
              comments[commentId] = {
                commentId,
                ...commentData
              };
            });
            dispatch(loadCommentsById(comments));
            if (!task.isLoaded.comments) {
              dispatch(setTaskLoadedState(taskId, 'comments'));
            }
          } else {
            changes.forEach(change => {
              const commentId = change.doc.id;
              const commentData = change.doc.data();
              const { commentsById } = getState();
              if (change.type === 'added') {
                if (commentsById && commentId in commentsById) return;
                dispatch(addComment({ commentId, commentData }));
              } else if (change.type === 'removed') {
                if (!(commentId in commentsById)) return;
                dispatch(removeComment(commentId));
              } else {
                dispatch(updateComment({ commentId, commentData }));
              }
            });
          }
        });
      return subscription;
    } catch (error) {
      console.error(error);
    }
  };
};
