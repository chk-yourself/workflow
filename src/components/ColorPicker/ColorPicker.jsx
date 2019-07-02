import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Radio, RadioGroup } from '../Radio';
import { withOutsideClick } from '../withOutsideClick';
import './ColorPicker.scss';

class ColorPicker extends Component {
  static defaultProps = {
    classes: {
      colorPicker: ''
    },
    selected: 'default',
    isActive: false,
    style: {},
    selectColor: () => null,
    colors: [
      'default',
      'red',
      'pink',
      'grape',
      'violet',
      'indigo',
      'blue',
      'cyan',
      'teal',
      'green',
      'yellow',
      'orange'
    ]
  };

  static propTypes = {
    selectColor: PropTypes.func,
    isActive: PropTypes.bool,
    style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    classes: PropTypes.shape({
      colorPicker: PropTypes.string
    }),
    colors: PropTypes.arrayOf(PropTypes.string),
    selected: PropTypes.string
  };

  state = {
    selectedColor: this.props.selected
  };

  handleColorChange = e => {
    const { selectColor } = this.props;
    this.setState({
      selectedColor: e.target.value
    });
    if (selectColor) {
      selectColor(e.target.value);
    }
  };

  render() {
    const { style, isActive, classes, innerRef, colors } = this.props;
    const { selectedColor } = this.state;
    return (
      <div
        ref={innerRef}
        className={`color-picker ${classes.colorPicker || ''}`}
        style={{ display: isActive ? 'block' : 'none', ...style }}
      >
        {colors.map(color => (
          <Radio
            key={color}
            classes={{
              radio: 'color-picker__radio',
              label: `color-picker__swatch bg--${color}`
            }}
            name="color"
            id={color}
            value={color}
            onChange={this.handleColorChange}
            isChecked={selectedColor === color}
            label={<span className="sr-only">{color}</span>}
            labelProps={{ tabIndex: 0 }}
          />
        ))}
      </div>
    );
  }
}

export default withOutsideClick(ColorPicker);
