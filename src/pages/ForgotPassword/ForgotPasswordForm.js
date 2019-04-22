import React, { Component } from 'react';
import { withFirebase } from '../../components/Firebase';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { ErrorMessage } from '../../components/Error';
import { SuccessMessage } from '../../components/Success';

const INITIAL_STATE = {
  email: '',
  error: null,
  success: null
};

class ForgotPasswordForm extends Component {
  state = { ...INITIAL_STATE };

  onSubmit = e => {
    const { email } = this.state;
    const { firebase } = this.props;

    firebase
      .sendPasswordResetEmail(email)
      .then(() => {
        this.setState({
          ...INITIAL_STATE,
          success: {
            message:
              'Recovery email sent! Follow the instructions in the email to reset your password.'
          }
        });
      })
      .catch(error => {
        this.setState({ error });
      });
    e.preventDefault();
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const { email, error, success } = this.state;
    const isInvalid = email === '';

    return (
      <form onSubmit={this.onSubmit} className="user-form">
        <Input
          name="email"
          id="email"
          label="Email"
          value={email}
          onChange={this.onChange}
          type="email"
          className="user-form__input"
          labelClass="user-form__label"
        />
        <Button
          disabled={isInvalid}
          type="submit"
          size="md"
          variant="contained"
          color="primary"
          onClick={this.onSubmit}
          className="forgot-password__btn"
        >
          Reset Password
        </Button>
        {error && <ErrorMessage text={error.message} />}
        {success && <SuccessMessage text={success.message} />}
      </form>
    );
  }
}

export default withFirebase(ForgotPasswordForm);
