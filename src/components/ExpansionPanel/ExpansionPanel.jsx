import React, { Component } from 'react';
import ExpansionPanelHeader from './ExpansionPanelHeader';
import ExpansionPanelContent from './ExpansionPanelContent';
import * as keys from '../../constants/keys';
import './ExpansionPanel.scss';

export default class ExpansionPanel extends Component {
  static defaultProps = {
    classes: {
      panel: '',
      header: '',
      content: ''
    },
    isExpanded: undefined,
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
      this.setState(prevState => ({
        isExpanded: !prevState.isExpanded
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
      propsIsExpanded !== undefined ? propsIsExpanded : this.state.isExpanded;

    return (
      <div
        className={`expansion-panel ${
          isExpanded ? 'is-expanded' : ''
        } ${classes.panel || ''}`}
        aria-expanded={isExpanded}
        ref={innerRef}
        {...rest}
      >
        <ExpansionPanelHeader
          onKeyDown={this.toggleContent}
          onClick={this.toggleContent}
          className={`${isExpanded ? 'is-expanded' : ''} ${classes.header ||
            ''}`}
        >
          {header}
        </ExpansionPanelHeader>
        {isExpanded && (
          <ExpansionPanelContent className={classes.content || ''}>
            {children}
          </ExpansionPanelContent>
        )}
      </div>
    );
  }
}
