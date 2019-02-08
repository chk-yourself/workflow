import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { Input } from '../Input';

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = e => {
    const { passwordOne } = this.state;

    this.props.firebase
      .passwordUpdate(passwordOne)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
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
    const { passwordOne, passwordTwo, error } = this.state;
    const isInvalid = passwordOne === '' || passwordOne !== passwordTwo;

    return (
      <form onSubmit={this.onSubmit}>
        <Input
          name="passwordOne"
          title="New Password"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
        />
        <Input
          name="passwordTwo"
          title="Confirm New Password"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
        />
        <button disabled={isInvalid} type="submit">
          Reset My Password
        </button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

export default withFirebase(PasswordChangeForm);
