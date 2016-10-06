import React, { PropTypes } from 'react'

const Input = React.createClass({
  propTypes: {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    data: PropTypes.object
  },
  render: function() {
    const props = this.props;
    return React.createElement('input', {
      type: props.type,
      name: props.name,
      placeholder: props.placeholder,
      onChange: props.onChange,
      value: props.data[props.name] // If there is a value here
    });
  }
})

export default Input
