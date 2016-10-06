import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import styles from './Map.css'

const MapSearch = React.createClass({
  propTypes: {
    map: PropTypes.object.isRequired,
    onSearch: PropTypes.func,
    bounds: PropTypes.object,
    types: PropTypes.array,
    size: PropTypes.number
  },

  getDefaultProps: function() {
    return {
      bounds: null,
      types: ['establishment'],
      size: 50
    }
  },

  getInitialState: function() {
    return { value: '' };
  },

  componentDidMount: function() {this.loadGoogleSearch();},
  componentDidUpdate: function() {this.loadGoogleSearch();},
  componentWillUnmount: function() {

  },

  loadGoogleSearch: function() {
    window._gapiInst.load(google => {

      let opts = {
        types: this.props.types
      };

      const node = ReactDOM.findDOMNode(this.refs.input);
      let autocomplete =
            new google.maps.places.Autocomplete(node, opts);

      if (this.props.bounds) {
        autocomplete.setBounds(this.props.bounds);
      } else {
        autocomplete.bindTo('bounds', this.props.map);
      }

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        this.setState({
          place: place,
          value: place.name
        })
      })

      this.autocomplete = autocomplete;
    });
  },

  handleChange: function(e) {
    e.preventDefault();

    this.setState({
      value: e.target.value
    });
  },

  onSubmit: function(e) {
    e.preventDefault();

    const val = this.state.place || this.state.value;

    console.log('val: ', val);

    if (this.props.onSearch) {
      this.props.onSearch(val);
    }
  },

  render: function() {
    return (
      <div>
        <form className={styles.search}
              onSubmit={this.onSubmit}>

          <input type='string'
                 placeholder='Find a location'
                 size={this.props.size}
                 value={this.state.value}
                 ref='input'
                 onChange={this.handleChange} />

        </form>
      </div>
    )
  }
})

export default MapSearch
