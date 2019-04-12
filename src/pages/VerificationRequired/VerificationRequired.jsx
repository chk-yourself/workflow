import React from 'react';
import { Main } from '../../components/Main';

const VerificationRequired = () => (
  <Main classes={{main: "verification-required"}} title="Please verify your email">
  <p className="verification-required__paragraph">Once you verify your email address, you can get started with Workflow!</p>
  </Main>
);

export default VerificationRequired;
