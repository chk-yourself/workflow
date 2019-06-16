import React, { Component } from 'react';
import { PopoverWrapper } from '../Popover';
import { Menu, MenuItem } from '../Menu';
import { Radio } from '../Radio';
import { Icon } from '../Icon';
import './SelectDropdown.scss';

// TODO: Make more accessible
// TODO: Enable autocomplete
// TODO: Enable multi-select

export default class SelectDropdown extends Component {
  static defaultProps = {
    classes: {
      wrapper: '',
      dropdown: '',
      menu: '',
      item: '',
      option: '',
      label: '',
      button: ''
    },
    options: {},
    value: null,
    align: {
      outer: 'left',
      inner: 'left'
    }
  };

  state = {
    isActive: false
  };

  toggleDropdown = () => {
    this.setState(prevState => ({
      isActive: !prevState.isActive
    }));
  };

  closeDropdown = () => {
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
    const { classes, options, name, value, align } = this.props;

    return (
      <PopoverWrapper
        isActive={isActive}
        onOutsideClick={this.closeDropdown}
        align={align}
        classes={{
          wrapper: `select-dropdown__wrapper ${classes.wrapper || ''}`,
          popover: `select-dropdown ${classes.dropdown || ''}`
        }}
        buttonProps={{
          isActive,
          onClick: this.toggleDropdown,
          className: `select-dropdown__btn--toggle ${classes.button || ''}`,
          children: (
            <>
              {value && options[value].name}
              <Icon name="chevron-down" />
            </>
          )
        }}
      >
        <Menu
          role="listbox"
          className={`select-dropdown__menu ${classes.menu || ''}`}
        >
          {Object.keys(options).map(key => {
            const option = options[key];
            return (
              <MenuItem
                className={`select-dropdown__item ${classes.item || ''}`}
                key={option.value}
              >
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
                  onChange={this.onChange}
                  classes={{
                    radio: `select-dropdown__option ${classes.option || ''}`,
                    label: `select-dropdown__label ${classes.label || ''}`
                  }}
                  data-label={option.name}
                />
              </MenuItem>
            );
          })}
        </Menu>
      </PopoverWrapper>
    );
  }
}
