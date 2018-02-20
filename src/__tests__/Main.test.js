import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import Main from '../components/main';

describe('App component', () => {
  const wrapper = shallow(<Main />);

  it('renders two div jsx elements', () => {
    wrapper.setState({ username: true });
    expect(wrapper.find('div')).toHaveLength(2);
  });

  it('renders Router', () => {
    expect(wrapper.find('Nav')).toHaveLength(1);
    expect(wrapper.find('Switch')).toHaveLength(1);
    expect(wrapper.find('Route')).toHaveLength(10);
  });
});

