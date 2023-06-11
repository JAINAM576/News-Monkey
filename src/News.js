import React, { Component } from 'react'
import Newsitem from './Newsitem';
import axios from 'axios';
import Spinner from './Spinner';
import Error from './Error';
export class News extends Component {

  constructor() {
    super();

    this.state = {
      articles: [],
      want:"",
      temp:"",
      done:""
      
    }
    console.log(this.state.want,"igaidg")
 


  }
  
  async componentDidMount  () {
    
    
    this.setState({articles:[]})
    console.log(this.state.want,"kfdhi")
    
    const y = await axios.get(`https://newsapi.org/v2/everything?q=${this.state.want}&apiKey=05c82e15f8a244f5b0871d91f612bf88`);
 
    
    this.setState({ articles: y.data.articles });
    console.log(this.state.articles)
  }
  
  jainam=()=>{
   
    if(this.state.temp!==this.state.want){

setTimeout(() => {
  this.setState({done:this.state.articles.length===0?'done':""})
}, 60000);
      this.componentDidMount()
     this.setState({done:""})
    }
  }

static getDerivedStateFromProps=(props, state) =>{
    console.log(state.want,"statewant")

    return {temp:state.want,want:props.want};
  }


  render() {
    
    this.jainam()
    //     let k=getText()
    // let l;
    //         k.then(
      //           result => l=result,
      //           )
   
// this.jainam()
let {checked,topic}=this.props
let count=18;

console.log(checked,'innews')
  console.log(this.props.want);
    return (
      <div className='my-3 container blur'>
        <h2 className=' text-center my-3' style={{color:checked==='black'?'white':'black'}}>NewsMaster --{topic}</h2>
        <div className="row  ">
        {this.state.articles.length>0 ?  this.state.articles.slice(0,count).map((art)=> 
        {
         
          count-=art.urlToImage!==null?1:0
          console.log(count)
          return art.urlToImage && (<div key={art.url} className="col-md-4"><Newsitem title={art.title} descrip={art.description} imgurl={art.urlToImage} url={art.url} checking={checked}/></div> )
          
          
        }
        )
        :  this.state.done===""?<Spinner/>:<Error/>
      }

        </div>
      </div>
    )
  }
}

export default News
