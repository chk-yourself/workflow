import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { userSelectors } from '../../ducks/users';
import { PopoverWrapper } from '../Popover';
import { Avatar } from '../Avatar';
import { Menu, MenuItem } from '../Menu';
import { SignOutButton } from '../SignOut';
import { SearchBar } from '../SearchBar';
import * as ROUTES from '../../constants/routes';
import './Topbar.scss';

class Topbar extends Component {
  render() {
    const { currentUser } = this.props;
    return (
      <div className="topbar">
      <SearchBar />
        {currentUser && (
          <PopoverWrapper
            classes={{
              wrapper: 'topbar__user-actions-wrapper',
              popover: 'topbar__user-actions'
            }}
            alignOuter="right"
            alignInner="right"
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
                  fullName={currentUser.name}
                  size="sm"
                  variant="circle"
                  imgSrc={currentUser.photoURL}
                />
              )
            }}
          >
            <Menu>
              <MenuItem>
                <NavLink className="topbar__link" to={ROUTES.ACCOUNT}>
                  My Account
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
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: userSelectors.getCurrentUserData(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Topbar);
