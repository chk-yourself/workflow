import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from '../Menu';
import Radio from './Radio';
import { Icon } from '../Icon';
import './Radio.scss';

const RadioGroup = ({ name, value, options, classes, onChange }) => (
  <Menu className={`radio-group ${classes.list || ''}`}>
    {options.map(option => (
      <Menu.Item className={`radio-group__item ${classes.item || ''}`} key={option.value}>
        <Radio
          name={name}
          id={option.value}
          value={option.value}
          isChecked={option.value === value}
          label={
            option.value === value ? (
              <>
                <Icon name="check" />
                {option.label}
              </>
            ) : (
              option.label
            )
          }
          onChange={onChange}
          classes={{
            radio: `radio-group__radio ${classes.radio || ''}`,
            label: `radio-group__label ${classes.label || ''}`
          }}
          data-label={option.label}
        />
      </Menu.Item>
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
  options: [],
  value: null,
  onChange: () => {}
};

RadioGroup.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])
    }).isRequired
  ),
  classes: PropTypes.shape({
    list: PropTypes.string,
    item: PropTypes.string,
    radio: PropTypes.string,
    label: PropTypes.string
  }),
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  onChange: PropTypes.func
};

export default RadioGroup;
