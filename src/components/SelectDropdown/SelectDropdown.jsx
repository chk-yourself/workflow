import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Popover } from '../Popover';
import { Menu } from '../Menu';
import { Radio } from '../Radio';
import { Icon } from '../Icon';
import './SelectDropdown.scss';

export default class SelectDropdown extends PureComponent {
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
    selected: null,
    align: {
      outer: 'left',
      inner: 'left'
    },
    onChange: () => {}
  };

  static propTypes = {
    onChange: PropTypes.func,
    name: PropTypes.string.isRequired,
    options: PropTypes.objectOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])
      })
    ),
    classes: PropTypes.shape({
      wrapper: PropTypes.string,
      dropdown: PropTypes.string,
      menu: PropTypes.string,
      item: PropTypes.string,
      option: PropTypes.string,
      label: PropTypes.string,
      button: PropTypes.string
    }),
    align: PropTypes.shape({
      outer: PropTypes.oneOf(['left', 'right']),
      inner: PropTypes.oneOf(['left', 'right'])
    })
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
  };

  render() {
    const { isActive } = this.state;
    const { classes, options, name, selected, align } = this.props;

    return (
      <Popover
        isActive={isActive}
        onOutsideClick={this.closeDropdown}
        align={align}
        onClose={this.closeDropdown}
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
              {selected !== undefined && selected !== null && options[selected].label}
              <Icon name="chevron-down" />
            </>
          )
        }}
      >
        <Menu role="listbox" className={`select-dropdown__menu ${classes.menu || ''}`}>
          {Object.keys(options).map(key => {
            const option = options[key];
            return (
              <Menu.Item
                className={`select-dropdown__item ${classes.item || ''}`}
                key={option.value}
              >
                <Radio
                  name={name}
                  id={option.value}
                  value={option.value}
                  isChecked={option.value === selected}
                  label={
                    option.value === selected ? (
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
                    radio: `select-dropdown__option ${classes.option || ''}`,
                    label: `select-dropdown__label ${classes.label || ''}`
                  }}
                  data-label={option.label}
                />
              </Menu.Item>
            );
          })}
        </Menu>
      </Popover>
    );
  }
}
