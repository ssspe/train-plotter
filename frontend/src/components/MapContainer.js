import React, { Component } from 'react';
import ReactMapboxGl, { GeoJSONLayer, Layer, Feature, Marker } from "react-mapbox-gl";
import Icon from "../static/images/map-marker.png";
const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1Ijoic3NzcGUiLCJhIjoiY2pxcDNkZWluMDFoazN4dGd6bTY3bnA1ayJ9.9vYYYBBh2scR2shTbCUHFg"
})

const linePaint: MapboxGL.LinePaint = {
  'line-color': 'blue',
  'line-width': 2
};

class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data : null,
        trainInfo: null,
        first_coord: null,
        second_coord: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.trainInfo) {
      this.getCoordinates(nextProps.trainInfo.current_journey, coord => {
        this.setState({first_coord: coord});
      });
      this.getCoordinates(nextProps.trainInfo.second_journey, coord => {
        this.setState({second_coord: coord});
      });
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

  render() {
    const image = new Image(20, 20);
    image.src = Icon;
    const firstImages = ["firstImage", image];
    const secondImages = ["secondImage", image];
    return(
      <Map
        style="mapbox://styles/mapbox/streets-v9"
        containerStyle={{
          height: "100vh",
          width: "100vw",
          'text-align': "left",
        }}>
          {this.state.first_coord ?
            <Marker
                coordinates={[this.state.first_coord[0], this.state.first_coord[1]]}
                onClick={() => {
                  console.log("Clicked");
                }}
              >
                <img height="20" width="20" src={require("../static/images/map-marker.png")}/>
              </Marker> : null }
          {this.state.second_coord ?
            <Marker
                coordinates={[this.state.second_coord[0], this.state.second_coord[1]]}
                onClick={() => {
                  console.log("Clicked");
                }}
              >
                <img height="20" width="20" src={require("../static/images/map-marker.png")}/>
              </Marker> : null }
          {this.state.first_coord && this.state.second_coord ?
          <GeoJSONLayer
             data={{
               'type': 'FeatureCollection',
               'features': [
                 {
                   'type': 'Feature',
                   'geometry': {
                     'type': 'LineString',
                     'coordinates': [
                       [this.state.first_coord[0], this.state.first_coord[1]],
                       [this.state.second_coord[0], this.state.second_coord[1]]
                     ]
                   }
                 }
               ]
             }}
             linePaint={linePaint}
           /> : null }

      </Map>
    );
  }
}

export default MapContainer;
