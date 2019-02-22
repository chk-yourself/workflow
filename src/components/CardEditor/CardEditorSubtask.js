import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Draggable } from 'react-beautiful-dnd';
import { Checkbox } from '../Checkbox';
import { Textarea } from '../Textarea';

const appRoot = document.getElementById('root');

export default class CardEditorSubtask extends Component {
  constructor(props) {
    super(props);
    this.portal = document.createElement('div');
  }

  componentDidMount() {
    appRoot.appendChild(this.portal);
  }

  onDragStart = e => {
    console.log('dragstart');
    this.setState({
      isReadOnly: true
    });
  };

  componentWillUnmount() {
    appRoot.removeChild(this.portal);
  }

  render() {
    const {
      subtaskId,
      index,
      text,
      isCompleted,
      toggleCompleted,
      onChange,
      onBlur,
      onKeyDown
    } = this.props;

    return (
      <Draggable draggableId={subtaskId} index={index}>
        {(provided, snapshot) => {
          const inner = (
            <li
              className="card-editor__subtask"
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <Checkbox
                id={`cb-${subtaskId}`}
                value={subtaskId}
                name={subtaskId}
                isChecked={isCompleted}
                onChange={toggleCompleted}
                className="card-editor__checkbox"
                labelClass="card-editor__checkbox-label"
              />
              <Textarea
                value={text}
                onChange={onChange}
                onBlur={onBlur}
                name={subtaskId}
                className="card-editor__textarea--subtask"
                onKeyDown={onKeyDown}
                onDragStart={this.onDragStart}
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
