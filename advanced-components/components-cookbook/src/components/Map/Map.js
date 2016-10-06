import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import GoogleApi from 'util/GoogleApi'

import styles from './Map.css'

window._gapiInst = new GoogleApi({
  apiKey: __GOOGLE_API_KEY__,
  libraries: ['places']
});

const Map = React.createClass({
  propTypes: {
    lat: PropTypes.number,
    lng: PropTypes.number,
    zoom: PropTypes.number,
    place: PropTypes.object,
    markers: PropTypes.array
  },

  getDefaultProps: function() {
    return {
      lat: 37.773972,
      lng: -122.431297,
      zoom: 10,
      markers: [
        {lat: 37.773972, lng: -122.431297, title: 'San Francisco'},
        {lat: 37.8719, lng: -122.2585, title: 'Berkeley, CA'}
      ]
    }
  },

  getInitialState: function() {
    return {
      map: null,
      loading: true
    }
  },

  componentDidMount: function() {
    this.loadGoogleMap();
  },

  componentDidUpdate: function(prevProps) {
    if (this.props.lat !== prevProps.lat || this.props.lng !== prevProps.lng) {
      this.setState({
        map: null
      }, this.loadGoogleMap)
    }
  },

  loadGoogleMap: function() {
    if (this.state.map) { return; }
    window._gapiInst.load(google => {
      const maps = google.maps;

      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);
      let center = new maps.LatLng(this.props.lat, this.props.lng)

      this.map = new google.maps.Map(node, {
        center: center,
        zoom: this.props.zoom
      });

      // Load markers
      this.props.markers.map(o => {
        const {lat, lng, title} = o;
        if (lat && lng) {
          let pos = new maps.LatLng(lat, lng);
          let marker = new maps.Marker({
            position: pos,
            title: title
          });

          marker.setMap(this.map);
        }
      });

      this.setState({
        map: this.map,
        loading: false
      })
    });
  },

  renderLoading: function() {
    if (!this.state.loading) { return null; }
    return (<i className="fa fa-spinner fa-spin"></i>)
  },


  render: function() {
    return (
      <div className={styles.mapContainer}>
        {this.renderLoading()}
        <div className={styles.map} ref='map'></div>
      </div>
    )
  }
})

export default Map
