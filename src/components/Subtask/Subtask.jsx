import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Draggable } from 'react-beautiful-dnd';
import { Checkbox } from '../Checkbox';
import { Textarea } from '../Textarea';
import { withFirebase } from '../Firebase';
import * as keys from '../../constants/keys';
import './Subtask.scss';

class Subtask extends Component {
  static defaultProps = {
    usePortal: false
  };

  static propTypes = {
    usePortal: PropTypes.bool,
    subtaskId: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired
  };

  state = {
    name: this.props.name,
    isFocused: false,
    pointX: null,
    pointY: null,
    isDragging: false
  };

  componentDidMount() {
    this.portal = document.createElement('div');
    document.body.appendChild(this.portal);
  }

  componentWillUnmount() {
    document.body.removeChild(this.portal);
  }

  onChange = e => {
    this.setState({
      name: e.target.value
    });
  };

  onFocus = () => {
    this.setState({
      isFocused: true
    });
  };

  onBlur = () => {
    const { name, firebase, subtaskId } = this.props;
    const { name: newName } = this.state;
    if (name !== newName) {
      firebase.updateDoc(['subtasks', subtaskId], {
        name: newName
      });
    }
    this.setState({
      isFocused: false
    });
  };

  deleteSubtask = e => {
    if (e.target.value !== '' || e.key !== keys.BACKSPACE) return;
    const { subtaskId, taskId, firebase } = this.props;
    firebase.deleteSubtask({ subtaskId, taskId });
  };

  toggleCompleted = async () => {
    const { subtaskId, isCompleted, firebase } = this.props;
    await firebase.updateDoc(['subtasks', subtaskId], {
      isCompleted: !isCompleted,
      completedAt: !isCompleted ? firebase.getTimestamp() : null
    });
  };

  setTextareaRef = el => {
    this.textarea = el;
  };

  onMouseDown = e => {
    if (e.target.matches('input') || e.target.matches('label')) return;
    this.setState({
      pointX: e.pageX,
      pointY: e.pageY
    });
  };

  onMouseUp = e => {
    const { pointX, pointY, isFocused } = this.state;
    if (isFocused) return;
    if (e.pageX === pointX && e.pageY === pointY) {
      this.textarea.focus();
    }
    this.setState({
      pointX: null,
      pointY: null
    });
  };

  render() {
    const { subtaskId, index, isCompleted, usePortal } = this.props;
    const { name, isFocused } = this.state;

    return (
      <Draggable draggableId={subtaskId} index={index}>
        {(provided, snapshot) => {
          const inner = (
            <li
              onMouseUp={this.onMouseUp}
              className={`subtask ${snapshot.isDragging ? 'is-dragging' : ''} ${
                isFocused ? 'is-focused' : ''
              }`}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              onMouseDown={e => {
                this.onMouseDown(e);
                provided.dragHandleProps.onMouseDown(e);
              }}
            >
              <Checkbox
                id={`cb-${subtaskId}`}
                value={subtaskId}
                name={subtaskId}
                isChecked={isCompleted}
                onChange={this.toggleCompleted}
                className="subtask__checkbox"
                labelClass="subtask__checkbox-label"
              />
              <Textarea
                innerRef={this.setTextareaRef}
                value={name}
                onChange={this.onChange}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                name={subtaskId}
                className="subtask__textarea"
                onKeyDown={this.deleteSubtask}
              />
            </li>
          );
          return usePortal && snapshot.isDragging
            ? ReactDOM.createPortal(inner, this.portal)
            : inner;
        }}
      </Draggable>
    );
  }
}

export default withFirebase(Subtask);
