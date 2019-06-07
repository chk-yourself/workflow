import React from 'react';
import { Checkbox } from '../../components/Checkbox';

const WorkspaceInvites = ({ invites, onChange }) => (
  <section className="account-setup__section">
    <h2 className="account-setup__section-heading">
      You were invited to join the following workspaces:
    </h2>
    <p className="account-setup__paragraph">
      Please select the workspaces you wish to join.
    </p>
    <ul className="account-setup__list">
      {invites.map((invite, i) => (
        <li key={invite.id} className="account-setup__item">
          <Checkbox
            name={invite.data.id}
            value={invite.data.id}
            id={invite.data.id}
            onChange={onChange}
            className="account-setup__checkbox"
            labelClass="account-setup__checkbox-label"
            isChecked={invite.isAccepted}
            data-index={i}
            label={invite.data.name}
          />
        </li>
      ))}
    </ul>
  </section>
);

export default WorkspaceInvites;
