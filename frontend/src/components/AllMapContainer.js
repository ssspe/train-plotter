import React, { Component } from 'react';
import ReactMapboxGl, { GeoJSONLayer, Layer, Feature, Marker, Popup } from "react-mapbox-gl";
import Tooltip from '@material-ui/core/Tooltip';
import _ from 'lodash';




const dateFormat = require('dateformat');
const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1Ijoic3NzcGUiLCJhIjoiY2pxcDNkZWluMDFoazN4dGd6bTY3bnA1ayJ9.9vYYYBBh2scR2shTbCUHFg"
})
const linePaint: MapboxGL.LinePaint = {
  'line-color': 'blue',
  'line-width': 2
};

class AllMapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data : null,
        trainInfo: null
    };
  }

  componentDidMount() {
    this.setState({trainInfo: this.props.trainInfo})
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.trainInfo) {
      this.setState({trainInfo: nextProps.trainInfo})
    }
  }

  getCoordinates = (location, callback) => {
    const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
    const baseClient = mbxGeocoding({ accessToken: "pk.eyJ1Ijoic3NzcGUiLCJhIjoiY2pxcDNkZWluMDFoazN4dGd6bTY3bnA1ayJ9.9vYYYBBh2scR2shTbCUHFg" });
    baseClient.forwardGeocode({
        query: location,
        countries: ['gb'],
        limit: 100
    })
    .send()
    .then(function (response)  {
        if (response && response.body && response.body.features && response.body.features.length) {
            var feature = response.body.features[0];
            response.body.features.forEach(feature => {
              if (feature.place_name.includes("Railway") || feature.place_name.includes("Underground") || feature.place_name.includes("Overground")) {
                callback(feature.geometry.coordinates);
              }
            })
          }
    });
  }

  handleTooltipOpen = () => {
    console.log(this.state.open);
    this.setState({ open: !this.state.open });
  };

  renderLayer = (item) => {

    this.getCoordinates(item.current_journey, (first_coord) => {
      this.getCoordinates(item.second_journey, (second_coord) => {

        if (first_coord && second_coord) {
          console.log(first_coord, second_coord);
          return(
              <Marker
                coordinates={ [first_coord[0], first_coord[1]] }
                onClick={ () => { console.log("Clicked"); } }>
                <img height="20" width="20" src={ require("../static/images/map-marker.png") } />
              </Marker>
              );
          }
      });
    });

  }

  render() {
    console.log(this.state.trainInfo);
    return(
      <Map
        style="mapbox://styles/mapbox/streets-v9"
        containerStyle={ {
          height: "100vh",
          width: "100vw",
          'text-align': "left" } }>
        { this.state.trainInfo ? _.map(this.state.trainInfo, this.renderLayer) : null }
      </Map>
    );
  }
}

export default AllMapContainer;
