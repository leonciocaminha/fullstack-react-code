import React from 'react'

const SimpleInput = React.createClass({
  render: function() {
    return (
      <div>
        <p>Please enter your secret password:</p>
        <input ref='myPassword' type='password' />
      </div>
    );     
  }
})

export default SimpleInput
