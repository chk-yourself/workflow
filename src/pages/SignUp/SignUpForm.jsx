import React, { Component } from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../../components/Firebase';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { ErrorMessage } from '../../components/Error';
import { isEmail } from '../../utils/validate';

const INITIAL_STATE = {
  email: '',
  password: '',
  passwordConfirm: '',
  error: null,
  emailValidation: null,
  passwordValidation: null
};

class SignUpForm extends Component {
  state = { ...INITIAL_STATE };

  onSubmit = async e => {
    e.preventDefault();
    const { email, password } = this.state;
    const { firebase } = this.props;
    const { localStorage } = window;

    // firebase.sendSignInLinkToEmail(email);
    await firebase
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        localStorage.setItem('loginEmail', email);
        return firebase.sendEmailVerification();
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  validateEmail = () => {
    const { email, emailValidation } = this.state;
    if (!email && !emailValidation) return;
    if (!email || isEmail(email)) {
      this.setState({
        emailValidation: null
      });
    } else if (!isEmail(email)) {
      this.setState({
        emailValidation: 'Please enter a valid email address.'
      });
    }
  };

  validatePassword = () => {
    const { password, passwordConfirm, passwordValidation } = this.state;
    if ((!password && !passwordValidation) || (!passwordConfirm && !passwordValidation))
      return;
    if (!password || !passwordConfirm || password === passwordConfirm) {
      this.setState({
        passwordValidation: null
      });
    } else if (password !== passwordConfirm) {
      this.setState({
        passwordValidation: `Passwords don't match.`
      });
    }
  };

  render() {
    const {
      email,
      password,
      passwordConfirm,
      error,
      emailValidation,
      passwordValidation
    } = this.state;
    const isInvalid =
      password === '' ||
      passwordConfirm === '' ||
      email === '' ||
      password !== passwordConfirm;

    return (
      <form onSubmit={this.onSubmit}>
        <TextField
          name="email"
          id="email"
          label="Email"
          value={email}
          onChange={this.onChange}
          type="email"
          className="form-page__input"
          labelClass="form-page__label"
          validationMessage={emailValidation}
          isInvalid={!!emailValidation}
          onBlur={this.validateEmail}
        />
        <TextField
          name="password"
          id="password"
          label="Password"
          value={password}
          onChange={this.onChange}
          type="password"
          className="form-page__input"
          labelClass="form-page__label"
          onBlur={this.validatePassword}
        />
        <TextField
          name="passwordConfirm"
          id="passwordConfirm"
          label="Confirm Password"
          value={passwordConfirm}
          onChange={this.onChange}
          type="password"
          className="form-page__input"
          labelClass="form-page__label"
          validationMessage={passwordValidation}
          isInvalid={!!passwordValidation}
          onBlur={this.validatePassword}
        />
        <Button
          disabled={isInvalid}
          type="submit"
          size="md"
          variant="contained"
          color="secondary"
          onClick={this.onSubmit}
          className="form-page__btn signup__btn"
        >
          Create Account
        </Button>
        {error && <ErrorMessage text={error.message} />}
      </form>
    );
  }
}

export default compose(
  withRouter,
  withFirebase
)(SignUpForm);
