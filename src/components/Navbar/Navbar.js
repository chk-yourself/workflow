import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { SignOutButton } from '../SignOut';
import './Navbar.scss';
import { AuthUserContext } from '../Session';
import { Button } from '../Button';
import { Icon } from '../Icon';

const NavLinksAuth = ({ className = '', onClick }) => (
  <ul className={`navbar__links ${className}`} onClick={onClick}>
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
  </ul>
);

const NavLinksNonAuth = ({ className = '', onClick }) => (
  <ul className={`navbar__links ${className}`} onClick={onClick}>
    <li>
      <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    </li>
  </ul>
);

export default class Navbar extends Component {
  static defaultProps = {
    minWidth: 768
  };

  state = {
    viewportWidth: window.innerWidth,
    isMobileNavVisible: false
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('click', this.handleOutsideClick);
  }

  handleOutsideClick = e => {
    const { viewportWidth } = this.state;
    const { minWidth } = this.props;
    const isMobileView = viewportWidth < minWidth;
    
    if (!isMobileView || this.navEl.contains(e.target)) return;

    this.setState({
      isMobileNavVisible: false
    });
  };

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
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('click', this.handleOutsideClick);
  }

  render() {
    const { viewportWidth, isMobileNavVisible } = this.state;
    const { minWidth, navRef } = this.props;
    const isMobileView = viewportWidth < minWidth;

    return (
      <nav
        className={`navbar ${isMobileView ? 'is-collapsed' : ''} ${
          isMobileView && isMobileNavVisible ? 'show-links' : ''
        }`}
        ref={el => (this.navEl = el)}
      >
        <span className="navbar__logo">
          <Link to={ROUTES.LANDING}>workflow</Link>
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
        <AuthUserContext.Consumer>
          {authUser =>
            authUser ? (
              <NavLinksAuth onClick={this.handleClick} />
            ) : (
              <NavLinksNonAuth onClick={this.handleClick} />
            )
          }
        </AuthUserContext.Consumer>
      </nav>
    );
  }
}
