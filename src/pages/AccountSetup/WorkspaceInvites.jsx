import React, { Component } from 'react';
import * as ROUTES from '../../constants/routes';
import { Checkbox } from '../../components/Checkbox';

export default class WorkspaceInvites extends Component {
  render() {
    const { invites, onChange } = this.props;

    return (
      <section className="account-setup__section">
        <h2 className="account-setup__section-heading">You were invited to join the following workspaces:</h2>
        <p className="account-setup__paragraph">Please select the workspaces you wish to join.</p>
        <ul className="account-setup__list">
        {invites.map((invite, i) => (
          <li key={invite.id} className="account-setup__item">
          <Checkbox
            name={invite.id}
            value={invite.id}
            id={invite.id}
            onChange={onChange}
            className="account-setup__checkbox"
            labelClass="account-setup__checkbox-label"
            isChecked={invite.isAccepted}
            data-index={i}
            label={invite.name}
          />
          </li>
        ))}
        </ul>
      </section>
    );
  }
}
