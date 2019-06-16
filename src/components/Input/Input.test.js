import React from 'react';
import renderer from 'react-test-renderer';
import Input from './Input';

describe('Input Component', () => {
  it('renders correctly', () => {
    const component = renderer.create(<Input />).toJSON();
    expect(component).toMatchSnapshot();
  });
});
