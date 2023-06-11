import React, { PureComponent } from 'react'
import './Spining.css'

export default class Spinner extends PureComponent {


  render() {
    return (
        <>
      <div className='spining' id='spining'>
        <div className="spinner "></div>
        <div className="spinner "></div>
        <div className="spinner "></div>
        <div className="spinner "></div>
        <div className="spinner "></div>
        <div className="spinner "></div>
        
      </div> 
      <span className='load'>Loading....</span>
        </>
    )
  }
}
