import React from 'react';
import { Input } from '../../components/Input';
import { Textarea } from '../../components/Textarea';

const ProfileSetup = ({ name, displayName, email, about, onChange }) => (
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
      name="displayName"
      id="displayName"
      label="Display name (optional)"
      value={displayName}
      onChange={onChange}
      type="text"
      className="account-setup__input"
      labelClass="account-setup__label"
      data-section="profile"
      helper="The name your teammates will use to @mention you in Workflow. If ommitted, your full name will be used."
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
      label="About Me (optional)"
      value={about}
      onChange={onChange}
      className="account-setup__textarea"
      labelClass="account-setup__label"
      data-section="profile"
    />
  </section>
);

export default ProfileSetup;
