import React, { Component } from 'react';
import { withAuthorization } from '../../components/Session';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { ErrorMessage } from '../../components/Error';

const INITIAL_STATE = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  error: null
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = e => {
    const { newPassword, currentPassword } = this.state;
    const { firebase, currentUser } = this.props;
    const { updatePassword } = firebase;
    const { email } = currentUser;

    firebase
      .reauthenticateWithEmailAuthCredential(email, currentPassword)
      .then(() => updatePassword(newPassword))
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
    const { currentPassword, newPassword, confirmPassword, error } = this.state;
    const isInvalid =
      currentPassword === '' ||
      newPassword === '' ||
      newPassword !== confirmPassword;

    return (
      <form className="user-form">
        <Input
          name="currentPassword"
          id="currentPassword"
          label="Current Password"
          value={currentPassword}
          onChange={this.onChange}
          type="password"
          className="user-form__input"
          labelClass="user-form__label"
        />
        <Input
          name="newPassword"
          id="newPassword"
          label="New Password"
          value={newPassword}
          onChange={this.onChange}
          type="password"
          className="user-form__input"
          labelClass="user-form__label"
        />
        <Input
          name="confirmPassword"
          id="confirmPassword"
          label="Confirm New Password"
          value={confirmPassword}
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
        {error && <ErrorMessage error={error} />}
      </form>
    );
  }
}

const condition = currentUser => !!currentUser;

export default withAuthorization(condition)(PasswordChangeForm);
