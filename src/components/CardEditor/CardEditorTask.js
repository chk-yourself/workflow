import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Draggable } from 'react-beautiful-dnd';
import { Checkbox } from '../Checkbox';
import { Textarea } from '../Textarea';

const appRoot = document.getElementById('root');

export default class CardEditorTask extends Component {
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
      taskId,
      index,
      text,
      isCompleted,
      toggleCompleted,
      onChange,
      onBlur,
      onKeyDown
    } = this.props;

    return (
      <Draggable draggableId={taskId} index={index}>
        {(provided, snapshot) => {
          const inner = (
            <li
              className="card-editor__task"
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <Checkbox
                id={`cb-${taskId}`}
                value={taskId}
                name={taskId}
                isChecked={isCompleted}
                onChange={toggleCompleted}
                className="card-editor__checkbox"
                labelClass="card-editor__checkbox-label"
              />
              <Textarea
                value={text}
                onChange={onChange}
                onBlur={onBlur}
                name={taskId}
                className="card-editor__textarea--task"
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
