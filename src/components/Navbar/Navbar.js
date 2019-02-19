import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { SignOutButton } from '../SignOut';
import './Navbar.scss';
import { AuthUserContext } from '../Session';
import { Button } from '../Button';
import { Icon } from '../Icon';

const NavLinksAuth = () => (
  <>
    <li>
      <Link to={ROUTES.HOME}>Home</Link>
    </li>
    <li>
      <Link to={ROUTES.ACCOUNT}>Account</Link>
    </li>
    <li>
      <Link to={ROUTES.ADMIN}>Admin</Link>
    </li>
    <li>
      <SignOutButton />
    </li>
  </>
);

const NavLinksNonAuth = () => (
  <>
    <li>
      <Link to={ROUTES.SIGN_IN}>Log In</Link>
    </li>
    <li>
      <Link to={ROUTES.SIGN_UP}>Get Started</Link>
    </li>
  </>
);

export default class Navbar extends Component {
  static defaultProps = {
    minWidth: 768
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
    const { minWidth, navRef, navLinksClass } = this.props;
    const isMobileView = viewportWidth < minWidth;

    return (
      <nav
        className={`navbar ${isMobileView ? 'is-collapsed' : ''} ${
          isMobileView && isMobileNavVisible ? 'show-links' : ''
        }`}
        ref={el => (this.navEl = el)}
      >
        <span className="navbar__logo">
          <Link to={ROUTES.LANDING} onClick={this.handleClick}>
            workflow
          </Link>
        </span>
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
          className={`navbar__links ${navLinksClass}`}
          onClick={this.handleClick}
          ref={el => (this.navLinksEl = el)}
        >
          <AuthUserContext.Consumer>
            {authUser => (authUser ? <NavLinksAuth /> : <NavLinksNonAuth />)}
          </AuthUserContext.Consumer>
        </ul>
      </nav>
    );
  }
}
