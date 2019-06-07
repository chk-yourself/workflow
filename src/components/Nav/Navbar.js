import React, { Component } from 'react';
import './Navbar.scss';
import { withOutsideClick } from '../withOutsideClick';
import { Logo } from '../Logo';
import { Button } from '../Button';
import { Icon } from '../Icon';

class Navbar extends Component {
  static defaultProps = {
    minWidth: 768,
    classes: {
      navbar: '',
      links: ''
    }
  };

  state = {
    viewportWidth: window.innerWidth,
    isMobileNavVisible: false
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
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

    if (!isMobileView || (!e.target.matches('button') && !e.target.matches('a'))) return;
    this.toggleMobileNavVisibility();
  };

  onOutsideClick = e => {
    const { viewportWidth } = this.state;
    const { minWidth } = this.props;
    const isMobileView = viewportWidth < minWidth;
    if (
      !isMobileView ||
      e.target.matches('button') ||
      e.target.matches('a')
    )
      return;
    this.setState({
      isMobileNavVisible: false
    });
  };

  render() {
    const { viewportWidth, isMobileNavVisible } = this.state;
    const { minWidth, classes, children, innerRef } = this.props;
    const isMobileView = viewportWidth < minWidth;

    return (
      <nav
        className={`navbar ${isMobileView ? 'is-collapsed' : ''} ${
          isMobileView && isMobileNavVisible ? 'show-links' : ''
        } ${classes.navbar}`}
        ref={innerRef}
      >
        <Logo className="navbar__logo" onClick={this.handleClick} />
        {isMobileView && (
          <Button
            type="button"
            color="primary"
            onClick={this.toggleMobileNavVisibility}
            iconOnly
            className="navbar__btn--toggle"
          >
            <Icon name="menu" />
          </Button>
        )}
        <ul
          className={`navbar__links ${classes.links}`}
          onClick={this.handleClick}
        >
          {children}
        </ul>
      </nav>
    );
  }
}

export default withOutsideClick(Navbar);