import React, { Component } from 'react';
import logo from './static/images/logo.svg';
import './styles/App.css';
import Select from 'react-select';
import MapContainer from "./components/MapContainer.js";
import AllMapContainer from "./components/AllMapContainer.js";
import Router from './routes/index.js';
import Navigation from './views/Navigation.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navigation />
        <Router />
      </div>
    );
  }
}

export default App;
