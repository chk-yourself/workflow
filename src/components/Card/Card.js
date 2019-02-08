import React, { Component } from 'react';
import './Card.scss';
import {FeatherIcon} from '../FeatherIcon';

export default class Card extends Component {
  render() {
    return (
      <div className="card" onClick={this.props.onClick}>
        <div className="card__header">
        <button className="card__btn--more-actions" type="button">
          <FeatherIcon name="more-horizontal" />
          </button>
          <div className="card__tags" />
          <h3 className="card__title">{this.props.title}</h3>
        </div>
        <div className="card__footer">
          <div className="card__labels" />
        </div>
      </div>
    );
  }
}
