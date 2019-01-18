import React, { Component } from 'react';
import MapboxMap, { Marker, GeoJSONLayer, Helpers } from 'react-mapbox-wrapper';
// import { drawGeoJSON } from 'react-mapbox-wrapper/Helpers';
import _ from 'lodash';
import Icon from '../static/images/map-marker.png';
import Constants from "../constants.js";

class MapContainer extends Component {
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
      var d = new Date(0)
      d.setUTCSeconds(trainInfo.arrival_time / 1000)

      firstMarkers =
        <Marker
          coordinates={ { lng: trainInfo.current_location_coords[0], lat: trainInfo.current_location_coords[1] } }
          map={ this.map }
          popup={ d.toLocaleString("en-UK") }
          popupOnOver
          popupOffset={ 20 } />

      secondMarkers =
        <Marker
          coordinates={ { lng: trainInfo.next_location_coords[0], lat: trainInfo.next_location_coords[1] } }
          map={ this.map }
          popup="Second"
          popupOnOver
          popupOffset={ 20 } />

      var geoJsonData = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            trainInfo.current_location_coords,
            trainInfo.next_location_coords
          ],
        },
      }

      var paint = { 'fill-color': 'blue' }
      Helpers.removeGeoJSON(
        this.map,
        trainInfo.train_descriptor);
      Helpers.drawGeoJSON(
        this.map,
        trainInfo.train_descriptor,
        geoJsonData,
        paint);
    }

    return (
      <div style={ {
        height: "100vh",
        width: "100vw",
        'text-align': "left" } }>
        <MapboxMap
          accessToken={ Constants.MAPBOX_API_TOKEN }
          coordinates={ { lat: 51.5074, lng: 0.1278 } }
          className="map-container"
          onLoad={ this.onMapLoad } >
          { firstMarkers }
          { secondMarkers }
        </MapboxMap>
      </div>
    );
  }
}

export default MapContainer;
