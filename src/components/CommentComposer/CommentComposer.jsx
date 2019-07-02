import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withAuthorization } from '../Session';
import { Avatar } from '../Avatar';
import * as keys from '../../constants/keys';
import { userSelectors } from '../../ducks/users';
import { RichTextEditor, getMentionedUsers } from '../RichTextEditor';
import './CommentComposer.scss';

class CommentComposer extends Component {
  static defaultProps = {
    classes: {
      avatar: '',
      avatarPlaceholder: '',
      composer: '',
      button: ''
    },
    id: null
  };

  static propTypes = {
    taskId: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    classes: PropTypes.shape({
      avatar: PropTypes.string,
      avatarPlaceholder: PropTypes.string,
      composer: PropTypes.string,
      button: PropTypes.string
    }),
    id: PropTypes.string
  };

  addComment = (value, e) => {
    if (e.type === 'keydown' && e.key !== keys.ENTER) return;
    const { currentUser, firebase, taskId, projectId, activeWorkspace } = this.props;
    const { workspaceId } = activeWorkspace;
    const users = getMentionedUsers(value);
    firebase.createComment({
      content: value.toJSON(),
      to: users,
      from: {
        userId: currentUser.userId,
        name: currentUser.name
      },
      taskId,
      projectId,
      workspaceId
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
          src={currentUser.photoURL}
        />
        <RichTextEditor
          id={id}
          onSubmit={this.addComment}
          classes={{
            container: `comment-composer ${classes.composer || ''}`,
            toolbar: 'comment-composer__toolbar',
            button: 'comment-composer__toolbar-btn',
            addOns: 'comment-composer__add-ons'
          }}
          isMentionsEnabled
          mentions={{
            users,
            usersById
          }}
          addOns={[
            {
              type: 'submit',
              props: {
                className: `comment-composer__btn--submit ${classes.button || ''}`,
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
              icon: 'underlined'
            }
          ]}
          inlines={[
            {
              type: 'mention',
              icon: 'mention'
            }
          ]}
          blocks={[
            {
              type: 'unordered-list',
              icon: 'unordered-list'
            },
            {
              type: 'ordered-list',
              icon: 'ordered-list'
            },
            {
              type: 'code',
              icon: 'code'
            }
          ]}
        />
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    users: userSelectors.getUsersArray(state),
    usersById: userSelectors.getUsersById(state)
  };
};

const condition = (currentUser, activeWorkspace) => !!currentUser && !!activeWorkspace;

export default withAuthorization(condition)(connect(mapStateToProps)(CommentComposer));
