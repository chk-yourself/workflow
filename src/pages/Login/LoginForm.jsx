import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../../components/Firebase';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { ForgotPasswordLink } from '../ForgotPassword';
import { ErrorMessage } from '../../components/Error';

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null
};

class LoginForm extends Component {
  state = { ...INITIAL_STATE };

  componentDidMount() {
    const { localStorage } = window;
    this.setState({
      email: localStorage.getItem('loginEmail') || ''
    });
  }

  onSubmit = e => {
    e.preventDefault();
    const { email, password } = this.state;
    const { firebase } = this.props;
    if (email === 'Guest') {
      try {
        if (password !== process.env.REACT_APP_GUEST_PW) {
          throw new Error('Incorrect password.');
        }
        firebase
          .signInAsGuest()
          .then(() => {
            this.setState({ ...INITIAL_STATE });
          })
          .catch(error => {
            this.setState({ error });
          });
      } catch (error) {
        this.setState({ error });
      }
    } else {
      firebase
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          this.setState({ ...INITIAL_STATE });
        })
        .catch(error => {
          this.setState({ error });
        });
    }
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
          className="form-page__btn login__btn--alt"
        >
          Continue with Google
        </Button>
        <Button
          size="md"
          variant="outlined"
          color="neutral"
          onClick={this.enableGithubLogin}
          className="form-page__btn login__btn--alt"
        >
          Continue with Github
        </Button>
        <Input
          name="email"
          id="email"
          label="Email"
          value={email}
          onChange={this.onChange}
          type="email"
          className="form-page__input"
          labelClass="form-page__label"
        />
        <Input
          name="password"
          id="password"
          label="Password"
          value={password}
          onChange={this.onChange}
          type="password"
          className="form-page__input"
          labelClass="form-page__label"
        />
        <ForgotPasswordLink />
        <Button
          disabled={isInvalid}
          type="submit"
          size="md"
          variant="contained"
          color="secondary"
          onClick={this.onSubmit}
          className="form-page__btn login__btn"
        >
          Log In
        </Button>
        {error && <ErrorMessage text={error.message} />}
      </form>
    );
  }
}

export default compose(
  withRouter,
  withFirebase
)(LoginForm);
