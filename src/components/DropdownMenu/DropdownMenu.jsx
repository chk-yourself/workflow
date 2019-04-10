import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { PopoverWrapper } from '../Popover';
import { Menu, MenuItem } from '../Menu';
import { Icon } from '../Icon';
import './DropdownMenu.scss';

export default class DropdownMenu extends Component {
  static defaultProps = {
    classes: {
      wrapper: '',
      dropdown: '',
      menu: '',
      item: '',
      link: '',
      button: ''
    },
    links: [],
    activeLink: '',
    icon: 'chevron-left',
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

  render() {
    const { isActive } = this.state;
    const { classes, links, align, activeLink, icon } = this.props;

    return (
      <PopoverWrapper
        isActive={isActive}
        onOutsideClick={this.closeDropdown}
        align={align}
        classes={{
          wrapper: `dropdown-menu__wrapper ${classes.wrapper || ''}`,
          popover: `dropdown-menu ${classes.dropdown || ''}`
        }}
        buttonProps={{
          isActive,
          onClick: this.toggleDropdown,
          className: `dropdown-menu__btn--toggle ${classes.button || ''}`,
          children: (
            <>
              {!!activeLink && activeLink}
              <Icon name={icon} />
            </>
          )
        }}
      >
        <Menu
          onClick={this.toggleDropdown}
          aria-label="submenu"
          className={`dropdown-menu__list ${classes.menu || ''}`}
        >
          {links.map(link => {
            return (
              <MenuItem
                className={`dropdown-menu__item ${classes.item || ''}`}
                key={link.href}
              >
                <NavLink
                  className={`dropdown-menu__link ${classes.link || ''}`}
                  to={link.href}
                >
                  {link.text}
                </NavLink>
              </MenuItem>
            );
          })}
        </Menu>
      </PopoverWrapper>
    );
  }
}
