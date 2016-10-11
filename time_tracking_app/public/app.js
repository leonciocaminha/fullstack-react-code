const TimersDashboard = React.createClass({
  EditableTimerList: function () {
    return(
    )
  }

  render: function () {
    return(
      <div className="ui three column centered grid">
        <div className="column">
          <EditableTimerList />
          <ToggleahleTimerForm isOpen={true}>
        </div>
      </div>
    )
  }
})
