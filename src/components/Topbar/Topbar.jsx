import React from 'react';
import { NavLink } from 'react-router-dom';
import { withAuthorization } from '../Session';
import { Popover } from '../Popover';
import { Avatar } from '../Avatar';
import { Menu, MenuItem } from '../Menu';
import { SignOutButton } from '../SignOutButton';
import { SearchTypeahead } from '../Search';
import { WorkspaceSelect } from '../Workspace';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { useToggle } from '../../hooks/useToggle';
import './Topbar.scss';

const Topbar = ({
  currentUser,
  openWorkspaceComposer,
  openWorkspaceSettings,
  openAccountSettings
}) => {
  const [isUserActionsVisible, toggleUserActions] = useToggle(false);
  return (
    <>
      <div className="topbar">
        <SearchTypeahead />
        <Popover
          isActive={isUserActionsVisible}
          onOutsideClick={toggleUserActions}
          classes={{
            wrapper: 'topbar__user-actions-wrapper',
            popover: 'topbar__user-actions'
          }}
          align={{ outer: 'right', inner: 'right' }}
          buttonProps={{
            onClick: toggleUserActions,
            size: 'sm',
            iconOnly: true,
            ariaLabel: 'Toggle more user actions',
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
                src={currentUser.photoURL}
              />
            )
          }}
        >
          <WorkspaceSelect />
          <Menu onClick={toggleUserActions}>
            <MenuItem className="user-actions__item--create-workspace">
              <Button
                className="topbar__link"
                onClick={openWorkspaceComposer}
                disabled={currentUser.isGuest}
              >
                <Icon name="plus" />
                Create Workspace
              </Button>
            </MenuItem>
            <MenuItem className="user-actions__item--open-workspace-settings">
              <Button className="topbar__link" onClick={openWorkspaceSettings}>
                Workspace Settings
              </Button>
            </MenuItem>
            <MenuItem>
              <Button className="topbar__link" onClick={openAccountSettings}>
                Account Settings
              </Button>
            </MenuItem>
            <MenuItem>
              <NavLink className="topbar__link" to={`/0/${currentUser.userId}/profile`}>
                My Profile
              </NavLink>
            </MenuItem>
            <MenuItem>
              <SignOutButton className="topbar__link" />
            </MenuItem>
          </Menu>
        </Popover>
      </div>
    </>
  );
};

const condition = (currentUser, activeWorkspace) => !!currentUser && !!activeWorkspace;

export default withAuthorization(condition)(Topbar);
