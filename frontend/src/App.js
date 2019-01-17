import React, { Component } from 'react';
import logo from './static/images/logo.svg';
import './styles/App.css';
import Select from 'react-select';
import MapContainer from "./components/MapContainer.js";
import AllMapContainer from "./components/AllMapContainer.js";
import Router from './routes/index.js';
import Navigation from './views/Navigation.js';

class App extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //       data : null,
  //       trainInfo: null,
  //       allTrainInfo: null,
  //       selectedOption: null,
  //       coordinates: [{ lat: 51.5074, lng: 0.1278 }, { lat: 51.5084, lng: 0.1278 }]
  //   };
  // }
  //
  // componentDidMount() {
  //   this.getDataFromDb();
  //   let interval = setInterval(this.getTrainInfo, 5000);
  //   let interval_all = setInterval(this.getAllTrainInfo, 5000);
  // }
  //
  // getDataFromDb = () => {
  //   var url = "/api/listOfTrains";
  //   fetch(url)
  //     .then(data => data.json())
  //     .then(res => this.setState({ data: res.data }))
  // };
  //
  // getTrainInfo = () => {
  //   if (this.state.selectedOption) {
  //     var url = "/api/trainInfo?train_id=" + this.state.selectedOption.value;
  //     fetch(url)
  //       .then(data => data.json())
  //       .then(res => this.setState({ trainInfo: res.data }))
  //   }
  // }
  //
  // getAllTrainInfo = () => {
  //   var url = "/api/allTrainInfo";
  //   fetch(url)
  //     .then(data => data.json())
  //     .then(res => this.setState({ allTrainInfo: res.data }))
  // }
  //
  // handleChange = (selectedOption) => {
  //   this.getTrainInfo(selectedOption);
  //   this.setState({selectedOption: selectedOption});
  // }

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
