import React, { PropTypes } from 'React';
import $ from 'jquery';

export const WeatherFetcher = function() {
  let rootUrl = 'http://api.openweathermap.org/data/2.5';
  let appId = __WEATHER_API_KEY__;
  let defaultCity = 'San Francisco, CA';

  this.getLatestForecast = function(city) {
    city = city || defaultCity;
    return new Promise(function(resolve, reject) {
      return $.ajax({
        url: `${rootUrl}/forecast`,
        method: 'GET',
        dataType: 'json',
        data: {
          q: city,
          appid: appId,
          mode: 'json'
        },
        success: resolve,
        error: reject
      });
    });
  };

  return this;
};
