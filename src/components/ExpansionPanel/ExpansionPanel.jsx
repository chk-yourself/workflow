import React, { Component } from 'react';
import ExpansionPanelHeader from './ExpansionPanelHeader';
import ExpansionPanelContent from './ExpansionPanelContent';

export default class ExpansionPanel extends Component {
  static defaultProps = {
    classes: {
      panel: '',
      header: '',
      content: ''
    },
    isExpanded: null,
    onChange: null,
    id: null
  };

  state = {
    isExpanded: false
  };

  toggleContent = () => {
    const { onChange, id } = this.props;

    if (!onChange) {
      this.setState(prevProps => ({
        isExpanded: !prevProps.isExpanded
      }));
    } else {
      onChange(id);
    }
  };

  render() {
    const { classes, header, content, isExpanded: propsIsExpanded } = this.props;
    const isExpanded = propsIsExpanded !== null ? propsIsExpanded : this.state.isExpanded;

    return (
      <div
        className={`accordion-panel ${classes.panel || ''}`}
        aria-expanded={isExpanded}
      >
        <ExpansionPanelHeader onClick={this.toggleContent} className={classes.header || ''}>
          {header}
        </ExpansionPanelHeader>
        {isExpanded && (
          <ExpansionPanelContent className={classes.content || ''}>
            {content}
          </ExpansionPanelContent>
        )}
      </div>
    );
  }
}
