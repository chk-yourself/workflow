import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { currentUserSelectors } from '../../ducks/currentUser';
import { PopoverWrapper } from '../Popover';
import { Avatar } from '../Avatar';
import { Menu, MenuItem } from '../Menu';
import { SignOutButton } from '../SignOutButton';
import { SearchTypeahead } from '../Search';
import './Topbar.scss';

const Topbar = ({ currentUser }) => (
  <div className="topbar">
    <SearchTypeahead />
    {currentUser && (
      <PopoverWrapper
        classes={{
          wrapper: 'topbar__user-actions-wrapper',
          popover: 'topbar__user-actions'
        }}
        align={{ outer: 'right', inner: 'right' }}
        buttonProps={{
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
        <Menu>
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
);

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
