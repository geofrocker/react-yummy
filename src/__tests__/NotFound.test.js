import React from 'react';
import { shallow } from 'enzyme';
import NotFound from '../components/NotFound';

describe('Not found component', () => {
  const wrapper = shallow(<NotFound />);

  it('renders five div jsx elements', () => {
    expect(wrapper.find('div')).toHaveLength(1);
  });
});

