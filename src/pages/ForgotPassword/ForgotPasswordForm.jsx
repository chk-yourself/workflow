import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withFirebase } from '../../components/Firebase';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { ErrorMessage } from '../../components/Error';
import { SuccessMessage } from '../../components/Success';

const INITIAL_STATE = {
  email: '',
  error: null,
  success: null
};

class ForgotPasswordForm extends Component {
  static defaultProps = {
    classes: {
      form: '',
      input: '',
      label: '',
      button: ''
    }
  };

  static propTypes = {
    classes: PropTypes.shape({
      form: PropTypes.string,
      input: PropTypes.string,
      label: PropTypes.string,
      button: PropTypes.string
    })
  };

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
    const { classes } = this.props;
    const isInvalid = email === '';

    return (
      <form className={classes.form || ''} onSubmit={this.onSubmit}>
        <TextField
          name="email"
          id="email"
          label="Email"
          value={email}
          onChange={this.onChange}
          type="email"
          className={classes.input || ''}
          labelClass={classes.label || ''}
        />
        <Button
          disabled={isInvalid}
          type="submit"
          size="md"
          variant="contained"
          color="secondary"
          onClick={this.onSubmit}
          className={`forgot-password__btn ${classes.button || ''}`}
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
