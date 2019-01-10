import React, { Component } from 'react';
import logo from './static/images/logo.svg';
import './styles/App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data : null
    };
  }

  componentDidMount() {
    this.getDataFromDb();
  }

  getDataFromDb = () => {
    var url = "/api/listOfTrains";
    fetch(url)
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }))
  };

  render() {
    console.log(this.state.data);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>

        </header>
      </div>
    );
  }
}

export default App;
