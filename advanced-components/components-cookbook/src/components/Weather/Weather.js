import React, { PropTypes } from 'react';
import $ from 'jquery';

import styles from './Weather.css';
import {WeatherFetcher} from 'util/WeatherFetcher';

const Weather = React.createClass({
  propTypes: {
    storageKey: PropTypes.string,
    secondsToCache: PropTypes.number,
    city: PropTypes.string
  },
  getDefaultProps: function() {
    return {
      city: 'San Francisco, CA',
      storageKey: 'cachedWeather',
      secondsToCache: 10
    };
  },
  getInitialState: function() {
    return {
      currentWeather: localStorage.getItem(this.props.storageKey),
      refreshing: false,
      needsUpdate: true
    };
  },
  componentWillMount: function() {
    this.weatherFetcher = new WeatherFetcher();

    this.setState({
      needsUpdate: this.contentNeedsRefresh()
    });
  },
  componentDidMount: function() {
    if (this.state.needsUpdate) {
      this.refreshWeather();
    }
  },
  contentNeedsRefresh: function() {
    const json = this.getCached();
    if (!(json && json.currentWeather)) {
      return true;
    }
    const lastCheckedAt = json.checkedAt;
    const sinceChecked = Math.round((Date.now() - lastCheckedAt)/1000);
    return (this.props.secondsToCache - sinceChecked) < 0;
  },
  getCached: function() {
    const str = localStorage.getItem(this.props.storageKey);
    if (!str) {
      return {};
    };
    try {
      return JSON.parse(str);
    } catch (err) {
      console.log('An error has occurred', err);
      return {};
    }
  },
  refreshWeather: function() {
    // Some callback
    const that = this;
    const storageKey = this.props.storageKey;
    const secondsToCache = this.props.secondsToCache;
    const weatherFetcher = this.weatherFetcher;
    const city = this.props.city;

    this.setState({
      refreshing: true
    }, function afterSetState() {
      weatherFetcher.getLatestForecast(city)
        .then(function(data) {
          localStorage.setItem(storageKey, JSON.stringify({
            checkedAt: Date.now(),
            weather: data
          }));
          that.setState({
            refreshing: false,
            needsUpdate: false,
            currentWeather: data.list
          }, that.setUpdateTimeout);
        })
        .catch(function(err) {
          console.log('An error has occurred', err);
        });
    });
  },
  setUpdateTimeout: function() {
    var that = this;
    const secondsToCache = this.props.secondsToCache;
    const city = this.props.city;

    setTimeout(function() {
      that.setState({
        needsUpdate: true
      });
    }, secondsToCache * 1000);
  },
  componentDidMount: function() {
    if (this.state.needsUpdate) {
      this.refreshWeather(this.props.city);
    }
  },
  renderNeedsUpdate: function() {
    return (
      <div className={styles.needsUpdate}>
        <button onClick={this.refreshWeather}>
          Update weather
        </button>
      </div>
    );
  },
  renderCurrentWeather: function() {
    // Should handle in a component
    const currentWeather = this.state.currentWeather;
    if (!currentWeather) {
      return (<div>No weather yet</div>)
    }
    const latestWeather = currentWeather[0];
    const desc = latestWeather.weather && latestWeather.weather[0];
    return (
      <div>
        <span>Latest weather projection</span>
        <div>{desc && desc.description}</div>
      </div>
    );
  },
  render: function() {
    const needsUpdate = this.state.needsUpdate;
    const refreshing = this.state.refreshing;
    const currentWeather = this.state.currentWeather;

    if (refreshing) {
      return (<div>Refreshing...</div>)
    }

    return (
      <div>
        {needsUpdate && this.renderNeedsUpdate()}
        {currentWeather && this.renderCurrentWeather()}
      </div>
    );
  }
});

module.exports = Weather;
