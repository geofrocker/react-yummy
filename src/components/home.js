import React, { Component } from 'react'; 
import Since from 'react-since';
import  url, { http } from './config'

/*
Display recipes
*/
const Recipe = props =>
    <div className="jumbotron">
        <h3>{props.title}</h3>
        <em>Added by <span className="fa fa-user"></span> { props.created_by } about <span className="fa fa-calendar"></span> <Since date={ props.create_date } /> | Category: {props.category_rel}
        <a href={'/recipe/' + props.recipe_id} id="review" className="btn btn-primary pull-right">Review</a>
        </em>

        <div>
            <h3>Ingredients</h3>
            <small>{props.ingredients}</small>
            <h3>Steps</h3>
            <small>{props.steps}</small><br/><br/>
            <div className="btn-group" id="btn-group">
                <button type="button" className="btn btn-default btn-xs"><span className="fa fa-comment-o"></span> Reviews:{props.reviews}</button>
                <button type="button" className="btn btn-default btn-xs"><span className="fa fa-thumbs-o-up"></span> Upvotes:{props.upvotes}</button>
            </div>
        </div>
    </div>;

class Home extends Component {
    constructor(){
        super();
        this.state = {
            data:[],
            showMessage:false, 
            q:'', 
            page:1, 
            has_next:false, 
            next_page:'',
            previous_page:'', 
            disablePrevious:'', 
            disableNext:'',
            url: url+'?page=1',
            pages:null
        };
      }
    /*
    Load recipes before the component mounts
    */
    componentDidMount(){
        this.getRecipes()
    }

    getRecipes =()=>{http.get(this.state.url)
        .then((response)=>{
            console.log(response)
            this.setState({
            data: response.data.Recipe_list,
            showMessage:false,
            pages: response.data.total_pages
            });
            console.log(this.state.data)
            if(response.data.previous_page === 'Null'){
                this.setState({
                    disablePrevious: 'page-item disabled',
                    previous_page: ''
                    });
            }else{
                this.setState({
                    previous_page: response.data.previous_page,
                    disablePrevious: 'page-item'
                    });
            }
            if(response.data.next_page === 'Null'){
                this.setState({
                    disableNext: 'page-item disabled',
                    next_page: '',
                    });
            }else{
                this.setState({
                    next_page: response.data.next_page,
                    disableNext: 'page-item'
                    });
            }
        })
        .catch((xhr)=>{
            this.setState({showMessage:true})
        })

    }
    /*
    Handle the link to the next page from pagination
    */
    nextPage() {
        if (this.state.next_page)
            return http.get(this.state.next_page)
        .then((response)=>{
            if(response.data.Recipe_list){
                this.setState({
                data: response.data.Recipe_list,
                showMessage:false,
                page:this.state.next_page[this.state.next_page.length -1]
                });
            }
            if(response.data.previous_page === 'Null'){
                this.setState({
                    disablePrevious: 'page-item disabled',
                    previous_page: ''
                    });
            }else{
                this.setState({
                    previous_page: response.data.previous_page,
                    disablePrevious: 'page-item',
                    
                    });
            }
            if(response.data.next_page === 'Null'){
                this.setState({
                    disableNext: 'page-item disabled',
                    next_page: '',
                    });
            }else{
                this.setState({
                    next_page: response.data.next_page,
                    disableNext: 'page-item'
                    });
            }
            
        })
        .catch(
            (xhr) => {
                console.log(xhr)
            }
        );
    };
    /*
    Handle the link to the previous page from pagination
    */
    previousPage() {
        if(this.state.previous_page)
            return http.get(this.state.previous_page)
        .then((response)=>{
            if(response.data.Recipe_list){
                this.setState({
                    data: response.data.Recipe_list,
                    showMessage:false,
                    page:this.state.previous_page[this.state.previous_page.length -1]
                });
            }
            if(response.data.previous_page === 'Null'){
                this.setState({
                    disablePrevious: 'page-item disabled',
                    previous_page: ''
                    });
            }else{
                this.setState({
                    previous_page: response.data.previous_page,
                    disablePrevious: 'page-item'
                    });
            }
            if(response.data.next_page === 'Null'){
                this.setState({
                    disableNext: 'page-item disabled',
                    next_page: '',
                    });
            }else{
                this.setState({
                    next_page: response.data.next_page,
                    disableNext: 'page-item'
                    });
            }
            
        })
        .catch(
            (error) => {
                console.log(error)
            }
        );
    };
    /*
    Handle the search functionality
    */
    handleSearch = (event) => {
        event.preventDefault();
        this.setState({
            q: event.target.value,
            page:1
        });
        if(this.state.q){
            let localurl = url +'?q='+this.state.q+'&page='+this.state.page
            /*
            Make axios api call
            */
            return http.get(localurl)
            .then((response)=>{
                this.setState({
                    data: response.data.Recipe_list,
                    showMessage:false,
                    pages: response.data.total_pages
                });
                if(response.data.previous_page === 'Null'){
                    this.setState({
                        disablePrevious: 'page-item disabled',
                        previous_page: ''
                        });
                }else{
                    this.setState({
                        previous_page: response.data.previous_page,
                        disablePrevious: 'page-item'
                        });
                }
                if(response.data.next_page === 'Null'){
                    this.setState({
                        disableNext: 'page-item disabled',
                        next_page: '',
                        });
                }else{
                    this.setState({
                        next_page: response.data.next_page,
                        disableNext: 'page-item'
                        });
                }
            })
            .catch((xhr) => {
                this.setState({
                    showMessage:true,
                    data:[]
                });
                }
            );
        } 
    };
    render(){
        const {data, disableNext, disablePrevious, page, pages, showMessage, }=this.state
        let loadPagination;
        if (data[0]) {
            loadPagination =
           <div className="col-xs-11 col-sm-3 pull-right">
                <ul className="pagination">
                    <li className={disablePrevious}>
                    <a className="page-link" id="prev" onClick={() => this.previousPage()}>Previous</a>
                    </li>
                    <li className={disableNext}>
                    <a className="page-link" id="next" onClick={() => this.nextPage()}>Next</a>
                    <a className="page-link">Showing {page} of {pages}</a>
                    </li>
                    
                </ul>
            </div> 
        }
        let loadNavBarContent;
        if (showMessage) {
           loadNavBarContent =
           <div className="Home jumbotron" id="search-bar">
                <h3>No recipes matched your query.</h3>
            </div>
        }
        return (
            <div className="Home">
                <div className="col-xs-12 col-sm-6 pull-right">
                    <div className="input-group mb-2 mb-sm-0">
                        <div className="input-group-addon">Search</div>
                        <input type="text" className="form-control" onChange={this.handleSearch} onKeyUp={this.handleSearch} id="search" placeholder="Enter your search key words here!"/>
                    </div>
                </div>
                <div className="col-xs-12">
                {loadNavBarContent}
                <hr/>
                    {data.map(inf =>
                    <Recipe key={inf.recipe_id} {...inf}/>
                    )}
                </div>
                {loadPagination}
            </div>
    );
    }
}

export default Home