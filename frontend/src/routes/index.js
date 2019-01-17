import { Switch, Route } from 'react-router-dom'
import React, { Component } from 'react';
import AllMapView from "../views/AllMapView.js";
import MapView from "../views/MapView.js";
import Home from "../views/Home.js";

class Router extends Component {
  render() {
    return (
      <main>
        <div />
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/AllMapView' component={AllMapView}/>
          <Route exact path='/MapView' component={MapView}/>
        </Switch>
      </main>
    );
  }
}

export default Router
