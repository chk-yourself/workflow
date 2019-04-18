import * as types from './types';
import firebase from '../../store/firebase';

export const setActiveWorkspace = workspace => {
  return {
    type: types.SET_ACTIVE_WORKSPACE,
    workspace
  };
};

export const updateActiveWorkspace = workspaceData => {
  return {
    type: types.UPDATE_ACTIVE_WORKSPACE,
    workspaceData
  };
};

// Thunks

export const syncActiveWorkspace = workspaceId => {
  return async (dispatch, getState) => {
    try {
      const subscription = await firebase
        .getDocRef('workspaces', workspaceId)
        .onSnapshot(snapshot => {
          const workspaceData = snapshot.data();
          workspaceData.workspaceId = workspaceId;
          const { activeWorkspace } = getState();
          if (!activeWorkspace || activeWorkspace.workspaceId !== workspaceId) {
            dispatch(setActiveWorkspace(workspaceData));
          } else {
            dispatch(updateActiveWorkspace(workspaceData));
          }
        });
      return subscription;
    } catch (error) {
      console.error(error);
    }
  };
};