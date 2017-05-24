import React from 'react';
import {Link} from 'react-router';

import Footer from './Footer';
import Header from './Header';
import {getInitialProducts} from '../Actions/index';

console.log("in app.jsx");


class App extends React.Component{
  constructor(props){
    super(props);
  }
  
  render(){
  console.log("in app.jsx render method");
    return (
    <div style={{position:'relative',height:'auto !important',height:'100%'}}>
    <div><Header/></div>
		<div className='well'>{this.props.children}</div>
    <div><Footer/></div>
	</div>
    );
  }
}

export default App;
