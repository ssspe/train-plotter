// import React, { Component } from 'react';
// import ReactMapboxGl, { GeoJSONLayer, Layer, Feature, Marker, Popup } from "react-mapbox-gl";
// import Tooltip from '@material-ui/core/Tooltip';
// import _ from 'lodash';
//
//
//
//
// const dateFormat = require('dateformat');
// const Map = ReactMapboxGl({
//   accessToken: "pk.eyJ1Ijoic3NzcGUiLCJhIjoiY2pxcDNkZWluMDFoazN4dGd6bTY3bnA1ayJ9.9vYYYBBh2scR2shTbCUHFg"
// })
// const linePaint: MapboxGL.LinePaint = {
//   'line-color': 'blue',
//   'line-width': 2
// };
//
// class AllMapContainer extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//         data : null,
//         trainInfo: null
//     };
//     this.renderLayer = this.renderLayer.bind(this)
//   }
//
//   componentDidMount() {
//     this.setState({trainInfo: this.props.trainInfo})
//   }
//
//   componentWillReceiveProps(nextProps) {
//     if (nextProps.trainInfo) {
//       this.setState({trainInfo: nextProps.trainInfo})
//     }
//   }
//
//   getCoordinates = (location, callback) => {
//     const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
//     const baseClient = mbxGeocoding({ accessToken: "pk.eyJ1Ijoic3NzcGUiLCJhIjoiY2pxcDNkZWluMDFoazN4dGd6bTY3bnA1ayJ9.9vYYYBBh2scR2shTbCUHFg" });
//     baseClient.forwardGeocode({
//         query: location,
//         countries: ['gb'],
//         limit: 100
//     })
//     .send()
//     .then(function (response)  {
//         if (response && response.body && response.body.features && response.body.features.length) {
//             var feature = response.body.features[0];
//             response.body.features.forEach(feature => {
//               if (feature.place_name.includes("Railway") || feature.place_name.includes("Underground") || feature.place_name.includes("Overground")) {
//                 callback(feature.geometry.coordinates);
//               }
//             })
//           }
//     });
//   }
//
//   handleTooltipOpen = () => {
//     console.log(this.state.open);
//     this.setState({ open: !this.state.open });
//   };
//
//   renderLayer(item) {
//     // this.getCoordinates(nextProps.trainInfo.current_journey, coord => {
//     //   this.setState({first_coord: coord});
//     // });
//     console.log(item);
//     this.getCoordinates(item.current_journey, first_coord => {
//       this.getCoordinates(item.second_journey, second_coord => {
//         if (first_coord && second_coord) {
//           return(
//               <Marker
//                 coordinates={ [first_coord[0], first_coord[1]] }
//                 onClick={ () => { console.log("Clicked"); } }>
//                 <img height="20" width="20" src={ require("../static/images/map-marker.png") } />
//               </Marker>
//               );
//           }
//       });
//     });
//
//   }
//
//   render() {
//     let markers = [];
//     if (this.state.trainInfo) {
//       this.state.trainInfo.map((item) => {
//         const MarkerClass = this.renderLayer(item);
//         markers.push(<MarkerClass />);
//       })
//
//
//
//
//       return(
//         <Map
//           style="mapbox://styles/mapbox/streets-v9"
//           containerStyle={ {
//             height: "100vh",
//             width: "100vw",
//             'text-align': "left" } }>
//           {markers}
//         </Map>
//       );
//     }
//     else {
//       return(null);
//     }
//   }
// }
//
// export default AllMapContainer;




import React, { Component } from 'react';
import MapboxMap, { Marker, GeoJSONLayer } from 'react-mapbox-wrapper';
import _ from 'lodash';
import Icon from '../static/images/map-marker.png';

class AllMapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data : null,
        trainInfo: null,
        ready: false
    };
    this.onMapLoad = this.onMapLoad.bind(this);
  }

  componentDidMount() {
    this.setState({trainInfo: this.props.trainInfo})
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.trainInfo) {
      this.setState({trainInfo: nextProps.trainInfo})
    }
  }

  onMapLoad(map) {
    this.map = map;
    this.forceUpdate();
  }

  render() {

    console.log("Im going to render ");
    let secondMarkers;
    if (this.map) {

      // firstMarkers = this.state.trainInfo.map((trainInfo) => {
      //   return(
      //     <Marker
      //       coordinates={trainInfo.current_journey}
      //       map={this.map}
      //       popup={trainInfo.arrival_time}
      //       popupOnOver
      //       popupOffset={20} />
      //   );
      // });

      var width = 64; // The image will be 64 pixels square
      var bytesPerPixel = 4; // Each pixel is represented by 4 bytes: red, green, blue, and alpha.
      var data = new Uint8Array(width * width * bytesPerPixel);

      for (var x = 0; x < width; x++) {
          for (var y = 0; y < width; y++) {
              var offset = (y * width + x) * bytesPerPixel;
              data[offset + 0] = y / width * 255; // red
              data[offset + 1] = x / width * 255; // green
              data[offset + 2] = 128;             // blue
              data[offset + 3] = 255;             // alpha
          }
      }
      var map = this.map;
      var allTrainInfo = this.state.trainInfo;
      map.loadImage(Icon, function(error, image) {

        map.addImage('gradient', image);
        allTrainInfo.map((trainInfo) => {
          if (map.getLayer("routeFirstMarkers" + trainInfo.train_descriptor)) {
            map.removeLayer("routeFirstMarkers" + trainInfo.train_descriptor);
          }

          if (map.getSource("sourceFirstMarkers" + trainInfo.train_descriptor)){
            map.removeSource("sourceFirstMarkers" + trainInfo.train_descriptor);
          }

          if (!map.getSource("sourceFirstMarkers" + trainInfo.train_descriptor)){
            map.addSource("sourceFirstMarkers" + trainInfo.train_descriptor, {
              "type": "geojson",
              "data": {
                  "type": "Feature",
                  "properties": {
                          "title": "Mapbox DC"
                      },
                  "geometry": {
                      "type": "Point",
                      "coordinates": trainInfo.current_journey
                  }
              }
            });
          }

          if (!map.getLayer("routeFirstMarkers" + trainInfo.train_descriptor)){
            map.addLayer({
              "id": "routeFirstMarkers" + trainInfo.train_descriptor,
              "type": "symbol",
              "source": "sourceFirstMarkers" + trainInfo.train_descriptor,
              "layout": {
                  "icon-image": "gradient",
                  "icon-size": 0.08,
                  "text-field": "{title}",
                  "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                  "text-offset": [0, 0.6],
                  "text-anchor": "top"
              },
            });
          }
        });

        allTrainInfo.map((trainInfo) => {
          if (map.getLayer("routeSecondMarkers" + trainInfo.train_descriptor)) {
            map.removeLayer("routeSecondMarkers" + trainInfo.train_descriptor);
          }

          if (map.getSource("sourceSecondMarkers" + trainInfo.train_descriptor)){
            map.removeSource("sourceSecondMarkers" + trainInfo.train_descriptor);
          }

          if (!map.getSource("sourceSecondMarkers" + trainInfo.train_descriptor)){
            map.addSource("sourceSecondMarkers" + trainInfo.train_descriptor, {
              "type": "geojson",
              "data": {
                  "type": "Feature",
                  "properties": {
                          "title": "Mapbox DC"
                      },
                  "geometry": {
                      "type": "Point",
                      "coordinates": trainInfo.second_journey
                  }
              }
            });
          }

          if (!map.getLayer("routeSecondMarkers" + trainInfo.train_descriptor)){
            map.addLayer({
              "id": "routeSecondMarkers" + trainInfo.train_descriptor,
              "type": "symbol",
              "source": "sourceSecondMarkers" + trainInfo.train_descriptor,
              "layout": {
                  "icon-image": "gradient",
                  "icon-size": 0.08,
                  "text-field": "{title}",
                  "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                  "text-offset": [0, 0.6],
                  "text-anchor": "top"
              },
            });
          }
        });
      });



      // secondMarkers = this.state.trainInfo.map((trainInfo) => {
      //   console.log(trainInfo.second_journey)
      //   return(
      //     <Marker coordinates={trainInfo.second_journey} map={this.map}>
      //       <span role="img" aria-label="Emoji Marker" style={{ fontSize: '30px' }}>
      //         🏠
      //       </span>
      //     </Marker>
      //   );
      // });

      this.state.trainInfo.map((trainInfo) => {
        if (this.map.getLayer("route" + trainInfo.train_descriptor)) {
          this.map.removeLayer("route" + trainInfo.train_descriptor);
        }

        if (this.map.getSource("source" + trainInfo.train_descriptor)){
          this.map.removeSource("source" + trainInfo.train_descriptor);
        }

        if (!this.map.getSource("source" + trainInfo.train_descriptor)){
          this.map.addSource("source" + trainInfo.train_descriptor, {
            "type": "geojson",
            "data": {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        trainInfo.current_journey,
                        trainInfo.second_journey
                    ]
                }
            }
          });
        }

        if (!this.map.getLayer("route" + trainInfo.train_descriptor)){
          this.map.addLayer({
            "id": "route" + trainInfo.train_descriptor,
            "type": "line",
            "source": "source" + trainInfo.train_descriptor,
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": "#888",
                "line-width": 8
            }
          });
        }
      });
    }

    return (
      <div style={{
        height: "100vh",
        width: "100vw",
        'text-align': "left" }}>
        <MapboxMap
            accessToken="pk.eyJ1Ijoic3NzcGUiLCJhIjoiY2pxcDNkZWluMDFoazN4dGd6bTY3bnA1ayJ9.9vYYYBBh2scR2shTbCUHFg"
            coordinates={{ lat: 48.872198, lng: 2.3366308 }}
            className="map-container"
            onLoad={this.onMapLoad} >
        </MapboxMap>
      </div>
    );
  }
}

export default AllMapContainer;
