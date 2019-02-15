import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose, renderComponent } from 'recompose';
import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { Input } from '../Input';
import { Button } from '../Button';

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null
};

class SignInForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = e => {
    const { email, password } = this.state;
    this.props.firebase
      .signInWithEmailAndPassword(email, password)
      .then(() => {
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
    const { email, password, error } = this.state;
    const isInvalid = password === '' || email === '';
    return (
      <form onSubmit={this.onSubmit} className="user-form">
        <Input
          name="email"
          title="Email"
          value={email}
          onChange={this.onChange}
          type="email"
          className="user-form__input"
        />
        <Input
          name="password"
          title="Password"
          value={password}
          onChange={this.onChange}
          type="password"
          className="user-form__input"
        />
        <Button
          disabled={isInvalid}
          type="submit"
          size="large"
          variant="contained"
          color="primary"
        >
          Sign In
        </Button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

export default compose(
  withRouter,
  withFirebase
)(SignInForm);