import React, { Component } from 'react';
import './Navbar.scss';
import { Logo } from '../Logo';
import { Button } from '../Button';
import { Icon } from '../Icon';

export default class Navbar extends Component {
  static defaultProps = {
    minWidth: 768,
    classes: {
      navbar: '',
      links: ''
    }
  };

  state = {
    viewportWidth: window.innerWidth,
    isMobileNavVisible: false,
    isTouchEnabled: false
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('touchstart', this.handleTouch);
    document.addEventListener('click', this.handleOutsideClick);
  }

  handleResize = () => {
    this.setState({
      viewportWidth: window.innerWidth
    });
  };

  toggleMobileNavVisibility = () => {
    this.setState(prevState => ({
      isMobileNavVisible: !prevState.isMobileNavVisible
    }));
  };

  handleClick = e => {
    const { viewportWidth } = this.state;
    const { minWidth } = this.props;
    const isMobileView = viewportWidth < minWidth;

    if (!isMobileView) return;
    if (e.target.matches('button') || e.target.matches('a')) {
      this.toggleMobileNavVisibility();
    }
  };

  componentWillUnmount() {
    const { isTouchEnabled } = this.state;
    window.removeEventListener('resize', this.handleResize);

    if (isTouchEnabled) {
      document.removeEventListener('touchstart', this.handleOutsideClick);
    } else {
      document.removeEventListener('click', this.handleOutsideClick);
      document.removeEventListener('touchstart', this.handleTouch);
    }
  }

  handleOutsideClick = e => {
    const { viewportWidth } = this.state;
    const { minWidth } = this.props;
    const isMobileView = viewportWidth < minWidth;
    if (
      !isMobileView ||
      this.navLinksEl.contains(e.target) ||
      e.target.matches('button') ||
      e.target.matches('a')
    )
      return;
    this.setState({
      isMobileNavVisible: false
    });
  };

  handleTouch = () => {
    const { isTouchEnabled } = this.state;
    if (isTouchEnabled === true) return;
    this.setState({
      isTouchEnabled: true
    });
    document.removeEventListener('touchstart', this.handleTouch);
    document.removeEventListener('click', this.handleOutsideClick);
    document.addEventListener('touchstart', this.handleOutsideClick);
  };

  render() {
    const { viewportWidth, isMobileNavVisible } = this.state;
    const { minWidth, classes, children } = this.props;
    const isMobileView = viewportWidth < minWidth;

    return (
      <nav
        className={`navbar ${isMobileView ? 'is-collapsed' : ''} ${
          isMobileView && isMobileNavVisible ? 'show-links' : ''
        } ${classes.navbar}`}
        ref={el => (this.navEl = el)}
      >
        <Logo className="navbar__logo" onClick={this.handleClick} />
        {isMobileView && (
          <Button
            type="button"
            color="primary"
            onClick={this.toggleMobileNavVisibility}
            iconOnly
          >
            <Icon name="menu" />
          </Button>
        )}
        <ul
          className={`navbar__links ${classes.links}`}
          onClick={this.handleClick}
          ref={el => (this.navLinksEl = el)}
        >
          {children}
        </ul>
      </nav>
    );
  }
}
