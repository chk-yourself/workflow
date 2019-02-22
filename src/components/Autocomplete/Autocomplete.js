import React, { Component } from 'react';

import { Input } from '../Input';
import './Autocomplete.scss';

const INITIAL_STATE = {
  value: '',
  isActive: false,
  isTouchEnabled: false
};

export default class Autocomplete extends Component {
  state = { ...INITIAL_STATE };

  componentDidMount() {
    document.addEventListener('touchstart', this.handleTouch);
    document.addEventListener('click', this.handleOutsideClick, false);
  }

  componentWillUnmount() {
    const { isTouchEnabled } = this.state;

    if (isTouchEnabled) {
      document.removeEventListener('touchstart', this.handleOutsideClick);
    } else {
      document.removeEventListener('click', this.handleOutsideClick);
      document.removeEventListener('touchstart', this.handleTouch);
    }
  }

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

  handleOutsideClick = e => {
    if (!this.el.contains(e.target)) return;

    this.setState({
      isActive: false
    });
  };

  handleTouch = () => {
    this.setState({
      isTouchEnabled: true
    });
    // remove touch handler to prevent unnecessary refires
    document.removeEventListener('touchstart', this.handleTouch);
    // remove outside click handler from click events
    document.removeEventListener('click', this.handleOutsideClick);
    // reattach outside click handler to touchstart events
    document.addEventListener('touchstart', this.handleOutsideClick);
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
