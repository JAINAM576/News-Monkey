import React, { Component } from 'react'
import Navbar from './Navbar.js'
import News from './News.js'
// 05c82e15f8a244f5b0871d91f612bf88
export default class App extends Component {
constructor(){
  super();
  this.state={
    check:'white'
  }
}
  toggle=()=>{
    if(this.state.check==='white'){
      document.body.style.backgroundColor='rgba(0, 0, 0, 0.9)'
      this.setState({check:'black'})
    }else{
      document.body.style.backgroundColor='white'
      this.setState({check:'white'})

    }
console.log('toggled')
  }
  render() {

 
    return (
      <div >
      <Navbar togle={this.toggle} check={this.state.check}/>
      
      </div>
      )
  }
}
