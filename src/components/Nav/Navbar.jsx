import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Navbar.scss';
import { withOutsideClick } from '../withOutsideClick';
import { Logo } from '../Logo';
import { IconButton } from '../Button';

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
    viewportWidth: window.innerWidth || document.documentElement.clientWidth,
    isMenuVisible: false
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({
      viewportWidth: window.innerWidth || document.documentElement.clientWidth
    });
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
    const { viewportWidth } = this.state;
    const { minWidth } = this.props;
    const isMobileView = viewportWidth < minWidth;

    if (!isMobileView || (!e.target.matches('button') && !e.target.matches('a'))) return;
    this.toggleMenu();
  };

  onOutsideClick = e => {
    const { viewportWidth } = this.state;
    const { minWidth } = this.props;
    const isMobileView = viewportWidth < minWidth;
    if (!isMobileView || e.target.matches('button') || e.target.matches('a')) return;
    this.hideMenu();
  };

  render() {
    const { viewportWidth, isMenuVisible } = this.state;
    const { minWidth, classes, children, innerRef } = this.props;
    const isMobileView = viewportWidth < minWidth;

    return (
      <nav
        className={`navbar ${isMobileView ? 'is-collapsed' : ''} ${
          isMobileView && isMenuVisible ? 'show-links' : ''
        } ${classes.nav || ''}`.trim()}
        ref={innerRef}
      >
        <Logo className="navbar__logo" />
        {isMobileView && (
          <IconButton
            color="primary"
            icon="menu"
            label="Toggle menu"
            onClick={this.toggleMenu}
            className="navbar__btn--toggle"
          />
        )}
        <ul className={`navbar__links ${classes.menu || ''}`} onClick={this.handleClick}>
          {children}
        </ul>
      </nav>
    );
  }
}

export default withOutsideClick(Navbar);
