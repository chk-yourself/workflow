import React from 'react';
import { Input } from '../../components/Input';

const WorkspaceSetup = ({ name, invites, isOptional, onChange }) => (
  <section className="account-setup__section">
    <h2 className="account-setup__section-heading">{`Your workspace ${
      isOptional ? '(optional)' : ''
    }`}</h2>
    <Input
      name="name"
      id="workspaceName"
      label="Workspace name"
      value={name}
      onChange={onChange}
      className="account-setup__input"
      labelClass="account-setup__label"
      data-section="workspace"
    />
    <h3 className="account-setup__section-subheading">Your team (optional)</h3>
    {invites.map((email, i) => (
      <Input
        key={i}
        name="invites"
        value={email}
        onChange={onChange}
        type="email"
        className="account-setup__input account-setup__input--teammate-email"
        form="workspace"
        placeholder="Teammate's email"
        data-index={i}
        data-section="workspace"
      />
    ))}
  </section>
);

export default WorkspaceSetup;
