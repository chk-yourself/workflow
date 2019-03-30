import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input } from '../Input';
import { Icon } from '../Icon';
import { withAuthorization } from '../Session';
import { projectSelectors } from '../../ducks/projects';
import { Button } from '../Button';
import './ListComposer.scss';

const INITIAL_STATE = {
  name: '',
  isActive: false
};

class ListComposer extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  resetForm = () => {
    this.setState({ name: '' });
  };

  onReset = e => {
    this.setState({ ...INITIAL_STATE });
  };

  onSubmit = e => {
    e.preventDefault();
    const { name } = this.state;
    const { projectId, firebase } = this.props;
    firebase.addList({ projectId, name });
    this.resetForm();
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onFocus = e => {
    this.setState({
      isActive: true
    });
    if (e.target.matches('button')) {
      this.input.focus();
    }
  };

  onBlur = e => {
    if (e.target.value === '') {
      this.setState({
        isActive: false
      });
    }
  };

  inputRef = ref => {
    this.input = ref;
  };

  render() {
    const { name, isActive } = this.state;
    const { view } = this.props;
    return (
      <div
        className={`list-composer${isActive ? ' is-active' : ''} is-${view}-view`}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      >
        <form className="list-composer__form" onSubmit={this.onSubmit}>
        {!isActive && view === "list" && (
        <Button onClick={this.onFocus} color="primary" className="list-composer__btn--icon" iconOnly>
          <Icon name="plus-circle" />
        </Button>
        )
        }
          <Input
            innerRef={this.inputRef}
            onChange={this.onChange}
            value={name}
            placeholder={isActive ? 'Enter list name...' : 'Add a list'}
            required
            name="name"
            hideLabel
            className="list-composer__input"
          />
          {isActive && (
            <div className="list-composer__footer">
              <Button
                className="list-composer__btn list-composer__btn--add"
                type="submit"
                onClick={this.onSubmit}
                color="primary"
                variant="contained"
                size="sm"
              >
                Add List
              </Button>
              {view === "board" &&
              <Button
                className="list-composer__btn list-composer__btn--close"
                type="reset"
                onClick={this.onReset}
                size="sm"
              >
                Cancel
              </Button>
              }
            </div>
          )}
        </form>
      </div>
    );
  }
}

const condition = authUser => !!authUser;

const mapStateToProps = state => {
  return {
    projectsById: projectSelectors.getProjectsById(state),
    projectsArray: projectSelectors.getProjectsArray(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ListComposer)
);
