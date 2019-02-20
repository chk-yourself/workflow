import React, { Component } from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { Input } from '../Input';
import { Button } from '../Button';

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
        const photoURL = authUser.user.photoURL || null;
        return this.props.firebase.addUser({
          userId,
          name,
          username,
          email,
          photoURL
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
      <form onSubmit={this.onSubmit} className="user-form">
        <Input
          name="name"
          title="Full Name"
          value={name}
          onChange={this.onChange}
          type="text"
          className="user-form__input"
        />
        <Input
          name="username"
          title="Username"
          value={username}
          onChange={this.onChange}
          type="text"
          className="user-form__input"
        />
        <Input
          name="email"
          title="Email"
          value={email}
          onChange={this.onChange}
          type="email"
          className="user-form__input"
        />
        <Input
          name="passwordOne"
          title="Password"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          className="user-form__input"
        />
        <Input
          name="passwordTwo"
          title="Confirm Password"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          className="user-form__input"
        />
        <Button
          disabled={isInvalid}
          type="submit"
          size="lg"
          variant="contained"
          color="primary"
          onClick={this.onSubmit}
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
