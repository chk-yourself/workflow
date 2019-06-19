import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Navbar.scss';
import { withOutsideClick } from '../withOutsideClick';
import { Logo } from '../Logo';
import { IconButton } from '../Button';

class Navbar extends Component {
  static defaultProps = {
    minWidth: 768,
    classes: {
      navbar: '',
      links: ''
    }
  };

  static propTypes = {
    minWidth: PropTypes.number,
    classes: PropTypes.shape({
      navbar: PropTypes.string,
      links: PropTypes.string
    })
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
    if (!isMobileView || e.target.matches('button') || e.target.matches('a')) return;
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
          <IconButton
            color="primary"
            icon="menu"
            label="Toggle menu"
            onClick={this.toggleMobileNavVisibility}
            className="navbar__btn--toggle"
          />
        )}
        <ul className={`navbar__links ${classes.links}`} onClick={this.handleClick}>
          {children}
        </ul>
      </nav>
    );
  }
}

export default withOutsideClick(Navbar);
