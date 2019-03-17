import React, { Component } from 'react';
import ExpansionPanelHeader from './ExpansionPanelHeader';
import ExpansionPanelContent from './ExpansionPanelContent';
import * as keys from '../../constants/keys';

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
    if (e.type === 'keydown' && e.key !== keys.ENTER) return;
    const { onToggle, id } = this.props;
    if (!onToggle) {
      this.setState(prevProps => ({
        isExpanded: !prevProps.isExpanded
      }));
    } else {
      onToggle(e, id);
    }
  };

  onDragOver = e => {
    e.preventDefault();
    console.log(e.target);
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
        onDragOver={this.onDragOver}
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
