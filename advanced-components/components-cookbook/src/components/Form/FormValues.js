import React, {PropTypes, Children} from 'react';

const FormValues = React.createClass({
  propTypes: {
    initialData: PropTypes.object.isRequired,
    onSubmit: PropTypes.func,
    children: PropTypes.element.isRequired
  },
  getInitialState: function() {
    return {
      data: this.props.initialData
    }
  },
  onSubmit: function(data) {
    this.setState({
      data: data
    })
  },
  renderChildren: function() {
    const that = this;
    return Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        onSubmit: this.onSubmit,
        initialData: this.state.data
      })
    })
  },
  render: function() {
    return (
      <div>
        {this.renderChildren()}
        <pre><code>{JSON.stringify(this.state.data, null, '  ')}</code></pre>
      </div>
    )
  }
})

export default FormValues;
