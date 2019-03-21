import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirebase } from '../Firebase';
import { PopoverWrapper } from '../Popover';
import { Icon } from '../Icon';
import { Radio } from '../Radio';
import { Button } from '../Button';
import { Menu, MenuItem } from '../Menu';
import './TaskSettings.scss';

const TaskSettings = ({ onToggle, onClose, isVisible, filters, sortRule, selectFilter, selectSortRule, classes }) => (
      <PopoverWrapper
        isActive={isVisible}
        onOutsideClick={onClose}
        classes={{
          wrapper: `task-settings__wrapper ${classes.wrapper || ''}`,
          popover: `task-settings ${classes.popover || ''}`
          }}
        align={{inner: "right"}}
        buttonProps={{
          size: 'sm',
          iconOnly: true,
          className: `task-settings__btn ${classes.button || ''}`,
          children: <Icon name="sliders" />,
          onClick: onToggle
        }}
        >
        <Button type="button" className="task-settings__btn--close" size="sm" onClick={onClose} iconOnly>
         <Icon name="x" />
         </Button>
        <Menu className={classes.menu || ''}>
        {filters && filters.map(filter => (
          <MenuItem className={classes.item || ''} key={filter.filter}>
            {filter.filter}
            <Menu className={`${filter.filter}__options`}>
            {filter.options.map(filterOption => (
              <MenuItem key={filterOption.value} className={`filter__option ${filter.filter}__option`}>
              <Radio
              name={filter.filter}
              id={filterOption.value}
              value={filterOption.value}
              isChecked={filterOption.value === filter.value}
              label={filterOption.name}
              onChange={filter.onChange}
              classes={{
                radio: `filter__radio ${filter.filter}__radio`,
                label: `filter__label ${filter.filter}__label`
              }}
            />
            </MenuItem>
            ))
            }
            </Menu>
          </MenuItem>
        ))
        }
        {sortRule && 
        <MenuItem className={classes.item || ''}>
          Sort by
          <PopoverWrapper
            isActive={sortRule.isDropdownVisible}
            onOutsideClick={sortRule.hideDropdown}
            classes={{
              wrapper: 'sort-rule__dropdown-wrapper',
              popover: 'sort-rule__dropdown'
            }}
            buttonProps={{
              className: `sort-rule__btn-dropdown ${
                sortRule.isDropdownActive ? 'is-active' : ''
              }`,
              size: 'sm',
              children: (
                <>
                  {sortRule.options.find(option => option.value === sortRule.value).name}
                  <Icon name="chevron-down" />
                </>
              ),
              onClick: sortRule.toggleDropdown
            }}
          >
            <Menu className="sort-options">
            {sortRule.options && sortRule.options.map(sortOption => (
              <MenuItem className="sort-options__item" key={sortOption.value}>
              <Radio
              name={'sortRule'}
              id={sortOption.value}
              value={sortOption.value}
              isChecked={sortOption.value === sortRule.value}
              label={
                sortOption.value === sortRule.value ? (
                  <>
                    <Icon name="check" />
                    {sortOption.name}
                  </>
                ) : (
                  sortOption.name
                )
              }
              onChange={sortRule.onChange}
              classes={{
                radio: `sort-rule__radio`,
                label: `sort-rule__radio-label`
              }}
            />
            </MenuItem>
            ))
            }
          </Menu>
          </PopoverWrapper>
        </MenuItem>
        }
        </Menu>
        </PopoverWrapper>
    );

TaskSettings.defaultProps = {
  classes: {
    wrapper: "",
    popover: "",
    button: "",
    menu: "",
    item: ""
  },
  filters: null,
  sortRule: null
}

export default TaskSettings;
