import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { Input } from '../Input';

const INITIAL_STATE = {
  email: '',
  error: null
};

class PasswordForgetForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = e => {
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
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
    const { email, error } = this.state;
    const isInvalid = email === '';

    return (
      <form onSubmit={this.onSubmit}>
        <Input
          name="email"
          title="Email"
          value={email}
          onChange={this.onChange}
          type="email"
        />
        <button disabled={isInvalid} type="submit">
          Reset My Password
        </button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

export default withFirebase(PasswordForgetForm);
