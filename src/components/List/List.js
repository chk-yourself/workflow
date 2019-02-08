import React, { Component } from 'react';
import './List.scss';
import { CardComposer } from '../Card';

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <section className="list">
        <header className="list__header">
          <h2 className="list__title">{this.props.title}</h2>
        </header>
        <div className="list__content">
        {this.props.children}
        </div>
      </section>
    );
  }
}
