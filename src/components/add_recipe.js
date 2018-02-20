import React, { Component } from 'react';
import  url, { http } from './config'

const Categories = props =>
    <option value={props.cat_id}>{props.cat_name}</option>
class AddRecipe extends Component {
    constructor(){
        super()
        this.state = {
            catData:[],
            selectValue: '',
            message:'',
            category:'',
            title:'',
            ingredients:'',
            steps:''
        };  
    }
    handleTitleChange = (event) =>{
        this.setState({
            title: event.target.value
        });
    }

    handleIngredientsChange = (event) =>{
        this.setState({
            ingredients: event.target.value
        });
    }

    handleStepsChange = (event) =>{
        this.setState({
            steps: event.target.value
        });
    }

    handleStatus = (event) => {
        this.setState({
            selectValue: event.target.value
        });
        
    }

    handleCategory = (event) => {
        this.setState({
            category: event.target.value
        });
        
    }
    componentDidMount(){
        const {history} = this.props;
        if(!localStorage.getItem('isLoggedIn')){
            history.push('/login')
        }
        return http.get(`${url}category`)
        .then((response) =>{
            console.log(response.data.Category_list)
            this.setState({
                catData: response.data.Category_list,
            })
        })
        .catch((xhr) =>{
            this.setState({
                message:'Add atleast one category before creating a recipe'
            })   
        });


    }

    addRecipe = (e) =>{
        e.preventDefault();
        const {history} = this.props;
        if(!localStorage.getItem('isLoggedIn')){
            history.push('/login')
        }
        let postData = {
            title: this.state.title,
            category: this.state.category,
            ingredients: this.state.ingredients,
            steps: this.state.steps,
            status: this.state.selectValue
        }
        return http.post(`${url}`, postData)
        .then((response) => {
            history.push('/dashboard?tab=1')
        })
        .catch((xhr) => {
            this.setState ({
                message:xhr.response.data.Message
            })
        });
        
        
    }
    render(){
        const {message, title, catData, ingredients, steps}=this.state
        return (
        <div className="AddRecipe">
            <h1>Add Recipe</h1>
            {message
                ? <div className="alert alert-danger col-sm-8">{message}<a href="/add_category" className="btn btn-info pull-right"> Add Category</a></div>
                : <div></div> 
            }
            <div className="jumbotron col-sm-8">
                <form onSubmit={this.addRecipe} id="recipe-form">
                    <div className="form-group">
                        <input type="text" className="form-control" value={title} onChange={this.handleTitleChange} placeholder="Title" id="title" required/>
                    </div>
                    <div className="form-group">
                        <select className="form-control" onChange={this.handleCategory} id="category">
                        <option disabled selected>Select Category</option>
                            {catData.map(inf =>
                            <Categories key={inf.cat_id}{...inf}/>
                            )}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="Ingredients" id="ingredients" value={ingredients} onChange={this.handleIngredientsChange} required/>
                    </div>
                    <div className="form-group">
                        <textarea className="form-control" placeholder="Add your steps here" id="steps" value={steps} onChange={this.handleStepsChange} required/>
                    </div>
                    <select onChange={this.handleStatus} id="status" required>
                        <option disabled selected>Select status</option>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select> <ess>* required</ess><br/><br/>
                    <input type="submit" className="btn btn-primary" value="Submit"/>&nbsp;
                    <a href="/dashboard?tab=1" className="btn btn-success">Cancel</a>
                </form>
            </div>
            
        </div>
        );
    }
}

export default AddRecipe