import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { currentUserSelectors } from '../../ducks/currentUser';
import { PopoverWrapper } from '../Popover';
import { Avatar } from '../Avatar';
import { Menu, MenuItem } from '../Menu';
import { SignOutButton } from '../SignOutButton';
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
