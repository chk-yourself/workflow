import React, { Component } from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../../components/Firebase';
import * as ROUTES from '../../constants/routes';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

const INITIAL_STATE = {
  username: '',
  name: '',
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

  onSubmit = e => {
    const { username, email, name, password } = this.state;
    const { firebase, history } = this.props;

    // firebase.sendSignInLinkToEmail(email);
    firebase
      .createUserWithEmailAndPassword(email, password)
      /*
      .then(() => {
        return firebase.sendSignInLinkToEmail(email);
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        history.push(ROUTES.VERIFICATION_REQUIRED)
      })
      */
      .then(authUser => {
        return firebase.sendSignInLinkToEmail(email);
        const userId = authUser.user.uid;
        const photoURL = authUser.user.photoURL || null;
        /*
        return firebase.addUser({
          userId,
          name,
          username,
          email,
          photoURL
        });
        */
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        history.push(ROUTES.VERIFICATION_REQUIRED);
        // history.push(ROUTES.HOME);
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
    const {
      username,
      name,
      email,
      password,
      passwordConfirm,
      error
    } = this.state;
    const isInvalid =
      password === '' ||
      passwordConfirm === '' ||
      email === '' ||
      username === '' ||
      password !== passwordConfirm;

    return (
      <form onSubmit={this.onSubmit} className="user-form">
        <Input
          name="name"
          label="Full Name"
          value={name}
          onChange={this.onChange}
          type="text"
          className="user-form__input"
          labelClass="user-form__label"
        />
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
          name="username"
          label="Username"
          value={username}
          onChange={this.onChange}
          type="text"
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
        <Input
          name="passwordConfirm"
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
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

export default compose(
  withRouter,
  withFirebase
)(SignUpForm);
