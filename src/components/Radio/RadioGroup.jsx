import React from 'react';
import PropTypes from 'prop-types';
import { Menu, MenuItem } from '../Menu';
import Radio from './Radio';
import { Icon } from '../Icon';
import './Radio.scss';

const RadioGroup = ({ name, value, options, classes, onChange }) => (
  <Menu className={`radio-group ${classes.list || ''}`}>
    {options.map(option => (
      <MenuItem className={`radio-group__item ${classes.item || ''}`} key={option.value}>
        <Radio
          name={name}
          id={option.value}
          value={option.value}
          isChecked={option.value === value}
          label={
            option.value === value ? (
              <>
                <Icon name="check" />
                {option.name}
              </>
            ) : (
              option.name
            )
          }
          onChange={onChange}
          classes={{
            radio: `radio-group__radio ${classes.radio || ''}`,
            label: `radio-group__label ${classes.label || ''}`
          }}
          data-label={option.name}
        />
      </MenuItem>
    ))}
  </Menu>
);

RadioGroup.defaultProps = {
  classes: {
    list: '',
    item: '',
    radio: '',
    label: ''
  },
  options: []
};

RadioGroup.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ),
  classes: PropTypes.shape({
    list: PropTypes.string,
    item: PropTypes.string,
    radio: PropTypes.string,
    label: PropTypes.string
  })
};

export default RadioGroup;
