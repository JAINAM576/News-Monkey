import React, { Component } from 'react'
import "./Spining.css"
// https://newsapi.org/v2/everything?q=cricket&apiKey=05c82e15f8a244f5b0871d91f612bf88
export class Newsitem extends Component {

    render() {
        let {title,descrip,imgurl,checking,url}=this.props;
        let style={width:'18rem',border:"2px solid black"};
        if(checking==='black'){
            style={
                width:'18rem',
                color:'white',
                backgroundColor:'rgba(0, 0, 0, 0.9)',
                border:'2px solid white',
                boxShadow:'0px 0px 4px 2px white'
            }
        }
        console.log(checking,'newsitem')
        return (
             <div style={{margin:"10px 0px"}} >
                <div className="card" style={style}>
                    <img src={imgurl} style={{width:'17.8rem',height:'10rem'}}alt="News" className="card-img-top cardhover" />
                        <div className="card-body " style={{width:'17.8rem',height:'17rem'}} >
                            <h5 className="card-title">{title.slice(0,62)}...</h5> 
                            <p className="card-text" > {descrip.length>131?(descrip).slice(0,131):descrip}...</p>
                            <a href={url}  className="btn btn-primary" style={{position:'absolute',bottom:'2px',left:"50%"}}>Go TO Article</a>
                        </div>
                </div>
            </div>
            
        )
    }
}

export default Newsitem
