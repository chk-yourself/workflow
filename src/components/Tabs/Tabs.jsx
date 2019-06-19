import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tablist from './Tablist';
import Tab from './Tab';
import TabPanel from './TabPanel';
import * as KEYS from '../../constants/keys';
import './Tabs.scss';

export default class Tabs extends Component {
  static defaultProps = {
    classes: {
      tabs: '',
      tablist: '',
      tab: '',
      panel: '',
      header: ''
    },
    tabs: [],
    variant: 'underlined',
    selectedIndex: 0
  };

  static propTypes = {
    classes: PropTypes.shape({
      tabs: PropTypes.string,
      tablist: PropTypes.string,
      tab: PropTypes.string,
      panel: PropTypes.string,
      header: PropTypes.string
    }),
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        panelId: PropTypes.string,
        label: PropTypes.string,
        content: PropTypes.node
      })
    ),
    variant: PropTypes.oneOf(['outlined', 'underlined']),
    selectedIndex: PropTypes.number
  };

  state = {
    selectedIndex: this.props.selectedIndex
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
    const { classes, tabs, variant } = this.props;
    const { selectedIndex } = this.state;
    return (
      <div className={`tabs ${classes.tabs || ''}`}>
        <header className={`tabs__header ${classes.header || ''}`}>
          <Tablist className={classes.tablist || ''}>
            {tabs.map((tab, i) => (
              <Tab
                key={tab.id}
                id={tab.id}
                panelId={tab.panelId}
                className={classes.tab || ''}
                index={i}
                onSelect={this.onSelectTab}
                isSelected={i === selectedIndex}
                variant={variant}
              >
                {tab.label}
              </Tab>
            ))}
          </Tablist>
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
