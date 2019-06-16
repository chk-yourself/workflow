import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import DatePicker from './DatePicker';

describe('Date Picker Component', () => {
  it('renders correctly', () => {
    const component = renderer.create(<DatePicker />).toJSON();
    expect(component).toMatchSnapshot();
  });

  it('renders correctly with default currentMonth value', () => {
    const component = mount(<DatePicker />);
    expect(component.prop('currentMonth').toEqual(new Date().getMonth()));
  });
});
