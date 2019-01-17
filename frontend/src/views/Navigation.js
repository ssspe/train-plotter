import '../styles/App.css';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navigation extends Component {
  render() {
    return(
      <div className='navbar__header'>
        <Link to='/MapView' >MapView</Link>
        <Link to='/AllMapView' >AllMapView</Link>
      </div>
    );
  }
}
