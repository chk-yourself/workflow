import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { currentUserSelectors } from '../../ducks/currentUser';
import { PopoverWrapper } from '../Popover';
import { Avatar } from '../Avatar';
import { Menu, MenuItem } from '../Menu';
import { SignOutButton } from '../SignOutButton';
import { SearchTypeahead } from '../Search';
import {
  WorkspaceSelect,
  WorkspaceComposer,
  WorkspaceSettings
} from '../Workspace';
import { Button } from '../Button';
import { Icon } from '../Icon';
import './Topbar.scss';

class Topbar extends Component {
  state = {
    isUserActionsVisible: false,
    isWorkspaceComposerActive: false,
    isWorkspaceSettingsActive: false
  };

  toggleUserActions = () => {
    this.setState(prevState => ({
      isUserActionsVisible: !prevState.isUserActionsVisible
    }));
  };

  hideUserActions = () => {
    this.setState({
      isUserActionsVisible: false
    });
  };

  toggleWorkspaceComposer = () => {
    this.setState(prevState => ({
      isWorkspaceComposerActive: !prevState.isWorkspaceComposerActive
    }));
  };

  closeWorkspaceComposer = () => {
    this.setState({
      isWorkspaceComposerActive: false
    });
  };

  toggleWorkspaceSettings = () => {
    this.setState(prevState => ({
      isWorkspaceSettingsActive: !prevState.isWorkspaceSettingsActive
    }));
  };

  closeWorkspaceSettings = () => {
    this.setState({
      isWorkspaceSettingsActive: false
    });
  };

  render() {
    const { currentUser } = this.props;
    const {
      isUserActionsVisible,
      isWorkspaceComposerActive,
      isWorkspaceSettingsActive
    } = this.state;
    return (
      <>
        <div className="topbar">
          <SearchTypeahead />
          {currentUser && (
            <PopoverWrapper
              isActive={isUserActionsVisible}
              onOutsideClick={this.hideUserActions}
              classes={{
                wrapper: 'topbar__user-actions-wrapper',
                popover: 'topbar__user-actions'
              }}
              align={{ outer: 'right', inner: 'right' }}
              buttonProps={{
                onClick: this.toggleUserActions,
                size: 'sm',
                iconOnly: true,
                className: 'topbar__btn--user-actions',
                children: (
                  <Avatar
                    classes={{
                      avatar: 'topbar__avatar',
                      placeholder: 'topbar__avatar-placeholder'
                    }}
                    name={currentUser.name}
                    size="sm"
                    variant="circle"
                    imgSrc={currentUser.photoURL}
                  />
                )
              }}
            >
              <WorkspaceSelect />
              <Menu onClick={this.toggleUserActions}>
                <MenuItem>
                  <Button
                    className="topbar__link"
                    onClick={this.toggleWorkspaceComposer}
                  >
                    <Icon name="plus" />
                    Create Workspace
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button
                    className="topbar__link"
                    onClick={this.toggleWorkspaceSettings}
                  >
                    Workspace Settings
                  </Button>
                </MenuItem>
                <MenuItem>
                  <NavLink
                    className="topbar__link"
                    to={`/0/${currentUser.userId}/account`}
                  >
                    My Account
                  </NavLink>
                </MenuItem>
                <MenuItem>
                  <NavLink
                    className="topbar__link"
                    to={`/0/${currentUser.userId}/profile`}
                  >
                    My Profile
                  </NavLink>
                </MenuItem>
                <MenuItem>
                  <SignOutButton className="topbar__link" />
                </MenuItem>
              </Menu>
            </PopoverWrapper>
          )}
        </div>
        {isWorkspaceComposerActive && (
          <WorkspaceComposer onClose={this.closeWorkspaceComposer} />
        )}
        {isWorkspaceSettingsActive && (
          <WorkspaceSettings onClose={this.closeWorkspaceSettings} />
        )}
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: currentUserSelectors.getCurrentUser(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Topbar);
