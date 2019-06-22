import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withAuthorization } from '../Session';
import { TextField } from '../TextField';
import { Button } from '../Button';
import { ErrorMessage } from '../Error';

const INITIAL_STATE = {
  password: '',
  error: null
};

class AccountDeactivationForm extends Component {
  static defaultProps = {
    classes: {
      form: '',
      input: '',
      label: '',
      button: ''
    }
  };

  static propTypes = {
    classes: PropTypes.shape({
      form: PropTypes.string,
      input: PropTypes.string,
      label: PropTypes.string,
      button: PropTypes.string
    })
  };

  state = { ...INITIAL_STATE };

  reset = () => {
    this.setState({
      ...INITIAL_STATE
    });
  };

  deactivateAccount = e => {
    e.preventDefault();
    const { currentUser, firebase, history } = this.props;
    const { userId, email } = currentUser;
    const { password } = this.state;
    const { reauthenticateWithEmailAuthCredential, deactivateAccount } = firebase;
    reauthenticateWithEmailAuthCredential(email, password)
      .then(() => {
        history.push(`/home/0/${userId}`);
        this.reset();
        return deactivateAccount(userId);
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const { password, error } = this.state;
    const { classes } = this.props;

    return (
      <form
        className={classes.form || ''}
        id="account-deactivation-form"
        onSubmit={this.deactivateAccount}
      >
        <TextField
          name="password"
          id="passwordDeactivation"
          label="Password"
          value={password}
          onChange={this.onChange}
          type="password"
          className={classes.input || ''}
          labelClass={classes.label || ''}
        />
        <Button
          className={classes.button || ''}
          variant="contained"
          color="danger"
          disabled={password === ''}
          type="submit"
          marginTop={16}
          onClick={this.deactivateAccount}
        >
          Deactivate
        </Button>
        {error && <ErrorMessage text={error.message} />}
      </form>
    );
  }
}

const condition = currentUser => !!currentUser;

export default withAuthorization(condition)(AccountDeactivationForm);
