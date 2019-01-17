import React, { Component } from 'react';
import MapboxMap, { Marker } from 'react-mapbox-wrapper';

export default class MapWithMovingMarker extends Component {
  constructor(props) {
    super(props);
    this.onMapLoad = this.onMapLoad.bind(this);
  }

  onMapLoad(map) {
    this.map = map;
    this.forceUpdate();
  }

  render() {
    let markers;
    const { coordinateArray } = this.props;
    if (coordinateArray) {
      if (this.map) {
        markers = coordinateArray.map((coordinates) => {
          console.log(coordinates.current_journey[0]);
          console.log(coordinates.current_journey[1]);
          return(
            <Marker
              coordinates={{ lng: coordinates.current_journey[0], lat: coordinates.current_journey[1] }}
              map={this.map} />
          );
        })
      }

      return (
        <div style={{
          height: "100vh",
          width: "100vw",
          'text-align': "left" }}>
        <MapboxMap
          accessToken={"pk.eyJ1Ijoic3NzcGUiLCJhIjoiY2pxcDNkZWluMDFoazN4dGd6bTY3bnA1ayJ9.9vYYYBBh2scR2shTbCUHFg"}
          coordinates={{ lat: 51.5074, lng: 0.1278 }}
          className="map-container"
          onLoad={this.onMapLoad}
        >
          {markers}
        </MapboxMap>
        </div>
      );
    } else {
      return null;
    }
  }
}
