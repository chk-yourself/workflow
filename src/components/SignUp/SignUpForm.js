import React, { Component } from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { Input } from '../Input';

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
    this.props.firebase
      .createUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        const userId = authUser.user.uid;
        return this.props.firebase.addUser({
          userId,
          name,
          username,
          email
        });
      })
      .then(authUser => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
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
      <form onSubmit={this.onSubmit}>
        <Input
          name="name"
          title="Full Name"
          value={name}
          onChange={this.onChange}
          type="text"
        />
        <Input
          name="username"
          title="Username"
          value={username}
          onChange={this.onChange}
          type="text"
        />
        <Input
          name="email"
          title="Email"
          value={email}
          onChange={this.onChange}
          type="email"
        />
        <Input
          name="passwordOne"
          title="Password"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
        />
        <Input
          name="passwordTwo"
          title="Confirm Password"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
        />
        <button disabled={isInvalid} type="submit">
          Sign Up
        </button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

export default compose(
  withRouter,
  withFirebase
)(SignUpForm);
