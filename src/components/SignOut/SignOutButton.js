import React from 'react';
import { withFirebase } from '../Firebase';
import './SignOutButton.scss';

const SignOutButton = ({ firebase }) => (
  <button type="button" onClick={firebase.signOut} className="btn--sign-out">
    Sign Out
  </button>
);

export default withFirebase(SignOutButton);
