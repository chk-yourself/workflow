import React from 'react';
import { toDateString, isPriorDate, isWithinDays } from '../../utils/date';
import { Badge } from '../Badge';
import './TaskDueDate.scss';

const TaskDueDate = ({ dueDate, icon, className }) => {
  if (!dueDate) return null;
  const dueDateStr = toDateString(dueDate.toDate(), {
    useRelative: true,
    format: { month: 'short', day: 'numeric' }
  });
  const isDueToday = dueDateStr === 'Today';
  const isDueTmrw = dueDateStr === 'Tomorrow';
  const isDueThisWeek = isWithinDays(dueDate.toDate(), 7);
  const isPastDue = isPriorDate(dueDate.toDate());
  return (
    <Badge
      icon={icon}
      className={`task__due-date ${className} ${
        isDueToday
          ? 'is-due-today'
          : isDueTmrw
          ? 'is-due-tmrw'
          : isDueThisWeek
          ? 'is-due-this-week'
          : isPastDue
          ? 'is-past-due'
          : ''
      }
                  `}
    >
      {dueDateStr}
    </Badge>
  );
};

TaskDueDate.defaultProps = {
  className: '',
  icon: null
};

export default TaskDueDate;
