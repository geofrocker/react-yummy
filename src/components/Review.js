import React, { Component } from 'react';
import Since from 'react-since';
import  url, { http } from './config'

const Reviews = props =>
<div className="col-sm-12">
    <blockquote>
        <p>{props.content}.</p>
        <footer>By {props.author} about <cite title="Time"><Since date={ props.create_date }/></cite></footer>
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
            placeholder:false
        };
        
    }
    componentDidMount(){
        const {history} = this.props;
        if(!localStorage.getItem('isLoggedIn')){
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
            console.log(response.data)
            this.setState({
                reviews: response.data.Review_list,
                placeholder:false
            })

        })
        .catch((xhr)=>{
            this.setState({
                placeholder: true
            })
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
            console.log(response.data)
            let reviews = this.state.reviews;
            reviews.push(response.data.review)
            this.setState({
                placeholder:false,
                recipeData:response.data.Recipe,
                message:response.data.message,
                color:'alert alert-success',
                reviews:reviews,  
            })
           
            this.refs.content.value='';
        })
        .catch((xhr) => {
            this.setState({
                color:'alert alert-danger',
            })
        });
    }
    render(){
        const {placeholder, reviews, message, recipeData, color}=this.state

        let loadReviews;
        if (placeholder) {
            loadReviews = 
            <div>
                <p>This recipe has no reviews yet</p><br/>
            </div>
           
        }else {
            loadReviews =
            <div>
                {reviews.map(inf =>
                <Reviews key={inf.review_id} {...inf}/>
                )}
            </div>
        }
        return (
            <div className="Review">
                {this.state.message
                    ? <div className={color}>{message}</div>
                    : <div></div> 
                }
                <div className="jumbotron">
                    <h3>{recipeData.title}<a href="/" className="btn btn-primary pull-right">Go back</a></h3>
                    <em>Added by <span className="fa fa-user"></span> { recipeData.author} about <span className="fa fa-calendar"></span> <Since date={ recipeData.create_date } /></em>
                    <hr/>
                    <div>
                        <h3>Ingredients</h3>
                        <small>{recipeData.ingredients}</small>
                        <h3>Steps</h3>
                        <small>{recipeData.steps}</small><br/><br/>
                        <div className="btn-group">
                            <button type="button" onClick={() => this.upVote(recipeData.recipe_id)} className="btn btn-primary btn-xs">UpVote</button>
                            <button type="button" className="btn btn-default btn-xs"><span className="fa fa-thumbs-o-up"></span> Upvotes:{recipeData.upvotes}</button>
                            <button type="button" className="btn btn-default btn-xs"><span className="fa fa-comment-o"></span> Reviews:{recipeData.reviews}</button>
                        </div>
                    </div>
                </div>
                <div className="jumbotron review">
                    <p>Reviews</p>
                    {loadReviews}
                    <form onSubmit={this.review} id="review-form">
                            <div className="form-group">
                                <textarea className="form-control" placeholder="Enter your Review!" id="content" ref="content" onChange={this.handleContentChange} required/>
                            </div>
                            <div className="form-group">
                                <input type="submit" className="btn btn-primary pull-right" value="Add Review"></input>
                            </div>
                            <br/>
                    </form>
                </div>
            </div>

        );
        
    }
}

export default Review