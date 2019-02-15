import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { SignOutButton } from '../SignOut';
import './Navigation.scss';
import { AuthUserContext } from '../Session';
import { Button } from '../Button';
import { Icon } from '../Icon';

const NavLinksAuth = ({ className = '' }) => (
  <ul className={`navbar__links ${className}`}>
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

const NavLinksNonAuth = ({ className = '' }) => (
  <ul className={`navbar__links ${className}`}>
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

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    const { viewportWidth, isMobileNavVisible } = this.state;
    const { minWidth } = this.props;
    const isMobileView = viewportWidth < minWidth;

    return (
      <nav
        className={`navbar ${isMobileView ? 'is-collapsed' : ''} ${
          isMobileView && isMobileNavVisible ? 'show-links' : ''
        }`}
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
          {authUser => (authUser ? <NavLinksAuth /> : <NavLinksNonAuth />)}
        </AuthUserContext.Consumer>
      </nav>
    );
  }
}
