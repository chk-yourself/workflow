import React, { Component } from 'react';

export default class BoardGrid extends Component {
  render() {
    return <ul className="board-grid">{this.props.children}</ul>;
  }
}
