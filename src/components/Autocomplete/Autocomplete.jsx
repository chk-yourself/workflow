import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from '../Input';
import { Popover } from '../Popover';
import './Autocomplete.scss';

const INITIAL_STATE = {
  value: '',
  isActive: false
};

export default class Autocomplete extends Component {
  state = { ...INITIAL_STATE };

  onFocus = () => {
    this.setState({
      isActive: true
    });
  };

  onReset = () => {
    this.setState({ ...INITIAL_STATE });
  };

  onChange = e => {
    this.setState({
      value: e.target.value
    });
  };

  render() {
    const {
      dataset,
      inputProps,
      inputClass,
      listClass,
      itemClass,
      filter,
      itemizedComponent
    } = this.props;
    const { value, isActive } = this.state;

    return (
      <div className="autocomplete" ref={el => (this.el = el)}>
        <Input
          className={`autocomplete__input ${inputClass}`}
          onChange={this.onChange}
          value={value}
          onFocus={this.onFocus}
          type="text"
          autoComplete="off"
          {...inputProps}
        />
        {isActive && (
          <ul className={`autocomplete__list ${listClass}`}>
            {dataset.filter(filter(item, value)).map(item => {
              return (
                <li
                  key={itemizedComponent.id}
                  className={`autocomplete__item ${itemClass}`}
                >
                  {itemizedComponent}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }
}
