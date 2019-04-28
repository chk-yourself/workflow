import React from 'react';
import { ExpansionPanel } from '../../components/ExpansionPanel';
import { Icon } from '../../components/Icon';

const GuidePanel = ({ title, children }) => (
  <ExpansionPanel
    classes={{
      panel: 'guide__panel',
      content: 'guide__panel-content',
      header: 'guide__panel-header'
    }}
    header={
      <>
        <Icon name="chevron-right" />
        {title}
      </>
    }
  >
    {children}
  </ExpansionPanel>
);

export default GuidePanel;
