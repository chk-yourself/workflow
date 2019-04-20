import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import AuthUserContext from './context';
import * as ROUTES from '../../constants/routes';
import { getDisplayName } from '../../utils/react';
import { activeWorkspaceSelectors } from '../../ducks/activeWorkspace';

const withAuthorization = (condition) => WrappedComponent => {
  class WithAuthorization extends Component {

    render() {
      const { activeWorkspace, ...rest } = this.props;
      return (
        <AuthUserContext.Consumer>
          {currentUser => 
            condition(currentUser, activeWorkspace) ? (
              <WrappedComponent currentUser={currentUser} activeWorkspace={activeWorkspace} {...rest} />
            ) : null
          }
        </AuthUserContext.Consumer>
      );
    }
  }

  WithAuthorization.displayName = `WithAuthorization(${getDisplayName(
    WrappedComponent
  )})`;

  const mapStateToProps = state => {
    return {
      activeWorkspace: activeWorkspaceSelectors.getActiveWorkspace(state)
    };
  };

  return compose(
    withRouter,
    withFirebase,
    connect(
      mapStateToProps
    )
  )(WithAuthorization);
};

export default withAuthorization;
