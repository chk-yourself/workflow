import React from 'react';
import TaskEditorSection from './TaskEditorSection';
import { DatePicker } from '../DatePicker';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { TaskDueDate } from '../Task';
import { getSimpleDate } from '../../utils/date';

const TaskEditorDueDate = ({
  dueDate,
  onToggleDatePicker,
  isDatePickerActive,
  onSelectDueDate
}) => {
  const simpleDueDate = dueDate
    ? getSimpleDate(dueDate.toDate())
    : getSimpleDate(new Date());
  return (
    <TaskEditorSection>
      <Button
        onClick={onToggleDatePicker}
        type="button"
        className={`task-editor__btn--due-date ${
          isDatePickerActive ? 'is-active' : ''
        }`}
      >
        <span className="task-editor__due-date-icon">
          <Icon name="calendar" />
        </span>
        <span className="task-editor__due-date-wrapper">
          {!dueDate ? (
            <span className="task-editor__no-due-date">Set due date</span>
          ) : (
            <>
              <span className="task-editor__section-title--sm">Due Date</span>
              <TaskDueDate
                dueDate={dueDate}
                className="task-editor__due-date"
              />
            </>
          )}
        </span>
      </Button>
      <DatePicker
        onClose={onToggleDatePicker}
        selectedDate={dueDate ? simpleDueDate : null}
        currentMonth={simpleDueDate.month}
        currentYear={simpleDueDate.year}
        selectDate={onSelectDueDate}
        isActive={isDatePickerActive}
      />
    </TaskEditorSection>
  );
};

export default TaskEditorDueDate;
