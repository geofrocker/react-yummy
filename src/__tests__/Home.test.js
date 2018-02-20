import 'jsdom-global/register';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import Home from '../components/home';
import toJson from 'enzyme-to-json';

describe('the home component', () => {
    const props = {
        history: {
            push: () => {}
        },
    }
    const state={data:[{recipe_id:1,title:'lorem'}]}
    const getRecipes = ()=>Promise.resolve()
    const wrapper = mount(<Home {...props} getRecipes={getRecipes}/>);
    wrapper.setState({data:[{recipe_id:1,title:'lorem'}]})

    it('renders the Home class', () => {
        expect(wrapper.find(".Home")).toHaveLength(1);
    });
    it('renders the jumbotron class', () => {
        expect(wrapper.find(".col-xs-12")).toHaveLength(2);
    });
    it('renders nine div jsx elements', () => {
        expect(wrapper.find("div")).toHaveLength(9);        
    });
    it('renders search bar', () => {
      expect(wrapper.find("#search").simulate('change'));           
    });
    it('renders pagination', () =>{
        expect(wrapper.find(".pagination")).toHaveLength(1);
        expect(wrapper.find(".page-link")).toHaveLength(3);
    });

    it('renders search bar', () => {
        expect(wrapper.find("#review").simulate('click'));  
        expect(wrapper.find("#prev").simulate('click'));
        expect(wrapper.find("#next").simulate('click'));               
    });

    it('renders div when no recipes', () => {
        wrapper.setState({showMessage:true})
        expect(wrapper.find("div")).toHaveLength(10);         
      });


})
