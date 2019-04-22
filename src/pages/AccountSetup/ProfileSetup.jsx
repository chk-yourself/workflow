import React, { Component } from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../../components/Firebase';
import * as ROUTES from '../../constants/routes';
import { Input } from '../../components/Input';
import { Textarea } from '../../components/Textarea';

class ProfileSetup extends Component {
  render() {
    const { name, username, email, about, onChange } = this.props;

    return (
      <section className="account-setup__section">
        <h2 className="account-setup__section-heading">Your profile</h2>
        <Input
          name="name"
          id="name"
          label="Full name"
          value={name}
          onChange={onChange}
          type="text"
          className="account-setup__input"
          labelClass="account-setup__label"
          data-section="profile"
          isRequired
        />
        <Input
          name="username"
          id="username"
          label="Username"
          value={username}
          onChange={onChange}
          type="text"
          className="account-setup__input"
          labelClass="account-setup__label"
          data-section="profile"
          isRequired
        />
        <Input
          name="email"
          id="email"
          label="Email"
          value={email}
          type="email"
          className="account-setup__input"
          labelClass="account-setup__label"
          data-section="profile"
          isReadOnly
        />
        <Textarea
          name="about"
          id="about"
          label="About Me (Optional)"
          value={about}
          onChange={onChange}
          className="account-setup__textarea"
          labelClass="account-setup__label"
          data-section="profile"
        />
      </section>
    );
  }
}

export default compose(
  withRouter,
  withFirebase
)(ProfileSetup);
