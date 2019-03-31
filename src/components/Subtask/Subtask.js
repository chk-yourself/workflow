import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Draggable } from 'react-beautiful-dnd';
import { Checkbox } from '../Checkbox';
import { Textarea } from '../Textarea';
import { withFirebase } from '../Firebase';
import { DragHandle } from '../DragHandle';
import * as keys from '../../constants/keys';
import './Subtask.scss';

class Subtask extends Component {
  constructor(props) {
    super(props);
    this.portal = document.createElement('div');
    this.state = {
      name: props.name
    };
  }

  componentDidMount() {
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

  onBlur = () => {
    const { name, firebase, subtaskId } = this.props;
    const { name: newName } = this.state;
    if (name !== newName) {
      firebase.updateDoc(['subtasks', subtaskId], {
        name: newName
      });
    }
  };

  deleteSubtask = e => {
    if (e.target.value !== '' || e.key !== keys.BACKSPACE) return;
    const { subtaskId, taskId, firebase } = this.props;
    firebase.deleteSubtask({ subtaskId, taskId });
  };

  toggleCompleted = async () => {
    const { subtaskId, isCompleted, firebase } = this.props;
    await firebase.updateSubtask(subtaskId, {
      isCompleted: !isCompleted,
      completedAt: !isCompleted ? firebase.getTimestamp() : null
    });
  };

  setTextareaRef = el => {
    this.textarea = el;
  };

  render() {
    const { subtaskId, index, isCompleted } = this.props;

    const { name } = this.state;

    return (
      <Draggable draggableId={subtaskId} index={index}>
        {(provided, snapshot) => {
          const inner = (
            <li
              className="subtask"
              ref={provided.innerRef}
              {...provided.draggableProps}
            >
              <DragHandle isActive={snapshot.isDragging} {...provided.dragHandleProps} />
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
                onBlur={this.onBlur}
                name={subtaskId}
                className="subtask__textarea"
                onKeyDown={this.deleteSubtask}
              />
            </li>
          );
          return snapshot.isDragging
            ? ReactDOM.createPortal(inner, this.portal)
            : inner;
        }}
      </Draggable>
    );
  }
}

export default withFirebase(Subtask);
