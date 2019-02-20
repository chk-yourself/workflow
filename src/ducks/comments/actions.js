import * as types from './types';
import firebase from '../../store/firebase';

export const loadCommentsById = commentsById => {
  return {
    type: types.LOAD_COMMENTS_BY_ID,
    commentsById
  };
};

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

export const updateCommentsById = comment => {
  return {
    type: types.UPDATE_COMMENTS_BY_ID,
    comment
  };
};

export const fetchCardComments = cardId => {
  return async dispatch => {
    try {
      const commentsById = await firebase.db
        .collection('comments')
        .where('cardId', '==', cardId)
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

export const addComment = ({ commentId, commentData }) => {
  return {
    type: types.ADD_COMMENT,
    commentId,
    commentData
  };
};

export const deleteComment = commentId => {
  return {
    type: types.DELETE_COMMENT,
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
