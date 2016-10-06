import React, { PropTypes } from 'react';

const CREDITCARD = 'Creditcard';
const BTC = 'Bitcoin';

const Switch = React.createClass({
  getInitialState() {
    return {
      payMethod: BTC
    };
  },

  render() {
    return (
      <div className="switch">
        <div className="choice">Creditcard</div>
        <div className="choice">Bitcoin</div>
        Pay with: {this.state.payMethod}
      </div>
    )
  }
});

module.exports = Switch;
