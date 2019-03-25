import React, { Component } from 'react';
import { Radio } from '../Radio';
import { withOutsideClick } from '../withOutsideClick';
import './ColorPicker.scss';

class ColorPicker extends Component {
  static defaultProps = {
    classes: {
      colorPicker: ''
    }
  };

  state = {
    selectedColor: 'default'
  };

  handleColorChange = e => {
    const { selectColor, onChange } = this.props;
    this.setState({
      selectedColor: e.target.value
    });
    if (onChange) {
      onChange(e);
    } else {
      selectColor(e.target.value);
    }
  };

  render() {
    const { style, isActive, classes, innerRef } = this.props;
    const { selectedColor } = this.state;
    return (
      <div ref={innerRef} className={`color-picker ${classes.colorPicker || ''}`} style={{display: isActive ? 'block' : 'none', ...style}}>
        <Radio
          classes={{
            radio: 'color-picker__radio',
            label: 'color-picker__swatch bg--default'
          }}
          name="color"
          id="colorDefault"
          value="default"
          onChange={this.handleColorChange}
          isChecked={selectedColor === 'default'}
        />
        <Radio
          classes={{
            radio: 'color-picker__radio',
            label: 'color-picker__swatch bg--red'
          }}
          name="color"
          id="colorRed"
          value="red"
          onChange={this.handleColorChange}
          isChecked={selectedColor === 'red'}
        />
        <Radio
          classes={{
            radio: 'color-picker__radio',
            label: 'color-picker__swatch bg--pink'
          }}
          name="color"
          id="colorPink"
          value="pink"
          onChange={this.handleColorChange}
          isChecked={selectedColor === 'pink'}
        />
        <Radio
          classes={{
            radio: 'color-picker__radio',
            label: 'color-picker__swatch bg--grape'
          }}
          name="color"
          id="colorGrape"
          value="grape"
          onChange={this.handleColorChange}
          isChecked={selectedColor === 'grape'}
        />
        <Radio
          classes={{
            radio: 'color-picker__radio',
            label: 'color-picker__swatch bg--violet'
          }}
          name="color"
          id="colorViolet"
          value="violet"
          onChange={this.handleColorChange}
          isChecked={selectedColor === 'violet'}
        />
        <Radio
          classes={{
            radio: 'color-picker__radio',
            label: 'color-picker__swatch bg--indigo'
          }}
          name="color"
          id="colorIndigo"
          value="indigo"
          onChange={this.handleColorChange}
          isChecked={selectedColor === 'indigo'}
        />
        <Radio
          classes={{
            radio: 'color-picker__radio',
            label: 'color-picker__swatch bg--blue'
          }}
          name="color"
          id="colorBlue"
          value="blue"
          onChange={this.handleColorChange}
          isChecked={selectedColor === 'blue'}
        />
        <Radio
          classes={{
            radio: 'color-picker__radio',
            label: 'color-picker__swatch bg--cyan'
          }}
          name="color"
          id="colorCyan"
          value="cyan"
          onChange={this.handleColorChange}
          isChecked={selectedColor === 'cyan'}
        />
        <Radio
          classes={{
            radio: 'color-picker__radio',
            label: 'color-picker__swatch bg--teal'
          }}
          name="color"
          id="colorTeal"
          value="teal"
          onChange={this.handleColorChange}
          isChecked={selectedColor === 'teal'}
        />
        <Radio
          classes={{
            radio: 'color-picker__radio',
            label: 'color-picker__swatch bg--green'
          }}
          name="color"
          id="colorGreen"
          value="green"
          onChange={this.handleColorChange}
          isChecked={selectedColor === 'green'}
        />
        <Radio
          classes={{
            radio: 'color-picker__radio',
            label: 'color-picker__swatch bg--yellow'
          }}
          name="color"
          id="colorYellow"
          value="yellow"
          onChange={this.handleColorChange}
          isChecked={selectedColor === 'yellow'}
        />
        <Radio
          classes={{
            radio: 'color-picker__radio',
            label: 'color-picker__swatch bg--orange'
          }}
          name="color"
          id="colorOrange"
          value="orange"
          onChange={this.handleColorChange}
          isChecked={selectedColor === 'orange'}
        />
      </div>
    );
  }
}

export default withOutsideClick(ColorPicker);