
import React, { Component } from 'react'
import News from './News'


export class Navbar extends Component {
constructor(){
  super();
  let valueofsearch=-1;
  this.state={
    valueofsearch:valueofsearch,
valueofsearch2:"",
topic:'Cricket'

}

}


render() {
  let {togle,check}=this.props;
  console.log(togle,check)
  let sea=document.getElementById('Search')
  let input=document.getElementById('input1')
  function bluring(e){
if(e.key==='Enter'){
  sea.click()
}
   
  }
  


  return (
    
      <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme='dark'>
  <div className="container-fluid">
    <a className="navbar-brand" href="/">Navbar</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="/navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
        <a className='nav-link' href="/">Home</a>
        </li>
        <li className="nav-item">
        <a className='nav-link' href="/">About</a>
        </li> 
      </ul>
      <div className="form-check form-switch" >
  <input className="form-check-input" type="checkbox" onClick={()=>{
     togle()
  }}  role="switch" id="flexSwitchCheckDefault" />
  <label className="form-check-label" htmlFor="flexSwitchCheckDefault" style={{color:'white'}}>Enable Darkmode</label>
</div>

        <input className="form-control mx-3" style={{'width':'13rem'}}type="search" id='input1' onKeyPress={bluring} placeholder="Search" onChange= {(e)=> { this.setState({valueofsearch:e.target.value})}} aria-label="Search"/>
        <button className="btn btn-outline-success w-10" id="Search" onClick={()=> {
          console.log(this.state.valueofsearch); 
      input.value=""

          this.setState({valueofsearch2: this.state.valueofsearch,topic:(this.state.valueofsearch)[0].toUpperCase()+this.state.valueofsearch.slice(1,this.state.valueofsearch.size)})
         
      }
      }>Search</button>
     
    </div>
  </div>
</nav>
{console.log(this.state.valueofsearch,"hdh")}

<News want={this.state.valueofsearch2===""?'cricket':this.state.valueofsearch2} checked={check} topic={this.state.topic}/>


      </>
    )
  }
}

export default Navbar