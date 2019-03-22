import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirebase } from '../Firebase';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Textarea } from '../Textarea';
import * as keys from '../../constants/keys';
import { currentUserSelectors } from '../../ducks/currentUser';

class CommentComposer extends Component {
  static defaultProps = {
    classes: {
      avatar: '',
      avatarPlaceholder: '',
      form: '',
      textarea: '',
      button: ''
    }
  }

  state = {
    content: '',
    isFocused: false
  };

  resetForm = () => {
    this.setState({ content: '' });
  };

  onChange = e => {
    this.setState({
      content: e.target.value
    });
  };

  onFocus = e => {
    this.setState({
      isFocused: true
    });
  };

  onBlur = e => {
    if (e.target.value !== '') return;
    this.setState({
      isFocused: false
    });
  };

  addComment = e => {
    if (e.type === 'keydown' && e.key !== keys.ENTER) return;
    const { currentUser, firebase, taskId, projectId } = this.props;
    const { content } = this.state;
    const { userId } = currentUser;
    firebase.addComment({ userId, content, taskId, projectId });
    this.resetForm();
    e.preventDefault();
  };

  render() {
    const { content, isFocused } = this.state;
    const { currentUser, classes } = this.props;
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
      <form
        name="commentForm"
        className={`${classes.form || ''} ${
        isFocused ? 'is-focused' : ''}`}
        onSubmit={this.addComment}
      >
      <Textarea
        className={classes.textarea || ''}
        name="comment"
        value={content}
        onChange={this.onChange}
        placeholder="Write a comment..."
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyDown={this.addComment}
      />
        {isFocused && (
        <Button
          type="submit"
          color="primary"
          size="small"
          variant="contained"
          disabled={content === ''}
          onClick={this.addComment}
          name="newCommentSubmit"
          className={classes.button || ''}
        >
          Send
        </Button>
      )}
      </form>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentUser: currentUserSelectors.getCurrentUser(state)
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
