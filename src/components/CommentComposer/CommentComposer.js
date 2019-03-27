import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirebase } from '../Firebase';
import { Avatar } from '../Avatar';
import * as keys from '../../constants/keys';
import { currentUserSelectors } from '../../ducks/currentUser';
import { userSelectors } from '../../ducks/users';
import { RichTextEditor, getUserIdsFromMentions } from '../RichTextEditor';
import './CommentComposer.scss';

class CommentComposer extends Component {
  static defaultProps = {
    classes: {
      avatar: '',
      avatarPlaceholder: '',
      composer: '',
      button: ''
    }
  };

  addComment = (value, e) => {
    if (e.type === 'keydown' && e.key !== keys.ENTER) return;
    const { currentUser, firebase, taskId, projectId } = this.props;
    const userIds = getUserIdsFromMentions(value);
    const { userId } = currentUser;
    firebase.addComment({
      content: value.toJSON(),
      to: userIds,
      from: userId,
      taskId,
      projectId
    });
    e.preventDefault();
  };

  render() {
    const { currentUser, classes, users, usersById, id } = this.props;
    return (
      <>
        <Avatar
          classes={{
            avatar: classes.avatar || '',
            placeholder: classes.avatarPlaceholder || ''
          }}
          name={currentUser.name}
          size="sm"
          variant="circle"
          imgSrc={currentUser.photoURL}
        />
        <RichTextEditor
          key={`comment-composer--${id}`}
          id={`comment-composer--${id}`}
          onSubmit={this.addComment}
          classes={{
            container: `comment-composer ${classes.composer || ''}`,
            toolbar: 'comment-composer__toolbar',
            button: 'comment-composer__toolbar-btn',
            addOns: 'comment-composer__add-ons'
          }}
          isMentionsEnabled
          mentions={{
            list: users,
            map: usersById
          }}
          addOns={[
            {
              type: 'submit',
              onClick: 'onSubmit',
              id: 'submitComment',
              props: {
                className: `comment-composer__btn--submit ${classes.button ||
                  ''}`,
                color: 'primary',
                variant: 'contained',
                children: 'Send'
              }
            }
          ]}
          marks={[
            {
              type: 'bold',
              icon: 'bold'
            },
            {
              type: 'italic',
              icon: 'italic'
            },
            {
              type: 'underlined',
              icon: 'underline'
            }
          ]}
          inlines={[
            {
              type: 'mention',
              icon: 'at-sign'
            }
          ]}
        />
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentUser: currentUserSelectors.getCurrentUser(state),
    users: userSelectors.getUsersArray(state),
    usersById: userSelectors.getUsersById(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default withFirebase(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CommentComposer)
);
