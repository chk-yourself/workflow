import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { SelectDropdown } from '../SelectDropdown';
import { getNextYears } from '../../utils/date';

const SelectYearDropdown = ({ selected, onChange }) => {
  const years = getNextYears(4, selected);
  const yearOptions = years.reduce((options, currentYear) => {
    const label = `${currentYear}`;
    options[label] = {
      value: currentYear,
      label
    };
    return options;
  }, {});
  return (
    <SelectDropdown
      name="year"
      align={{ inner: 'right' }}
      onChange={onChange}
      selected={selected}
      options={yearOptions}
      classes={{
        wrapper: 'calendar__years-dropdown-wrapper',
        dropdown: 'calendar__years-dropdown',
        button: 'calendar__btn--years-dropdown',
        option: 'calendar__radio',
        label: 'calendar__radio-label',
        menu: 'calendar__years-list',
        item: 'calendar__years-item'
      }}
    />
  );
};

SelectYearDropdown.defaultProps = {
  onChange: () => {}
};

SelectYearDropdown.propTypes = {
  onChange: PropTypes.func,
  selected: PropTypes.number.isRequired
};

export default memo(SelectYearDropdown);
