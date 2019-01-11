import React, { Component } from 'react';
import logo from './static/images/logo.svg';
import './styles/App.css';
import Select from 'react-select';
import MapContainer from "./components/MapContainer.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data : null,
        trainInfo: null,
        selectedOption: null
    };
  }

  componentDidMount() {
    this.getDataFromDb();
    let interval = setInterval(this.getTrainInfo, 10000);
  }

  getDataFromDb = () => {
    var url = "/api/listOfTrains";
    fetch(url)
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }))
  };

  getTrainInfo = () => {
    if (this.state.selectedOption) {
      var url = "/api/trainInfo?train_id=" + this.state.selectedOption.value;
      fetch(url)
        .then(data => data.json())
        .then(res => this.setState({ trainInfo: res.data }))
    }
  }

  handleChange = (selectedOption) => {
    this.getTrainInfo(selectedOption);
    this.setState({selectedOption: selectedOption});
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          { this.state.data ?
          <Select
            className="train-selection"
            name="color"
            onChange={this.handleChange}
            options={this.state.data}
          /> : null }
          <MapContainer trainInfo={ this.state.trainInfo }/>
        </header>
      </div>
    );
  }
}

export default App;
