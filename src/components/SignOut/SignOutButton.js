import React from 'react';
import { withFirebase } from '../Firebase';
import { Button } from '../Button';
import './SignOutButton.scss';

const SignOutButton = ({ firebase }) => (
  <Button
    type="button"
    onClick={firebase.signOut}
    className="btn--sign-out"
    color="primary"
  >
    Sign Out
  </Button>
);

export default withFirebase(SignOutButton);
