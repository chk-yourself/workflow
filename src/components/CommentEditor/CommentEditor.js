import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirebase } from '../Firebase';
import { userSelectors } from '../../ducks/users';
import { RichTextEditor, getUserIdsFromMentions } from '../RichTextEditor';
import './CommentEditor.scss';

class CommentEditor extends Component {
  static defaultProps = {
    classes: {
      editor: '',
      button: ''
    },
    isReadOnly: true
  };

  updateComment = (value, e) => {
    const { firebase, commentId } = this.props;
    firebase.updateDoc(['comments', commentId], {
      content: value.toJSON(),
      to: getUserIdsFromMentions(value)
    });
    e.preventDefault();
  };

  render() {
    const {
      isReadOnly,
      content,
      classes,
      users,
      usersById,
      commentId
    } = this.props;
    return (
      <RichTextEditor
        id={commentId}
        isReadOnly={isReadOnly}
        value={content}
        onUpdate={this.updateComment}
        classes={{
          container: `comment-editor ${classes.editor || ''}`,
          toolbar: 'comment-editor__toolbar',
          button: 'comment-editor__toolbar-btn',
          addOns: 'comment-editor__add-ons'
        }}
        isMentionsEnabled
        mentions={{
          users,
          usersById
        }}
        addOns={[
          {
            type: 'update',
            id: 'updateComment',
            onClick: 'onUpdate',
            props: {
              className: `comment-editor__btn--submit ${classes.button || ''}`,
              color: 'primary',
              variant: 'contained',
              children: 'Save Changes'
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
    );
  }
}

const mapStateToProps = state => {
  return {
    users: userSelectors.getUsersArray(state),
    usersById: userSelectors.getUsersById(state)
  };
};

export default withFirebase(connect(mapStateToProps)(CommentEditor));
