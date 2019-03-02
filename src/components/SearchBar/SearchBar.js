import React, { Component } from 'react';
import './SearchBar.scss';

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleClick(e) {
    e.stopPropagation();
    const searchFormInput = document.querySelector('.search-form__input');
    if (e.target.classList.contains('search-form__input') || searchFormInput.value !== '') return;
    this.setState(state => ({
      isExpanded: !state.isExpanded
    }));
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  render() {
    return (
      <div
        onClick={e => this.handleClick(e)}
        className={`search-bar${this.state.isExpanded ? ' is-expanded' : ''}`}
      >
        <form className="search-form" onSubmit={e => this.handleSubmit(e)}>
          <input className="search-form__input" type="text" />
          <input className="search-form__submit" type="submit" value="" />
          <button type="button" className="btn search-form__btn">
            <FeatherIcon name="search" />
          </button>
        </form>
      </div>
    );
  }
}