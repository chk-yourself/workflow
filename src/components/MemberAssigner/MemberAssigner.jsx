import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withAuthorization } from '../Session';
import { Icon } from '../Icon';
import { Avatar } from '../Avatar';
import { MemberSearch } from '../MemberSearch';
import { Popover } from '../Popover';
import { userSelectors } from '../../ducks/users';
import './MemberAssigner.scss';

class MemberAssigner extends Component {
  static defaultProps = {
    classes: {
      memberAssigner: '',
      avatar: '',
      avatarPlaceholder: '',
      popover: '',
      popoverWrapper: ''
    },
    placeholder: '',
    isMemberSearchDisabled: false,
    isSelfAssignmentDisabled: false,
    align: 'left',
    showOnlineStatus: false
  };

  static propTypes = {
    classes: PropTypes.shape({
      memberAssigner: PropTypes.string,
      avatar: PropTypes.string,
      avatarPlaceholder: PropTypes.string,
      popover: PropTypes.string,
      popoverWrapper: PropTypes.string
    }),
    placeholder: PropTypes.string,
    isMemberSearchDisabled: PropTypes.bool,
    isSelfAssignmentDisabled: PropTypes.bool,
    align: PropTypes.string,
    showOnlineStatus: PropTypes.bool
  };

  state = {
    isMemberSearchActive: false
  };

  toggleMemberSearch = () => {
    this.setState(prevState => ({
      isMemberSearchActive: !prevState.isMemberSearchActive
    }));
  };

  hideMemberSearch = e => {
    this.setState({
      isMemberSearchActive: false
    });
  };

  render() {
    const {
      members,
      onSelectMember,
      classes,
      memberIds,
      placeholder,
      isMemberSearchDisabled,
      isSelfAssignmentDisabled,
      align,
      showOnlineStatus,
      currentUser,
      activeWorkspace
    } = this.props;
    const { isMemberSearchActive } = this.state;

    const users = isSelfAssignmentDisabled
      ? this.props.users.filter(user => user.userId !== currentUser.userId)
      : this.props.users;

    return (
      <div className={`member-assigner ${classes.memberAssigner || ''}`}>
        <div className={`member-assigner__members ${classes.members || ''}`}>
          {members.map(member => {
            const { userId, name, photoURL, settings, status } = member;
            const isOnline =
              status &&
              status.state === 'online' &&
              settings.activeWorkspace === activeWorkspace.workspaceId;
            return (
              <Avatar
                classes={{
                  avatar: `member-assigner__avatar ${classes.avatar || ''}`,
                  placeholder: `member-assigner__avatar-placeholder ${classes.avatarPlaceholder ||
                    ''}`
                }}
                name={name}
                size="sm"
                variant="circle"
                imgSrc={photoURL}
                key={userId}
                showOnlineStatus={showOnlineStatus}
                isOnline={isOnline}
              />
            );
          })}
        </div>
        {!isMemberSearchDisabled && (
          <Popover
            isActive={isMemberSearchActive}
            onOutsideClick={this.hideMemberSearch}
            classes={{
              wrapper: `member-assigner__popover-wrapper ${classes.popoverWrapper || ''}`,
              popover: `member-assigner__popover ${classes.popover || ''}`
            }}
            buttonProps={{
              size: 'md',
              iconOnly: true,
              className: `member-assigner__btn--toggle-member-search ${classes.button} ${
                isMemberSearchActive ? 'is-active' : ''
              }`,
              children: <Icon name="plus" />,
              onClick: this.toggleMemberSearch
            }}
            align={{
              inner: align
            }}
          >
            {isMemberSearchActive && (
              <div className="member-assigner__search-container">
                <div className="member-assigner__icon-wrapper">
                  <Icon name="users" />
                </div>
                <MemberSearch
                  users={users}
                  placeholder={placeholder}
                  assignedMembers={memberIds}
                  onSelectMember={onSelectMember}
                  classes={{
                    wrapper: 'member-assigner__search-wrapper',
                    input: 'member-assigner__input',
                    list: 'member-assigner__list'
                  }}
                />
              </div>
            )}
          </Popover>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    users: userSelectors.getUsersArray(state),
    members: userSelectors.getMembersArray(state, ownProps.memberIds)
  };
};

const condition = (currentUser, activeWorkspace) => !!currentUser && !!activeWorkspace;

export default compose(
  connect(mapStateToProps),
  withAuthorization(condition)
)(MemberAssigner);
