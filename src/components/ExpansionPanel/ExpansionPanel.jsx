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
    id: null,
    innerRef: null
  };

  state = {
    isExpanded: false
  };

  toggleContent = e => {
    const { onToggle, id } = this.props;
    if (!onToggle) {
      this.setState(prevProps => ({
        isExpanded: !prevProps.isExpanded
      }));
    } else {
      onToggle(e, id);
    }
  };

  render() {
    const {
      classes,
      header,
      children,
      innerRef,
      isExpanded: propsIsExpanded,
      ...rest
    } = this.props;
    const isExpanded =
      propsIsExpanded !== null ? propsIsExpanded : this.state.isExpanded;

    return (
      <section
        className={`expansion-panel ${classes.panel || ''}`}
        aria-expanded={isExpanded}
        ref={innerRef}
        {...rest}
      >
        <ExpansionPanelHeader
          onClick={this.toggleContent}
          className={classes.header || header.className || ''}
        >
          {header.children}
        </ExpansionPanelHeader>
        {isExpanded && (
          <ExpansionPanelContent className={classes.content || ''}>
            {children}
          </ExpansionPanelContent>
        )}
      </section>
    );
  }
}
