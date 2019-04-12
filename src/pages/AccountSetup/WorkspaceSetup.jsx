import React, { Component } from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../../components/Firebase';
import * as ROUTES from '../../constants/routes';
import { Input } from '../../components/Input';
import { Textarea } from '../../components/Textarea';

export default class WorkspaceSetup extends Component {
  render() {
    const { name, teammates, onChange } = this.props;

    return (
      <section className="account-setup__section">
        <h2 className="account-setup__section-heading">Your workspace</h2>
        <Input
          name="name"
          label="Workspace name"
          value={name}
          onChange={onChange}
          type="text"
          className="account-setup__input"
          labelClass="account-setup__label"
          data-section="workspace"
        />
        <h3 className="account-setup__section-subheading">
          Your team (optional)
        </h3>
        {teammates.map((email, i) => (
          <Input
            key={i}
            name="teammates"
            value={email}
            onChange={onChange}
            type="email"
            className="account-setup__input account-setup__input--teammate-email"
            form="workspace"
            placeholder="Teammate's email"
            hideLabel
            data-index={i}
            data-section="workspace"
          />
        ))}
      </section>
    );
  }
}
