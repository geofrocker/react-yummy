import 'jsdom-global/register';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Login from '../components/login';

describe('login component', () => {
    const wrapper = mount(<Login/>);
    const preventDefault = jest.fn();
    it('renders the Login class', () => {   
        expect(wrapper.find(".Login")).toHaveLength(1);
    });

    it('renders five div jsx elements', () => {
        expect(wrapper.find("div")).toHaveLength(5);        
    });
    it('renders the sign in form and submit data', () =>{
        wrapper.setState({email:'geofrocker2@gmail.com', password:"psalms"});
        wrapper.find("#login-form").simulate('submit', {preventDefault});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(preventDefault).toBeCalled();
    });

    it('render the two inputs and hides password', () =>{
        expect(wrapper.find("#password")).toHaveLength(1);
        expect(wrapper.find("#username")).toHaveLength(1);
        wrapper.find("#password").simulate('change', {target: {value: 'psalms'}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('make sure the username is valid', () =>{
        wrapper.find("#username").simulate('change', {target: {value: 'geofrocker@gmail.com'}});
        expect(toJson(wrapper)).toMatchSnapshot();
    })
})
