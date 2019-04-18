import React from 'react';
import { withFirebase } from '../../components/Firebase';
import { Main } from '../../components/Main';
import { Button } from '../../components/Button';
import './VerificationRequired.scss';

const VerificationRequired = ({ firebase }) => (
  <Main
    classes={{ main: 'verification-required', title: 'verification-required__heading' }}
    title="Please verify your email"
  >
    <p className="verification-required__paragraph">
      Thanks for signing up with Workflow! Please verify your email address to
      continue setting up your account.
    </p>
    <Button
      size="md"
      variant="contained"
      color="primary"
      className="verification-required__btn"
      onClick={() => firebase.sendEmailVerification()}
    >
      Resend Verification Link
    </Button>
  </Main>
);

export default withFirebase(VerificationRequired);
