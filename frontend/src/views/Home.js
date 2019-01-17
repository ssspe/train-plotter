import React, { Component } from 'react';
import '../styles/App.css';
import { Link } from 'react-router-dom';

class Home extends Component {

  render() {
    return (
      <div className="App">
        <Link to='/MapView'  />
      </div>
    );
  }
}

export default Home;
