import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { withAuthorization } from '../Session';
import { PopoverWrapper } from '../Popover';
import { Avatar } from '../Avatar';
import { Menu, MenuItem } from '../Menu';
import { SignOutButton } from '../SignOutButton';
import { SearchTypeahead } from '../Search';
import { WorkspaceSelect } from '../Workspace';
import { Button } from '../Button';
import { Icon } from '../Icon';
import * as ROUTES from '../../constants/routes';
import './Topbar.scss';

class Topbar extends Component {
  state = {
    isUserActionsVisible: false
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

  render() {
    const {
      currentUser,
      openWorkspaceComposer,
      openWorkspaceSettings
    } = this.props;
    const { isUserActionsVisible } = this.state;
    return (
      <>
        <div className="topbar">
          <SearchTypeahead />
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
                  onClick={openWorkspaceComposer}
                  disabled={currentUser.isGuest}
                >
                  <Icon name="plus" />
                  Create Workspace
                </Button>
              </MenuItem>
              <MenuItem>
                <Button
                  className="topbar__link"
                  onClick={openWorkspaceSettings}
                >
                  Workspace Settings
                </Button>
              </MenuItem>
              <MenuItem>
                <NavLink
                  className="topbar__link"
                  to={`/0/${currentUser.userId}/account`}
                >
                  Account Settings
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
        </div>
      </>
    );
  }
}

const condition = (currentUser, activeWorkspace) =>
  !!currentUser && !!activeWorkspace;

export default withAuthorization(condition)(Topbar);
