import React, { Component } from 'react';
import MapboxMap, { Marker, GeoJSONLayer, Helpers } from 'react-mapbox-wrapper';
import _ from 'lodash';
import Icon from '../static/images/map-marker.png';

class AllMapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data : null,
        trainInfo: null,
    };
    this.onMapLoad = this.onMapLoad.bind(this);
  }

  onMapLoad(map) {
    this.map = map;
    this.forceUpdate();
  }

  render() {
    let secondMarkers;
    let firstMarkers;
    const { trainInfo } = this.props;
    if (this.map) {
      firstMarkers = trainInfo.map((trainInfo) => {
        var d = new Date(0)
        d.setUTCSeconds(trainInfo.arrival_time / 1000)
        return(
          <Marker
            coordinates={{ lng: trainInfo.current_journey[0], lat: trainInfo.current_journey[1] }}
            map={this.map}
            popup={d.toLocaleString("en-UK")}
            popupOnOver
            popupOffset={20} />
        );
      });

      secondMarkers = trainInfo.map((trainInfo) => {
        return(
          <Marker
            coordinates={{ lng: trainInfo.second_journey[0], lat: trainInfo.second_journey[1] }}
            map={this.map}
            popup="Second"
            popupOnOver
            popupOffset={20} />
        );
      });

      var paint = { 'fill-color': 'blue' }
      trainInfo.map((trainInfo) => {
        Helpers.removeGeoJSON(this.map, trainInfo.train_descriptor);
        Helpers.drawGeoJSON(
          this.map,
          trainInfo.train_descriptor,
          {
              type: 'Feature',
              geometry: {
                  type: 'LineString',
                  coordinates: [
                      trainInfo.current_journey,
                      trainInfo.second_journey
                  ],
              },
          },
          paint, () => {console.log("DONE")});
        });
    }

    return (
      <div style={{
        height: "100vh",
        width: "100vw",
        'text-align': "left" }}>
        <MapboxMap
            accessToken="pk.eyJ1Ijoic3NzcGUiLCJhIjoiY2pxcDNkZWluMDFoazN4dGd6bTY3bnA1ayJ9.9vYYYBBh2scR2shTbCUHFg"
            coordinates={{ lat: 51.5074, lng: 0.1278 }}
            className="map-container"
            onLoad={this.onMapLoad} >
            {firstMarkers}
            {secondMarkers}
        </MapboxMap>
      </div>
    );
  }
}

export default AllMapContainer;
