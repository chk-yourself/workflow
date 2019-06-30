import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { toDateString, isPriorDate, isWithinDays, isSameDate } from '../../utils/date';
import { Badge } from '../Badge';
import './TaskDueDate.scss';

const TaskDueDate = ({ dueDate, icon, className }) => {
  if (!dueDate) return null;
  const dueDateStr = toDateString(dueDate, {
    useRelative: true,
    format: { month: 'short', day: 'numeric' }
  });
  const isDueToday = dueDateStr === 'Today';
  const isDueTmrw = dueDateStr === 'Tomorrow';
  const isDueThisWeek = isWithinDays(dueDate, 7);
  const isPastDue = isPriorDate(dueDate);
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
  icon: null,
  dueDate: null
};

TaskDueDate.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.oneOfType([() => null, PropTypes.string]),
  dueDate: PropTypes.oneOfType([() => null, PropTypes.instanceOf(Date)])
};

function areEqual(prevProps, nextProps) {
  if (
    prevProps.icon !== nextProps.icon ||
    prevProps.className !== nextProps.className ||
    (nextProps.dueDate && !isSameDate(prevProps.dueDate, nextProps.dueDate))
  ) {
    return false;
  }
  return true;
}

export default memo(TaskDueDate);
