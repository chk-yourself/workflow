import React from 'react';
import { withFirebase } from '../Firebase';
import { Button } from '../Button';

const SignOutButton = ({ firebase, className }) => (
  <Button
    type="button"
    onClick={firebase.signOut}
    className={className}
    color="primary"
  >
    Sign Out
  </Button>
);

export default withFirebase(SignOutButton);
