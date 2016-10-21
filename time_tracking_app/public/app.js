
const TimerForm = React.createClass({
  render: function () {
    const submitText = this.props.title ? 'Update' : 'Create'

    return(
      <div className="ui centered card">
        <div className="content">
          <div className="ui form">
            <div className="field">
              <label>Title</label>
              <input type="text" defaultValue={ this.props.title } />
            </div>
            <div className="field">
              <label>Project</label>
              <input type="text" defaultValue={ this.props.project } />
            </div>
            <div className="ui two bottom attached buttons">
              <button className="ui basic blue button">
                {submitText}
              </button>
              <button className="ui basic red button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

const EditableTimer = React.createClass({
  render: function () {
    if (this.props.editFormOpen) {
      return(
        <TimerForm
          title   = { this.props.title }
          project = { this.props.project }
        />
    );
    } else {
      return(
        <Timer
          title        = { this.props.title }
          project      = { this.props.project }
          elapsed      = { this.props.elapsed }
          runningSince = { this.props.runningSince }
        />
      )
    }
  }
})

const EditableTimerList = React.createClass({
  render: function () {
    const timers = this.props.timers.map((timer) => (
      <EditableTimer
        key          = { timer.id }
        id           = { timer.id }
        title        = { timer.title }
        project      = { timer.project }
        elapsed      = { timer.elapsed }
        runningSince = { timer.runningSince }
      />
    ));

    return(
      <div id="timers">
        { timers }
      </div>
    )
  }
})

const ToggleableTimerForm = React.createClass({
  render: function () {
    if (this.props.isOpen) {
      return(
        <TimerForm />
      )
    } else {
      return(
        <div className="ui basic content center aligned segment">
          <button className="ui basic button icon">
            <i className="plus icon"></i>
          </button>
        </div>
      )
    }
  }
})

const Timer = React.createClass({
  render: function () {
    const elapsedString = helpers.renderElapsedString(this.props.elapsed);
    return(
      <div className="ui centered card">
        <div className="content">
          <div className="header">
            { this.props.title }
          </div>
          <div className="meta">
            { this.props.project }
          </div>
          <div className="center aligned description">
            <h2>{elapsedString}</h2>
          </div>
          <div className="extra content">
            <span className="right floated edit icon">
              <i className="edit icon"></i>
            </span>
            <span className="right floated trash icon">
              <i className="trash icon"></i>
            </span>
          </div>
        </div>
        <div className="ui bottom attached blue basic button">
          Start
        </div>
      </div>
    )
  }
})

const TimersDashboard = React.createClass({
  getInitialState: function () {
    return {
      timers: [
        {
          title: 'Pratice Squat',
          project: 'Gym Chores',
          id: uuid.v4(),
          elapsed: 5456099,
          runningSince: Date.now()
        },
        {
          title: 'Bake Squash',
          project: 'kitchen Chores',
          id: uuid.v4(),
          elapsed: 1273998,
          runningSince: null
        }
      ]
    }
  },
  render: function () {
    return(
      <div className="ui three column centered grid">
        <div className="column">
          <EditableTimerList
            timers={this.state.timers}
          />
          <ToggleableTimerForm isOpen={true} />
        </div>
      </div>
    )
  }
})

ReactDOM.render(
  <TimersDashboard />,
  document.getElementById('content')
);
