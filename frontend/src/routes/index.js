import { Switch, Route } from 'react-router-dom'
import React, { Component } from 'react';
import MapContainer from "../components/MapContainer.js";

class Router extends Component {
  render() {
    return (
      <main>
        <div />
        <Switch>
          <Route exact path='/' render={MapContainer}/>
        </Switch>
      </main> );
    }

}

export default Router
