import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ExpansionPanelHeader from './ExpansionPanelHeader';
import ExpansionPanelContent from './ExpansionPanelContent';
import * as keys from '../../constants/keys';
import './ExpansionPanel.scss';

export default class ExpansionPanel extends Component {
  static defaultProps = {
    classes: {
      panel: '',
      header: '',
      content: '',
      headerInner: ''
    },
    isExpanded: undefined,
    id: null,
    innerRef: () => null,
    header: null,
    children: null
  };

  static propTypes = {
    isExpanded: PropTypes.bool,
    id: PropTypes.string,
    innerRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    ]),
    classes: PropTypes.shape({
      panel: PropTypes.string,
      content: PropTypes.string,
      header: PropTypes.string,
      headerInner: PropTypes.string
    }),
    header: PropTypes.node,
    children: PropTypes.node
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
        className={`expansion-panel ${isExpanded ? 'is-expanded' : ''} ${classes.panel ||
          ''}`}
        aria-expanded={isExpanded}
        ref={innerRef}
        {...rest}
      >
        <ExpansionPanelHeader
          onKeyDown={this.toggleContent}
          onClick={this.toggleContent}
          classes={{
            header: `${isExpanded ? 'is-expanded' : ''} ${classes.header || ''}`,
            inner: classes.headerInner || ''
          }}
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
