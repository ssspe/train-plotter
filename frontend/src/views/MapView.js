import React, { Component } from 'react';
import '../styles/App.css';
import Select from 'react-select';
import MapContainer from "../components/MapContainer.js";

class MapView extends Component {
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
    let interval = setInterval(this.getTrainInfo, 5000);
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
    this.setState({ selectedOption: selectedOption });
  }

  render() {
    return(
      <div>
        { this.state.data ?
          <Select
            onChange={ this.handleChange }
            options={ this.state.data }
          /> : null }
        { this.state.trainInfo ?
          <MapContainer trainInfo={ this.state.trainInfo }/> : null }
      </div>
      );
  }
}

export default MapView;
