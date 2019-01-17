import React, { Component } from 'react';
import '../styles/App.css';
import AllMapContainer from "../components/AllMapContainer.js";

class AllMapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
        allTrainInfo: null
    };
  }

  componentDidMount() {
    let interval_all = setInterval(this.getAllTrainInfo, 5000);
  }

  getAllTrainInfo = () => {
    var url = "/api/allTrainInfo";
    fetch(url)
      .then(data => data.json())
      .then(res => this.setState({ allTrainInfo: res.data }))
  }

  render() {
    return(
      this.state.allTrainInfo ?
        <AllMapContainer trainInfo={ this.state.allTrainInfo }/> : null
      );
  }
}

export default AllMapView;
