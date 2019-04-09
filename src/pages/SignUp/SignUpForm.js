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
  passwordOne: '',
  passwordTwo: '',
  error: null
};

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = e => {
    const { username, email, name, passwordOne } = this.state;
    const { firebase, history } = this.props;
    firebase
      .createUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        const userId = authUser.user.uid;
        const photoURL = authUser.user.photoURL || null;
        return firebase.addUser({
          userId,
          name,
          username,
          email,
          photoURL
        });
      })
      .then(authUser => {
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

  render() {
    const {
      username,
      name,
      email,
      passwordOne,
      passwordTwo,
      error
    } = this.state;
    const isInvalid =
      passwordOne === '' ||
      passwordTwo === '' ||
      email === '' ||
      username === '' ||
      passwordOne !== passwordTwo;

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
          name="passwordOne"
          label="Password"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          className="user-form__input"
          labelClass="user-form__label"
        />
        <Input
          name="passwordTwo"
          label="Confirm Password"
          value={passwordTwo}
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
