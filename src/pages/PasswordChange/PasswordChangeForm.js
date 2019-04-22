import React, { Component } from 'react';
import { withFirebase } from '../../components/Firebase';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

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
      <form onSubmit={this.onSubmit} className="user-form">
        <Input
          name="passwordOne"
          id="passwordOne"
          label="New Password"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          className="user-form__input"
          labelClass="user-form__label"
        />
        <Input
          name="passwordTwo"
          id="passwordTwo"
          label="Confirm New Password"
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
        >
          Change Password
        </Button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

export default withFirebase(PasswordChangeForm);
