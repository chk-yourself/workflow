import React, { Component } from 'react';
import { Radio } from '../Radio';
import './ColorPicker.scss';

export default class ColorPicker extends Component {
  state = {
    selectedColor: 'default'
  };

  handleColorChange = e => {
    const { selectColor } = this.props;
    this.setState({
      selectedColor: e.target.value
    });
    selectColor(e.target.value);
  };

  render() {
    const { style } = this.props;
    const { selectedColor } = this.state;
    return (
      <div className="color-picker" style={style}>
        <Radio
          classes={{
            radio: 'color-picker__radio',
            label: 'color-picker__swatch bg--default'
          }}
          name="tagColor"
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
          name="tagColor"
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
          name="tagColor"
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
          name="tagColor"
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
          name="tagColor"
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
          name="tagColor"
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
          name="tagColor"
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
          name="tagColor"
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
          name="tagColor"
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
          name="tagColor"
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
          name="tagColor"
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
          name="tagColor"
          id="colorOrange"
          value="orange"
          onChange={this.handleColorChange}
          isChecked={selectedColor === 'orange'}
        />
      </div>
    );
  }
}
