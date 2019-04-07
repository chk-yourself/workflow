import React from 'react';
import { PopoverWrapper } from '../Popover';
import { Icon } from '../Icon';
import { Radio } from '../Radio';
import { Button } from '../Button';
import { SelectDropdown } from '../SelectDropdown';
import './Settings.scss';

const Settings = ({
  icon,
  onToggle,
  onClose,
  onSave,
  isActive,
  settings,
  classes
}) => (
  <PopoverWrapper
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
      onClick: onToggle
    }}
  >
    <Button
      type="button"
      className="settings__btn--close"
      size="sm"
      onClick={onClose}
      iconOnly
    >
      <Icon name="x" />
    </Button>
    {settings.map(setting => (
      <div
        className={`settings__setting ${classes.setting || ''}`}
        key={setting.name}
      >
        {setting.name}
        {
          {
            radio: (
              <fieldset
                className={`settings__fieldset ${classes.fieldset || ''}`}
              >
                {Object.keys(setting.options).map(key => {
                  const option = setting.options[key];
                  return (
                    <Radio
                      key={option.value}
                      name={setting.key}
                      id={option.value}
                      value={option.value}
                      isChecked={setting.value === option.value}
                      label={option.name}
                      onChange={setting.onChange}
                      classes={{
                        radio: `settings__radio ${classes.radio || ''}`,
                        label: `settings__radio-label ${classes.radioLabel ||
                          ''}`
                      }}
                    />
                  );
                })}
              </fieldset>
            ),
            select: (
              <SelectDropdown
                name={setting.key}
                onChange={setting.onChange}
                value={setting.value}
                options={setting.options}
                classes={{
                  wrapper: `settings__dropdown-wrapper ${classes.dropdownWrapper ||
                    ''}`,
                  dropdown: `settings__dropdown ${classes.dropdown || ''}`,
                  option: `settings__select-option ${classes.selectOption ||
                    ''}`,
                  label: `settings__select-label ${classes.selectLabel || ''}`,
                  menu: `settings__menu ${classes.menu || ''}`,
                  item: `settings__item ${classes.item || ''}`,
                  button: `settings__btn--dropdown ${classes.dropdownButton ||
                    ''}`
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
      Save
    </Button>
  </PopoverWrapper>
);

Settings.defaultProps = {
  icon: 'settings',
  classes: {
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
  settings: {}
};

export default Settings;
