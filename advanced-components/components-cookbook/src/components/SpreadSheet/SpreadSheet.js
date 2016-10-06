import React, {PropTypes} from 'react';

import styles from './SpreadSheet.css';

const SpreadSheetCell = React.createClass({
  propTypes: {
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func
  },

  getInitialState: function() {
    return {
      currentValue: this.props.value,
      initialValue: this.props.value,
    };
  },

  handleChange: function(e) {
    const val = e.target.value;
    if (val !== this.state.currentValue) {
      this.setState({
        currentValue: val,
      });
    }
  },

  handleBlur: function(e) {
    if (this.state.currentValue !== this.state.initialValue) {
      const title = this.props.title;
      const currentValue = this.state.currentValue;

      this.setState({
        currentValue: currentValue,
        initialValue: currentValue
      });
      this.props.onUpdate(title, currentValue);
    }
  },

  shouldComponentUpdate: function(newProps, newState) {
    return newProps.value !== this.props.value ||
      newProps.title !== this.props.title ||
      newState.currentValue !== this.state.currentValue;
  },

  render: function() {
    return (
      <td>
        <input
           type='string'
           onChange={this.handleChange}
           onBlur={this.handleBlur}
           value={this.state.currentValue} />
      </td>
    )
  }
});

const SpreadSheetRow = React.createClass({
  propTypes: {
    idx: PropTypes.number.isRequired,
    rowData: PropTypes.object.isRequired,
    columnNames: PropTypes.array.isRequired,
    onUpdate: PropTypes.func
  },

  shouldComponentUpdate: function(newProps, newState) {
    return newProps.rowData !== this.props.rowData;
  },

  handleUpdate: function(key, value) {
    let newData = Object.assign({}, this.props.rowData, {[key]: value});
    this.props.onUpdate(this.props.idx, newData);
  },

  renderCells: function() {
    return this.props.columnNames
      .map((key, idx) => (
        <SpreadSheetCell key={key}
                         idx={idx}
                         onUpdate={this.handleUpdate}
                         title={key}
                         value={this.props.rowData[key]} />
      ));
  },

  render: function() {
    const klasses = [styles.row];
    return (
      <tr className={klasses}>
        {this.renderCells()}
      </tr>
    )
  }
});

const SpreadSheetHeaderRow = props => (
  <tr>
    {props.columnNames.map(key => (
      <th key={key}>{key}</th>
    ))}
  </tr>
)

// const SpreadSheetHeaderRow = React.createClass({
//   propTypes: {
//     columnNames: PropTypes.array
//   },

//   render: function() {
//     return (
//       <tr>
//         {this.props.columnNames
//         .map((key, idx) => (<th key={key}>{key}</th>))}
//       </tr>
//     )
//   }
// })

const SpreadSheet = React.createClass({
  propTypes: {
    data: PropTypes.array.isRequired,
    columnNames: PropTypes.array
  },

  getInitialState: function() {
    const first = this.props.data ? this.props.data[0] : {};
    const columnNames =
            this.props.columnNames || Object.keys(first);
    return {
      columnNames: columnNames,
      data: this.props.data
    }
  },

  onUpdate: function(idx, row) {
    let newData = this.state.data;
    newData[idx] = row;
    this.setState({
      data: newData
    })
  },

  render: function() {
    const dataArr = this.state.data;
    const columnNames = this.state.columnNames;
    return (
      <div className={styles.container}>
        <table className={styles.spreadsheet}>
          <thead>
            <SpreadSheetHeaderRow
               columnNames={columnNames} />
          </thead>
          <tbody>
            {dataArr.map((o, idx) => {
              return (<SpreadSheetRow
                           idx={idx}
                           key={idx}
                           onUpdate={this.onUpdate}
                           columnNames={columnNames}
                           rowData={o} />)
            })}
      </tbody>
        </table>
        </div>
    )
  }
});

export default SpreadSheet
