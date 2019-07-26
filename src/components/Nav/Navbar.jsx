import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Navbar.scss';
import { withOutsideClick } from '../withOutsideClick';
import { Logo } from '../Logo';
import { IconButton } from '../Button';
import { Menu } from '../Menu';

class Navbar extends Component {
  static defaultProps = {
    minWidth: 768, // min viewport width required for expanding nav links
    classes: {
      nav: '',
      menu: ''
    }
  };

  static propTypes = {
    minWidth: PropTypes.number,
    classes: PropTypes.shape({
      nav: PropTypes.string,
      menu: PropTypes.string
    })
  };

  state = {
    isMenuVisible: false
  };

  toggleMenu = () => {
    this.setState(prevState => ({
      isMenuVisible: !prevState.isMenuVisible
    }));
  };

  hideMenu = () => {
    this.setState({
      isMenuVisible: false
    });
  };

  handleClick = e => {
    if (!e.target.matches('button') && !e.target.matches('a')) return;
    this.toggleMenu();
  };

  onOutsideClick = e => {
    if (e.target.matches('button') || e.target.matches('a')) return;
    this.hideMenu();
  };

  render() {
    const { isMenuVisible } = this.state;
    const { classes, children, innerRef } = this.props;

    return (
      <nav
        className={`navbar ${isMenuVisible ? 'show-links' : ''} ${classes.nav || ''}`.trim()}
        ref={innerRef}
      >
        <Logo className="navbar__logo" />
        <IconButton
          color="primary"
          icon="menu"
          ariaLabel="Toggle menu"
          onClick={this.toggleMenu}
          className="navbar__btn--toggle"
        />
        <Menu className={`navbar__links ${classes.menu || ''}`} onClick={this.handleClick}>
          {children}
        </Menu>
      </nav>
    );
  }
}

export default withOutsideClick(Navbar);
