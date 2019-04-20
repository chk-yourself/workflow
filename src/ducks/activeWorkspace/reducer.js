import * as types from './types';

const INITIAL_STATE = null;
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_ACTIVE_WORKSPACE: {
      const { workspace } = action;
      return workspace;
    }
    case types.RESET_ACTIVE_WORKSPACE: {
      return INITIAL_STATE;
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
