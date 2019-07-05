import React from 'react';
import PropTypes from 'prop-types';
import { Popover } from '../Popover';
import { Icon } from '../Icon';
import { Radio } from '../Radio';
import { Button, IconButton } from '../Button';
import { SelectDropdown } from '../SelectDropdown';
import './Settings.scss';

const Settings = ({
  icon,
  onToggle,
  onClose,
  onSave,
  isActive,
  settings,
  classes,
  ariaLabel
}) => (
  <Popover
    isActive={isActive}
    onOutsideClick={onClose}
    classes={{
      wrapper: `settings__wrapper ${classes.wrapper || ''}`,
      popover: `settings ${classes.settings || ''}`
    }}
    align={{ inner: 'right' }}
    buttonProps={{
      isActive,
      size: 'sm',
      iconOnly: true,
      className: `settings__btn ${classes.button || ''}`,
      children: <Icon name={icon} />,
      onClick: onToggle,
      ariaLabel
    }}
  >
    <IconButton
      className="settings__btn--close"
      size="sm"
      onClick={onClose}
      ariaLabel="Close"
      icon="x"
    />
    {settings.map(setting => (
      <div className={`settings__setting ${classes.setting || ''}`} key={setting.name}>
        <div className={`settings__name ${classes.name || ''}`}>
          {setting.label || setting.name}
        </div>
        {
          {
            radio: (
              <fieldset className={`settings__fieldset ${classes.fieldset || ''}`}>
                {Object.keys(setting.options).map(key => {
                  const option = setting.options[key];
                  return (
                    <Radio
                      key={option.value}
                      name={setting.name}
                      id={option.value}
                      value={option.value}
                      isChecked={setting.value === option.value}
                      label={option.label}
                      onChange={setting.onChange}
                      classes={{
                        radio: `settings__radio ${classes.radio || ''}`,
                        label: `settings__radio-label ${classes.radioLabel || ''}`
                      }}
                    />
                  );
                })}
              </fieldset>
            ),
            select: (
              <SelectDropdown
                name={setting.name}
                onChange={setting.onChange}
                selected={setting.selected}
                options={setting.options}
                classes={{
                  wrapper: `settings__dropdown-wrapper ${classes.dropdownWrapper || ''}`,
                  dropdown: `settings__dropdown ${classes.dropdown || ''}`,
                  option: `settings__select-option ${classes.selectOption || ''}`,
                  label: `settings__select-label ${classes.selectLabel || ''}`,
                  menu: `settings__menu ${classes.menu || ''}`,
                  item: `settings__item ${classes.item || ''}`,
                  button: `settings__btn--dropdown ${classes.dropdownButton || ''}`
                }}
              />
            )
          }[setting.type]
        }
      </div>
    ))}
    <Button
      type="button"
      color="primary"
      variant="contained"
      className="settings__btn--save"
      size="sm"
      onClick={onSave}
    >
      Save Settings
    </Button>
  </Popover>
);

Settings.defaultProps = {
  icon: 'settings',
  classes: {
    name: '',
    wrapper: '',
    settings: '',
    setting: '',
    radio: '',
    radioLabel: '',
    selectOption: '',
    selectLabel: '',
    dropdown: '',
    dropdownWrapper: '',
    dropdownButton: '',
    button: '',
    menu: '',
    item: ''
  },
  settings: [],
  ariaLabel: 'Toggle settings menu'
};

Settings.propTypes = {
  icon: PropTypes.string,
  ariaLabel: PropTypes.string,
  classes: PropTypes.shape({
    name: PropTypes.string,
    wrapper: PropTypes.string,
    settings: PropTypes.string,
    setting: PropTypes.string,
    radio: PropTypes.string,
    radioLabel: PropTypes.string,
    selectOption: PropTypes.string,
    selectLabel: PropTypes.string,
    dropdown: PropTypes.string,
    dropdownWrapper: PropTypes.string,
    dropdownButton: PropTypes.string,
    button: PropTypes.string,
    menu: PropTypes.string,
    item: PropTypes.string
  }),
  settings: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        label: PropTypes.string,
        name: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['radio', 'select']).isRequired,
        onChange: PropTypes.func,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
        options: PropTypes.objectOf(
          PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.oneOfType([
              PropTypes.string,
              PropTypes.number,
              PropTypes.bool
            ])
          })
        )
      }),
      PropTypes.shape({
        label: PropTypes.string,
        name: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['radio', 'select']).isRequired,
        onChange: PropTypes.func,
        selected: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
          PropTypes.bool
        ]),
        options: PropTypes.objectOf(
          PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.oneOfType([
              PropTypes.string,
              PropTypes.number,
              PropTypes.bool
            ])
          })
        )
      })
    ])
  )
};

export default Settings;
