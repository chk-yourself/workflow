import React, { Component } from 'react';

import { Input } from '../Input';
import { Avatar } from '../Avatar';
import { Icon } from '../Icon';
import { withOutsideClick } from '../withOutsideClick';
import * as keys from '../../constants/keys';
import './MemberSearch.scss';

class MemberSearch extends Component {
  static defaultProps = {
    style: null,
    anchor: null,
    classes: {
      avatar: '',
      avatarPlaceholder: '',
      wrapper: '',
      input: '',
      list: '',
      item: '',
      info: '',
      noMatch: ''
    },
    placeholder: '',
    type: 'text',
    query: null
  };

  state = {
    query: '',
    isActive: false,
    selectedMember: '',
    selectedIndex: null,
    filteredList: this.props.users
  };

  componentDidMount() {
    const { type } = this.props;
    if (type === 'hidden') return;
    this.inputEl.focus();
  }

  componentDidUpdate(prevProps) {
    const { type, query } = this.props;
    if (type === 'hidden' && query && query !== prevProps.query) {
      this.updateList(query);
    }
  }

  onOutsideClick = e => {
    if (this.props.query) return;
    if (this.state.query !== '') return;
    this.setState({
      isActive: false
    });
  };

  matchUser = (user, query) => {
    if (query === '') return false;
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
      selectedMember: '',
      selectedIndex: null,
      filteredList: this.props.users
    });
  };

  onChange = e => {
    const query = e.target.value;
    this.updateList(query);
  };

  updateList = query => {
    const { users } = this.props;
    const { selectedMember } = this.state;
    const filteredList = users.filter(user => this.matchUser(user, query));
    const newIndex = filteredList.findIndex(
      item => item.userId === selectedMember
    );
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

    const { filteredList, selectedIndex, selectedMember, query } = this.state;
    const lastIndex = filteredList.length - 1;
    const nextIndex = selectedIndex === lastIndex ? 0 : selectedIndex + 1;
    const prevIndex = selectedIndex === 0 ? lastIndex : selectedIndex - 1;

    // eslint-disable-next-line default-case
    switch (e.key) {
      case keys.ARROW_DOWN:
      // eslint-disable-next-line no-fallthrough
      case keys.TAB: {
        this.setState({
          selectedMember: !query
            ? filteredList[0].userId
            : filteredList[nextIndex].userId,
          selectedIndex: !query ? 0 : nextIndex
        });
        break;
      }
      case keys.ARROW_UP: {
        this.setState({
          selectedMember: !query
            ? filteredList[lastIndex].userId
            : filteredList[prevIndex].userId,
          selectedIndex: !query ? lastIndex : prevIndex
        });
        break;
      }
      case keys.ENTER: {
        if (selectedMember === '') return;
        this.selectMember(selectedMember, e);
        break;
      }
    }

    e.preventDefault();
  };

  selectMember = (memberId, e) => {
    const { onSelectMember, onClose } = this.props;
    onSelectMember(memberId, e);
    if (onClose) {
      onClose(e);
    }
  };

  render() {
    const {
      assignedMembers,
      style,
      classes,
      placeholder,
      type,
      innerRef,
      anchor
    } = this.props;
    const { filteredList } = this.state;
    const query = type === 'hidden' ? this.props.query : this.state.query;
    const isActive =
      type === 'hidden' ? this.props.isActive : this.state.isActive;
    const selectedMember =
      type === 'hidden' ? this.props.selectedMember : this.state.selectedMember;
    const position = {};
    if (anchor) {
      const anchorRect = anchor.getBoundingClientRect();
      position.top = anchorRect.top;
      position.left = anchorRect.left;
    }

    return (
      <div
        className={`member-search__wrapper ${classes.wrapper || ''}`}
        ref={innerRef}
        style={{ ...position, ...style }}
      >
        <Input
          name="query"
          className={`member-search ${classes.input || ''}`}
          onChange={this.onChange}
          value={query}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          type={type}
          autoComplete="off"
          placeholder={placeholder}
          onKeyDown={this.onKeyDown}
          innerRef={el => (this.inputEl = el)}
        />
        {isActive && (
          <ul className={`member-search__list ${classes.list || ''}`}>
            {filteredList.length > 0 ? (
              filteredList.map((user, i) => {
                const { name, photoURL, email, username, userId } = user;
                const isAssigned =
                  assignedMembers && assignedMembers.indexOf(userId) !== -1;
                return (
                  <li
                    className={`member-search__item ${classes.item || ''} ${
                      selectedMember === userId ? 'is-selected' : ''
                    }`}
                    onClick={e => this.selectMember(userId, e)}
                    key={userId}
                    id={userId}
                  >
                    <Icon name={isAssigned ? 'user-minus' : 'user-plus'} />
                    <Avatar
                      classes={{
                        avatar: `member-search__avatar--sm ${classes.avatar ||
                          ''}`,
                        placeholder: `member-search__avatar-placeholder--sm ${classes.avatarPlaceholder ||
                          ''}`
                      }}
                      name={name}
                      size="sm"
                      variant="circle"
                      imgSrc={photoURL}
                    />
                    <span
                      className={`member-search__info member-search__name ${classes.info ||
                        ''}`}
                    >
                      {name}
                    </span>
                    <span
                      className={`member-search__info member-search__username ${classes.info ||
                        ''}`}
                    >
                      {username}
                    </span>
                    <span
                      className={`member-search__info member-search__email ${classes.info ||
                        ''}`}
                    >
                      {email}
                    </span>
                  </li>
                );
              })
            ) : (
              <li className={`member-search__item ${classes.item || ''}`}>
                <span
                  className={`member-search__no-match ${classes.noMatch || ''}`}
                >
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

export default withOutsideClick(MemberSearch);
