import * as types from './types';

export default (state = null, action) => {
  switch (action.type) {
    case types.SET_ACTIVE_WORKSPACE: {
      const { workspace } = action;
      return workspace;
    }
    case types.UPDATE_ACTIVE_WORKSPACE: {
      const { workspaceData } = action;
      return {
        ...state,
        ...workspaceData
      };
    }
    default:
      return state;
  }
};
