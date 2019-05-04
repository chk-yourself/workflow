import React, { Component } from 'react';
import { withFirebase } from '../../components/Firebase';
import { Main } from '../../components/Main';
import { Button } from '../../components/Button';
import { ErrorMessage } from '../../components/Error';
import { SuccessMessage } from '../../components/Success';
import './VerificationRequired.scss';

class VerificationRequired extends Component {
  state = {
    success: null,
    error: null
  };

  resendVerificationEmail = () => {
    const { firebase } = this.props;
    firebase
      .sendEmailVerification()
      .then(() => {
        this.setState({
          success: {
            message: 'Verification email sent!'
          }
        });
      })
      .catch(error => {
        this.setState({
          error
        });
      });
  };

  render() {
    const { error, success } = this.state;
    return (
      <Main
        classes={{
          main: 'verification-required',
          title: 'verification-required__heading'
        }}
        title="Please verify your email"
      >
        <p className="verification-required__paragraph">
          Thanks for signing up with Workflow! Please verify your email address
          to continue setting up your account.
        </p>
        <p className="verification-required__paragraph">
          If you haven't received an email from us, click the button below.
        </p>
        <Button
          size="md"
          variant="outlined"
          color="neutral"
          className="verification-required__btn"
          onClick={this.resendVerificationEmail}
        >
          Resend Verification Email
        </Button>
        {error && <ErrorMessage text={error.message} />}
        {success && <SuccessMessage text={success.message} />}
      </Main>
    );
  }
}

export default withFirebase(VerificationRequired);
