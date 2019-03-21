import React, { Component } from 'react';
import { PopoverWrapper } from '../Popover';
import { Menu, MenuItem } from '../Menu';
import { Radio } from '../Radio';
import { Icon } from '../Icon';
import './Dropdown.scss';

export default class Dropdown extends Component {
  static defaultProps = {
    classes: {
      wrapper: '',
      dropdown: '',
      menu: '',
      item: '',
      radio: '',
      label: '',
      button: ''
    },
    options: []
  };

  state = {
    isActive: false
  };

  toggleDropdown = e => {
    this.setState(prevState => ({
      isActive: !prevState.isActive
    }));
  };

  closeDropdown = e => {
    this.setState({
      isActive: false
    });
  };

  onChange = e => {
    const { onChange } = this.props;
    onChange(e);
    this.closeDropdown();
  };

  render() {
    const { isActive } = this.state;
    const { classes, options, name, selectedOption, align } = this.props;

    return (
      <PopoverWrapper
        isActive={isActive}
        onOutsideClick={this.closeDropdown}
        align={align}
        classes={{
          wrapper: `dropdown__wrapper ${classes.wrapper || ''}`,
          popover: `dropdown ${classes.dropdown || ''}`
        }}
        buttonProps={{
          onClick: this.toggleDropdown,
          className: `dropdown__btn--toggle ${classes.button || ''}`,
          children: (
            <>
              {selectedOption.label}
              <Icon name="chevron-down" />
            </>
          )
        }}
      >
        <Menu className={`dropdown__menu ${classes.menu || ''}`}>
          {options.map(option => (
            <MenuItem
              className={`dropdown__item ${classes.item || ''}`}
              key={option.value}
            >
              <Radio
                name={name}
                id={option.value}
                value={option.value}
                isChecked={option.value === selectedOption.value}
                label={
                  option.value === selectedOption.value ? (
                    <>
                      <Icon name="check" />
                      {option.label}
                    </>
                  ) : (
                    option.label
                  )
                }
                onChange={this.onChange}
                classes={{
                  radio: `dropdown__radio ${classes.radio || ''}`,
                  label: `dropdown__label ${classes.label || ''}`
                }}
                data-label={option.label}
              />
            </MenuItem>
          ))}
        </Menu>
      </PopoverWrapper>
    );
  }
}
