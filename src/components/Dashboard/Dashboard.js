import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirebase } from '../Firebase';
import { userActions, userSelectors } from '../../ducks/users';
import { currentActions, currentSelectors } from '../../ducks/current';
import { projectActions, projectSelectors } from '../../ducks/projects';
import { ProjectGridContainer } from '../ProjectGrid';
import DashboardSection from './DashboardSection';
import './Dashboard.scss';

class Dashboard extends Component {
  render() {
    const { toggleProjectComposer } = this.props;
    return (
      <main className="dashboard">
        <h1 className="dashboard__header">Home</h1>
        <DashboardSection title="Projects" icon="grid">
          <ProjectGridContainer openProjectComposer={toggleProjectComposer} />
        </DashboardSection>
        <DashboardSection title="Tasks" icon="check-square" />
      </main>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentProjectId: currentSelectors.getCurrentProjectId(state),
    projectsById: projectSelectors.getProjectsById(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default withFirebase(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Dashboard)
);
