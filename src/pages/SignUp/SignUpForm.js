import React, { Component } from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../../components/Firebase';
import * as ROUTES from '../../constants/routes';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { ErrorMessage } from '../../components/Error';

const INITIAL_STATE = {
  email: '',
  password: '',
  passwordConfirm: '',
  error: null
};

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

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

  render() {
    const { email, password, passwordConfirm, error } = this.state;
    const isInvalid =
      password === '' ||
      passwordConfirm === '' ||
      email === '' ||
      password !== passwordConfirm;

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
        <Input
          name="password"
          id="password"
          label="Password"
          value={password}
          onChange={this.onChange}
          type="password"
          className="user-form__input"
          labelClass="user-form__label"
        />
        <Input
          name="passwordConfirm"
          id="passwordConfirm"
          label="Confirm Password"
          value={passwordConfirm}
          onChange={this.onChange}
          type="password"
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
          className="sign-up__btn"
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
