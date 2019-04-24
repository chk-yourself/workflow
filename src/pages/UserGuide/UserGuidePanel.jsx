import React, { Component } from 'react';
import { ExpansionPanel } from '../../components/ExpansionPanel';
import { Icon } from '../../components/Icon';

class UserGuidePanel extends Component {
  state = {
    isExpanded: false
  };

  toggle = e => {
    this.setState(prevState => ({
      isExpanded: !prevState.isExpanded
    }));
  };

  render() {
    const { isExpanded } = this.state;
    const { title, children } = this.props;
    return (
      <ExpansionPanel
        onToggle={this.toggle}
        classes={{
          panel: 'user-guide__panel',
          content: 'user-guide__panel-content'
        }}
        header={{
          className: 'user-guide__panel-header',
          children: (
            <>
              <Icon name="chevron-right" />
              {title}
            </>
          )
        }}
      >
        {children}
      </ExpansionPanel>
    );
  }
}

export default UserGuidePanel;
