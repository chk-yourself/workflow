import React, { Component } from 'react';
import Tabs from './Tabs';
import Tab from './Tab';
import TabPanel from './TabPanel';
import * as KEYS from '../../constants/keys';
import './Tabs.scss';

export default class TabsContainer extends Component {
  static defaultProps = {
    classes: {
      container: '',
      tabs: '',
      tab: '',
      panel: '',
      header: ''
    },
    tabs: []
  };

  state = {
    selectedIndex: 0
  };

  onSelectTab = e => {
    if (e.type === 'keydown' && e.key !== KEYS.ENTER) return;
    const { dataset } = e.target;
    const { index } = dataset;
    this.setState({
      selectedIndex: +index
    });
  };

  render() {
    const { classes, tabs } = this.props;
    const { selectedIndex } = this.state;
    return (
      <div className={`tabs-container ${classes.container || ''}`}>
        <header className={`tabs-container__header ${classes.header || ''}`}>
          <Tabs className={classes.tabs || ''}>
            {tabs.map((tab, i) => (
              <Tab
                key={tab.id}
                id={tab.id}
                panelId={tab.panelId}
                className={classes.tab || ''}
                index={i}
                onSelectTab={this.onSelectTab}
                isActive={i === selectedIndex}
              >
                {tab.label}
              </Tab>
            ))}
          </Tabs>
        </header>
        {tabs.map((tab, i) => (
          <TabPanel
            key={tab.panelId}
            id={tab.panelId}
            tabId={tab.id}
            className={classes.panel || ''}
            isActive={i === selectedIndex}
          >
            {tab.content}
          </TabPanel>
        ))}
      </div>
    );
  }
}
