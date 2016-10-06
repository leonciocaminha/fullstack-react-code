/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-undef */
const TimersDashboard = React.createClass({
  getInitialState: function () {
    return {
      timers: [
        {
          title: 'Practice squat',
          project: 'Gym Chores',
          id: uuid.v4(),
          elapsed: 5456099,
          runningSince: Date.now(),
        },
        {
          title: 'Bake squash',
          project: 'Kitchen Chores',
          id: uuid.v4(),
          elapsed: 1273998,
          runningSince: null,
        },
      ],
    };
  },
  // Inside TimersDashboard
  // leanpub-start-insert
  handleCreateFormSubmit: function (timer) {
    this.createTimer(timer);
  },
  createTimer: function (timer) {
    const t = helpers.newTimer(timer);
    this.setState({
      timers: this.state.timers.concat(t),
    });
  },
  // leanpub-end-insert
  render: function () {
    return (
      <div className='ui three column centered grid'>
        <div className='column'>
          <EditableTimerList
            timers={this.state.timers}
          />
          {/* leanpub-start-insert */}
          <ToggleableTimerForm
            onFormSubmit={this.handleCreateFormSubmit}
          />
          {/* leanpub-end-insert */}
        </div>
      </div>
    );
  },
});

const ToggleableTimerForm = React.createClass({
  getInitialState: function () {
    return {
      isOpen: false,
    };
  },
  // Inside ToggleableTimerForm
  handleFormOpen: function () {
    this.setState({ isOpen: true });
  },
  // leanpub-start-insert
  handleFormClose: function () {
    this.setState({ isOpen: false });
  },
  handleFormSubmit: function (timer) {
    this.props.onFormSubmit(timer);
    this.setState({ isOpen: false });
  },
  // leanpub-end-insert
  render: function () {
    if (this.state.isOpen) {
      // leanpub-start-insert
      return (
        <TimerForm
          onFormSubmit={this.handleFormSubmit}
          onFormClose={this.handleFormClose}
        />
      );
      // leanpub-end-insert
    } else {
      return (
        <div className='ui basic content center aligned segment'>
          <button
            className='ui basic button icon'
            onClick={this.handleFormOpen}
          >
            <i className='plus icon'></i>
          </button>
        </div>
      );
    }
  },
});

const EditableTimerList = React.createClass({
  render: function () {
    // leanpub-start-insert
    const timers = this.props.timers.map((timer) => (
      <EditableTimer
        key={timer.id}
        id={timer.id}
        title={timer.title}
        project={timer.project}
        elapsed={timer.elapsed}
        runningSince={timer.runningSince}
      />
    ));
    return (
      <div id='timers'>
        {timers}
      </div>
    );
    // leanpub-end-insert
  },
});

const EditableTimer = React.createClass({
  // leanpub-start-insert
  getInitialState: function () {
    return {
      editFormOpen: false,
    };
  },
  // leanpub-end-insert
  render: function () {
    // leanpub-start-insert
    if (this.state.editFormOpen) {
      // leanpub-end-insert
      return (
        <TimerForm
          // leanpub-start-insert
          id={this.props.id}
          // leanpub-end-insert
          title={this.props.title}
          project={this.props.project}
        />
      );
    } else {
      return (
        <Timer
          // leanpub-start-insert
          id={this.props.id}
          // leanpub-end-insert
          title={this.props.title}
          project={this.props.project}
          elapsed={this.props.elapsed}
          runningSince={this.props.runningSince}
        />
      );
    }
  },
});

const Timer = React.createClass({
  render: function () {
    const elapsedString = helpers.renderElapsedString(this.props.elapsed);
    return (
      <div className='ui centered card'>
        <div className='content'>
          <div className='header'>
            {this.props.title}
          </div>
          <div className='meta'>
            {this.props.project}
          </div>
          <div className='center aligned description'>
            <h2>
              {elapsedString}
            </h2>
          </div>
          <div className='extra content'>
            <span className='right floated edit icon'>
              <i className='edit icon'></i>
            </span>
            <span className='right floated trash icon'>
              <i className='trash icon'></i>
            </span>
          </div>
        </div>
        <div className='ui bottom attached blue basic button'>
          Start
        </div>
      </div>
    );
  },
});

const TimerForm = React.createClass({
  // leanpub-start-insert
  handleSubmit: function () {
    this.props.onFormSubmit({
      id: this.props.id,
      title: this.refs.title.value,
      project: this.refs.project.value,
    });
  },
  // leanpub-end-insert
  render: function () {
    // leanpub-start-insert
    const submitText = this.props.id ? 'Update' : 'Create';
    // leanpub-end-insert
    return (
      <div className='ui centered card'>
        <div className='content'>
          <div className='ui form'>
            <div className='field'>
              <label>Title</label>
              {/* leanpub-start-insert */}
              <input type='text' ref='title'
                defaultValue={this.props.title}
              />
              {/* leanpub-end-insert */}
            </div>
            <div className='field'>
              <label>Project</label>
              {/* leanpub-start-insert */}
              <input type='text' ref='project'
                defaultValue={this.props.project}
              />
              {/* leanpub-end-insert */}
            </div>
            <div className='ui two bottom attached buttons'>
                {/* leanpub-start-insert */}
                <button
                  className='ui basic blue button'
                  onClick={this.handleSubmit}
                >
                  {submitText}
                </button>
                <button
                  className='ui basic red button'
                  onClick={this.props.onFormClose}
                >
                  Cancel
                </button>
                {/* leanpub-end-insert */}
            </div>
          </div>
        </div>
      </div>
    );
  },
});

ReactDOM.render(
  <TimersDashboard />,
  document.getElementById('content')
);
