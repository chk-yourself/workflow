import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../../components/Firebase';
import * as ROUTES from '../../constants/routes';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { PasswordForgetLink } from '../PasswordForget';

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null
};

class LoginForm extends Component {
  state = { ...INITIAL_STATE };

  onSubmit = e => {
    const { email, password } = this.state;
    const { firebase, history } = this.props;
    firebase
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        history.push(ROUTES.HOME);
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

  enableGoogleLogin = e => {
    const { signInWithGoogle } = this.props.firebase;
    signInWithGoogle();
    e.preventDefault();
  };

  enableGithubLogin = e => {
    const { signInWithGoogle } = this.props.firebase;
    signInWithGoogle();
    e.preventDefault();
  };

  render() {
    const { email, password, error } = this.state;
    const isInvalid = password === '' || email === '';
    return (
      <form className="user-form">
        <Button
          size="md"
          variant="outlined"
          color="neutral"
          onClick={this.enableGoogleLogin}
          className="login__btn--alt"
        >
          Continue with Google
        </Button>
        <Button
          size="md"
          variant="outlined"
          color="neutral"
          onClick={this.enableGithubLogin}
          className="login__btn--alt"
        >
          Continue with Github
        </Button>
        <Input
          name="email"
          label="Email"
          value={email}
          onChange={this.onChange}
          type="email"
          className="user-form__input"
          labelClass="user-form__label"
        />
        <Input
          name="password"
          label="Password"
          value={password}
          onChange={this.onChange}
          type="password"
          className="user-form__input"
          labelClass="user-form__label"
        />
        <PasswordForgetLink />
        <Button
          disabled={isInvalid}
          type="submit"
          size="md"
          variant="contained"
          color="secondary"
          onClick={this.onSubmit}
          className="login__btn"
        >
          Log In
        </Button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

export default compose(
  withRouter,
  withFirebase
)(LoginForm);
