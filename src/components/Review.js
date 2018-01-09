import React, { Component } from 'react';
import Since from 'react-since';
import  url, { http } from './config'

const Reviews = props =>
<div className="col-sm-12">
    <blockquote>
        <p>{props.content}.</p>
        <footer>By {props.created_by} about <cite title="Time"><Since date={ props.create_date }/></cite></footer>
    </blockquote>
</div>;
    
class Review extends Component {
    constructor(props){
        super(props)
        let recipe_id = this.props.match.params.recipe_id;
        this.state = {
            recipe_id:recipe_id,
            recipeData:[],
            message:'',
            color:'alert alert-danger',
            content:'',
            reviews:[],
            placeholder:''
        };
        
    }
    componentDidMount(){
        const {history} = this.props;
        if(!sessionStorage.getItem('isLoggedIn')){
            history.push('/login')
        }
        return http.get(`${url+this.state.recipe_id}`)
        .then((response) =>{
            if(response.data.Recipe_Item){
                this.setState({recipeData: response.data.Recipe_Item})
            }
        })
        .catch(xhr => {
            console.log(xhr)
        });  


    }

    componentWillMount(){
        return http.get(`${url}recipe/review/${this.state.recipe_id}`)
        .then((response) =>{
            console.log(response.data.Review_list)
            this.setState({reviews: response.data.Review_list})
        })
        .catch((xhr)=>{
            this.setState({placeholder: xhr.response.data.message})
        })
    }
    handleContentChange= (event) =>{
        this.setState({content: event.target.value})
    }

    upVote = (id) =>{
        return http.get(`${url}recipe/upvote/${this.state.recipe_id}`)
        .then((response)=>{
            let recipeData = this.state.recipeData;
            recipeData.upvotes = recipeData.upvotes +1
            this.setState({
                recipeData:recipeData,
                color:'alert alert-success',
                message:response.data.message,
                
            });
        })
        .catch(
            (xhr) => {
                this.setState({
                    color:'alert alert-danger',
                    message:xhr.response.data.message
                });
            }
        );
    };

    review = (e) =>{
        e.preventDefault();
        let postData = {
            content: this.state.content
        }
        return http.post(`${url}recipe/review/${this.state.recipe_id}`, postData)
        .then((response) => {
            let reviews = this.state.reviews;
            reviews.push(response.data.review)
            this.setState({
                message:response.data.message,
                reviews:reviews
            })
            this.refs.content.value=null;
        })
        .catch((xhr) => {
            this.setState({message:xhr.response.data.message})
        });
    }
    render(){
        let loadReviews;
        if (!this.state.reviews) {
            loadReviews = 
            <div>
                <b>{this.state.placeholder}</b><br/>
            </div>
           
        }else {
            loadReviews =
            <div>
                {this.state.reviews.map(inf =>
                <Reviews key={inf.review_id} {...inf}/>
                )}
            </div>
        }
        return (
            <div className="Review">
                {this.state.message
                    ? <div className={this.state.color}>{this.state.message}</div>
                    : <div></div> 
                }
                <div className="jumbotron">
                    <h3>{this.state.recipeData.title}</h3>
                    <em>Added by <span className="fa fa-user"></span> { this.state.recipeData.created_by } about <span className="fa fa-calendar"></span> <Since date={ this.state.recipeData.create_date } /></em>
                    <hr/>
                    <div>
                        <h3>Ingredients</h3>
                        <small>{this.state.recipeData.ingredients}</small>
                        <h3>Steps</h3>
                        <small>{this.state.recipeData.steps}</small><br/><br/>
                        <div className="btn-group">
                            <button type="button" onClick={() => this.upVote(this.state.recipeData.recipe_id)} className="btn btn-primary btn-xs">UpVote</button>
                            <button type="button" className="btn btn-default btn-xs"><span className="fa fa-thumbs-o-up"></span> Upvotes:{this.state.recipeData.upvotes}</button>
                        </div>
                    </div>
                </div>
                <div className="jumbotron review">
                <b>Reviews</b>
                    {loadReviews}
                    <form onSubmit={this.review}>
                            <div className="form-group">
                                <textarea className="form-control" placeholder="Enter your Review!" ref="content" onChange={this.handleContentChange} required/>
                            </div>
                            <input type="submit" className="btn btn-primary pull-right" value="Review"/>
                        
                    </form>
                </div>
            </div>

        );
        
    }
}

export default Review