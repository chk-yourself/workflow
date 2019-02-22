import React, { Component } from 'react';

import { Input } from '../Input';
import { Avatar } from '../Avatar';
import { Icon } from '../Icon';
import * as keys from '../../constants/keys';
import './MemberSearch.scss';

export default class MemberSearch extends Component {
  state = {
    query: '',
    isActive: false,
    isTouchEnabled: false,
    selectedMember: '',
    selectedIndex: null,
    filteredList: this.props.users
  };

  componentDidMount() {
    document.addEventListener('touchstart', this.handleTouch);
    document.addEventListener('click', this.handleOutsideClick, false);
    this.inputEl.focus();
  }

  handleOutsideClick = e => {
    if (this.state.query !== '') return;
    if (!this.memberSearchEl.contains(e.target)) {
      this.setState({
        isActive: false
      });
    }
  };

  handleTouch = () => {
    this.setState({
      isTouchEnabled: true
    });
    // remove touch handler to prevent unnecessary refires
    document.removeEventListener('touchstart', this.handleTouch);
    // remove outside click handler from click events
    document.removeEventListener('click', this.handleOutsideClick);
    // reattach outside click handler to touchstart events
    document.addEventListener('touchstart', this.handleOutsideClick);
  };

  matchUser = (user, query) => {
    const { name, email, username } = user;
    const regExp = new RegExp(query, 'i');
    return regExp.test(name) || regExp.test(email) || regExp.test(username);
  };

  onFocus = e => {
    this.setState({
      isActive: true
    });
  };

  onReset = e => {
    this.setState({
      query: '',
      isActive: false,
      isTouchEnabled: false,
      selectedMember: '',
      selectedIndex: null,
      filteredList: this.props.users
    });
  };

  onChange = e => {
    const { users } = this.props;
    const { selectedMember, selectedIndex } = this.state;
    const query = e.target.value;
    const filteredList = users.filter(user => this.matchUser(user, query));
    const newIndex = filteredList.indexOf(selectedMember);
    const persistSelectedMember = newIndex !== -1;

    this.setState({
      selectedMember: persistSelectedMember
        ? selectedMember
        : filteredList.length > 0
        ? filteredList[0].userId
        : '',
      selectedIndex: persistSelectedMember ? newIndex : 0,
      query,
      filteredList
    });
  };

  onKeyDown = e => {
    if (
      e.key !== keys.TAB &&
      e.key !== keys.ARROW_DOWN &&
      e.key !== keys.ARROW_UP &&
      e.key !== keys.ENTER
    )
      return;

    const { filteredList, selectedIndex, selectedMember } = this.state;
    const { onMemberClick } = this.props;
    const nextIndex =
      selectedIndex === filteredList.length - 1 ? 0 : selectedIndex + 1;
    const prevIndex =
      selectedIndex === 0 ? filteredList.length - 1 : selectedIndex - 1;

    // eslint-disable-next-line default-case
    switch (e.key) {
      case keys.ARROW_DOWN:
      // eslint-disable-next-line no-fallthrough
      case keys.TAB: {
        this.setState({
          selectedMember: filteredList[nextIndex].userId,
          selectedIndex: nextIndex
        });
        break;
      }
      case keys.ARROW_UP: {
        this.setState({
          selectedMember: filteredList[prevIndex].userId,
          selectedIndex: prevIndex
        });
        break;
      }
      case keys.ENTER: {
        if (selectedMember === '') return;
        onMemberClick(selectedMember);
        break;
      }
    }

    e.preventDefault();
  };

  componentWillUnmount() {
    const { isTouchEnabled } = this.state;

    if (isTouchEnabled) {
      document.removeEventListener('touchstart', this.handleOutsideClick);
    } else {
      document.removeEventListener('click', this.handleOutsideClick);
      document.removeEventListener('touchstart', this.handleTouch);
    }
  }

  render() {
    const { users, onMemberClick, assignedMembers } = this.props;
    const { query, isActive, filteredList, selectedMember } = this.state;

    return (
      <div
        className="member-search__wrapper"
        ref={el => (this.memberSearchEl = el)}
      >
        <Input
          name="query"
          className="member-search"
          onChange={this.onChange}
          value={query}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          type="text"
          autoComplete="off"
          hideLabel
          placeholder="Assign or remove member"
          onKeyDown={this.onKeyDown}
          inputRef={el => (this.inputEl = el)}
        />
        {isActive && (
          <ul className="member-search__list">
            {filteredList.length > 0 ? (
              filteredList.map((user, i) => {
                const { name, photoURL, email, username, userId } = user;
                const isAssigned =
                  assignedMembers && assignedMembers.indexOf(userId) !== -1;
                return (
                  <li
                    className={`member-search__item ${
                      selectedMember === userId ? 'is-selected' : ''
                    }`}
                    onClick={() => onMemberClick(userId)}
                    key={userId}
                    id={userId}
                  >
                    <Icon name={isAssigned ? 'user-minus' : 'user-plus'} />
                    <Avatar
                      classes={{
                        avatar: 'member-search__avatar--sm',
                        placeholder: 'member-search__avatar-placeholder--sm'
                      }}
                      fullName={name}
                      size="sm"
                      variant="circle"
                      imgSrc={photoURL}
                    />
                    <span className="member-search__info member-search__name">
                      {name}
                    </span>
                    <span className="member-search__info member-search__username">
                      {username}
                    </span>
                    <span className="member-search__info member-search__email">
                      {email}
                    </span>
                  </li>
                );
              })
            ) : (
              <li className="member-search__item">
                <span className="member-search__no-match">
                  No matches found
                </span>
              </li>
            )}
          </ul>
        )}
      </div>
    );
  }
}
