import React, { Component } from 'react';
import { Navbar } from '../Navbar';
import './Header.scss';

export default class Header extends Component {
  render() {
    return (
      <header className="header">
        <Navbar />
      </header>
    );
  }
}
