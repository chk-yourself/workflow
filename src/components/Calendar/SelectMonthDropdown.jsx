import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { SelectDropdown } from '../SelectDropdown';
import { MONTHS, getNextYears } from '../../utils/date';

const monthOptions = MONTHS.reduce((options, currentMonth, i) => {
  const label = `${i}`;
  options[label] = {
    value: i,
    label: currentMonth.long
  };
  return options;
}, {});

const SelectMonthDropdown = ({ selected, onChange }) => {
  return (
    <SelectDropdown
      name="month"
      align={{ inner: 'right' }}
      onChange={onChange}
      selected={selected}
      options={monthOptions}
      classes={{
        wrapper: 'calendar__months-dropdown-wrapper',
        dropdown: 'calendar__months-dropdown',
        button: 'calendar__btn--months-dropdown',
        option: 'calendar__radio',
        label: 'calendar__radio-label',
        menu: 'calendar__months-list',
        item: 'calendar__months-item'
      }}
    />
  );
};

SelectMonthDropdown.defaultProps = {
  onChange: () => {}
};

SelectMonthDropdown.propTypes = {
  onChange: PropTypes.func,
  selected: PropTypes.number.isRequired
};

export default memo(SelectMonthDropdown);
