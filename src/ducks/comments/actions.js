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
      const commentsById = await firebase.db
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
      const commentsById = await firebase.db
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
      const commentsById = await firebase.db
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
      const subscription = await firebase.db
      .collection('comments')
      .where('taskId', '==', taskId)
      .onSnapshot(async snapshot => {
        const changes = await snapshot.docChanges();
        const isInitialLoad = changes.every(change => change.type === 'added');

        if (isInitialLoad && changes.length > 1) {
          let comments = {};
          changes.forEach(change => {
            const commentId = change.doc.id;
            if (commentId in getState().commentsById) return;
            const commentData = change.doc.data();
            comments[commentId] = {
              commentId,
              ...commentData
            };
          });
          dispatch(loadCommentsById(comments));
          dispatch(setTaskLoadedState(taskId, 'comments'));
        } else {
          changes.forEach(change => {
            const commentId = change.doc.id;
            const commentData = change.doc.data();
            if (change.type === 'added') {
              const { createdAt } = commentData;
              if (commentId in getState().commentsById) return;
              dispatch(addComment({ commentId, commentData }));
            } else if (change.type === 'removed') {
              dispatch(removeComment(commentId));
            } else {
              if (!(commentId in getState().commentsById)) {
                dispatch(addComment({ commentId, commentData }));
              } else {
                dispatch(updateComment({ commentId, commentData }));
              }
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