import React, { Component } from 'react';
import { Navigation } from '../Navigation';
import './Header.scss';

export default class Header extends Component {
  render() {
    return (
      <header className="header">
        <Navigation />
      </header>
    );
  }
}
