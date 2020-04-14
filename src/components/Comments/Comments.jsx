import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirebase } from '../Firebase';
import { Comment } from '../Comment';
import { commentActions, commentSelectors } from '../../ducks/comments';
import { taskSelectors } from '../../ducks/tasks';

class Comments extends Component {
  state = {
    isLoading: !this.props.isLoaded
  };

  async componentDidMount() {
    const { syncTaskComments, taskId } = this.props;
    this.unsubscribe = await syncTaskComments(taskId);
    this.setState({
      isLoading: false
    });
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  render() {
    const { comments } = this.props;
    const { isLoading } = this.state;
    if (isLoading) return null;
    return comments.length > 0
      ? comments.map(comment => <Comment key={comment.commentId} {...comment} />)
      : null;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    comments: commentSelectors.getCommentsArray(state, ownProps.commentIds),
    isLoaded: taskSelectors.getTaskLoadedState(state, ownProps.taskId).comments
  };
};

const mapDispatchToProps = dispatch => {
  return {
    syncTaskComments: taskId => dispatch(commentActions.syncTaskComments(taskId))
  };
};

export default withFirebase(connect(mapStateToProps, mapDispatchToProps)(Comments));
