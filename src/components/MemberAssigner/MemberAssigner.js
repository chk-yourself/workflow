import React, { Component } from 'react';
import { Icon } from '../Icon';
import { connect } from 'react-redux';
import { Avatar } from '../Avatar';
import { MemberSearch } from '../MemberSearch';
import { PopoverWrapper } from '../Popover';
import { userSelectors } from '../../ducks/users';
import { currentUserSelectors } from '../../ducks/currentUser';
import './MemberAssigner.scss';

class MemberAssigner extends Component {
  static defaultProps = {
    classes: {
      memberAssigner: '',
      avatar: '',
      avatarPlaceholder: '',
      popover: '',
      popoverWrapper: ''
    }
  }
  state = {
    isMemberSearchActive: false
  };

  toggleMemberSearch = () => {
    this.setState(prevState => ({
      isMemberSearchActive: !prevState.isMemberSearchActive
    }));
  }

  hideMemberSearch = e => {
    console.log(e.target);
    if (e.target.matches('.task-editor__btn--add-member')) return;
    this.setState({
      isMemberSearchActive: false
    });
  }

  render() {
    const { members, onMemberSelect, classes, usersArray, memberIds, users } = this.props;
    const { isMemberSearchActive } = this.state;

    return (
      <div className={`member-assigner ${classes.memberAssigner || ''}`}>
      <div className={`member-assigner__members ${classes.members || ''}`}>
      {members.map(member => (
      <Avatar
        classes={{
          avatar: `member-assigner__avatar ${classes.avatar || ''}`,
          placeholder: `member-assigner__avatar-placeholder ${classes.avatarPlaceholder || ''}`
        }}
        name={member.name}
        size="sm"
        variant="circle"
        imgSrc={member.photoURL}
        key={member.userId}
      />
    )
  )}
  </div>
  <PopoverWrapper
        isActive={isMemberSearchActive}
        onOutsideClick={this.hideMemberSearch}
        classes={{
          wrapper: `member-assigner__popover-wrapper ${classes.popoverWrapper || ''}`,
          popover: `member-assigner__popover ${classes.popover || ''}`
        }}
        buttonProps={{
          size: 'md',
          iconOnly: true,
          className: `member-assigner__btn--toggle-member-search ${classes.button} ${isMemberSearchActive ? 'is-active' : ''}`,
          children: <Icon name="plus" />,
          onClick: this.toggleMemberSearch
        }}
      >
      {isMemberSearchActive && (
        <div className="member-assigner__search-container">
        <div className="member-assigner__icon-wrapper">
        <Icon name="users" />
        </div>
         <MemberSearch
          users={users}
          assignedMembers={memberIds}
          onMemberClick={onMemberSelect}
          classes={{
            wrapper: 'member-assigner__search-wrapper',
            input: 'member-assigner__input',
            list: 'member-assigner__list'
            }}
        />
        </div>
        )}
      </PopoverWrapper>
  </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    userId: currentUserSelectors.getCurrentUserId(state),
    users: userSelectors.getUsersArray(state),
    members: userSelectors.getMembersArray(state, ownProps.memberIds),
  };
};

const mapDispatchToProps = dispatch => {
  return {
  };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(MemberAssigner);


