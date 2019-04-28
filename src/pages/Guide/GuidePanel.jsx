import React from 'react';
import { ExpansionPanel } from '../../components/ExpansionPanel';
import { Icon } from '../../components/Icon';

export const GuidePanelSection = ({ title, children }) => (
  <section className="guide__panel-section">
    <h3 className="guide__panel-section-title">{title}</h3>
    {children}
  </section>
);

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
