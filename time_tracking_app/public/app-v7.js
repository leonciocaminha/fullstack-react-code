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
  handleCreateFormSubmit: function (timer) {
    this.createTimer(timer);
  },
  handleEditFormSubmit: function (attrs) {
    this.updateTimer(attrs);
  },
  // Inside TimersDashboard
  handleTrashClick: function (timerId) {
    this.deleteTimer(timerId);
  },
  // leanpub-start-insert
  handleStartClick: function (timerId) {
    this.startTimer(timerId);
  },
  handleStopClick: function (timerId) {
    this.stopTimer(timerId);
  },
  // leanpub-end-insert
  createTimer: function (timer) {
    const t = helpers.newTimer(timer);
    this.setState({
      timers: this.state.timers.concat(t),
    });
  },
  updateTimer: function (attrs) {
    this.setState({
      timers: this.state.timers.map((timer) => {
        if (timer.id === attrs.id) {
          return Object.assign({}, timer, {
            title: attrs.title,
            project: attrs.project,
          });
        } else {
          return timer;
        }
      }),
    });
  },
  deleteTimer: function (timerId) {
    this.setState({
      timers: this.state.timers.filter(t => t.id !== timerId),
    });
  },
  // leanpub-start-insert
  startTimer: function (timerId) {
    const now = Date.now();

    this.setState({
      timers: this.state.timers.map((timer) => {
        if (timer.id === timerId) {
          return Object.assign({}, timer, {
            runningSince: now,
          });
        } else {
          return timer;
        }
      }),
    });
  },
  stopTimer: function (timerId) {
    const now = Date.now();

    this.setState({
      timers: this.state.timers.map((timer) => {
        if (timer.id === timerId) {
          const lastElapsed = now - timer.runningSince;
          return Object.assign({}, timer, {
            elapsed: timer.elapsed + lastElapsed,
            runningSince: null,
          });
        } else {
          return timer;
        }
      }),
    });
  },
  // leanpub-end-insert
  render: function () {
    return (
      <div className='ui three column centered grid'>
        <div className='column'>
          {/* Inside TimerDashboard.render() */}
          <EditableTimerList
            timers={this.state.timers}
            onFormSubmit={this.handleEditFormSubmit}
            onTrashClick={this.handleTrashClick}
            // leanpub-start-insert
            onStartClick={this.handleStartClick}
            onStopClick={this.handleStopClick}
            // leanpub-end-insert
          />
          <ToggleableTimerForm
            onFormSubmit={this.handleCreateFormSubmit}
          />
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
    // Inside EditableTimerList
    const timers = this.props.timers.map((timer) => (
      <EditableTimer
        key={timer.id}
        id={timer.id}
        title={timer.title}
        project={timer.project}
        elapsed={timer.elapsed}
        runningSince={timer.runningSince}
        onFormSubmit={this.props.onFormSubmit}
        onTrashClick={this.props.onTrashClick}
        // leanpub-start-insert
        onStartClick={this.props.onStartClick}
        onStopClick={this.props.onStopClick}
        // leanpub-end-insert
      />
    ));
    return (
      <div id='timers'>
        {timers}
      </div>
    );
  },
});

const EditableTimer = React.createClass({
  getInitialState: function () {
    return {
      editFormOpen: false,
    };
  },
  handleEditClick: function () {
    this.openForm();
  },
  handleFormClose: function () {
    this.closeForm();
  },
  handleSubmit: function (timer) {
    this.props.onFormSubmit(timer);
    this.closeForm();
  },
  closeForm: function () {
    this.setState({ editFormOpen: false });
  },
  openForm: function () {
    this.setState({ editFormOpen: true });
  },
  render: function () {
    if (this.state.editFormOpen) {
      return (
        <TimerForm
          id={this.props.id}
          title={this.props.title}
          project={this.props.project}
          onFormSubmit={this.handleSubmit}
          onFormClose={this.handleFormClose}
        />
      );
      // Inside EditableTimer
    } else {
      return (
        <Timer
          id={this.props.id}
          title={this.props.title}
          project={this.props.project}
          elapsed={this.props.elapsed}
          runningSince={this.props.runningSince}
          onEditClick={this.handleEditClick}
          onTrashClick={this.props.onTrashClick}
          // leanpub-start-insert
          onStartClick={this.props.onStartClick}
          onStopClick={this.props.onStopClick}
          // leanpub-end-insert
        />
      );
    }
  },
});

const Timer = React.createClass({
  componentDidMount: function () {
    this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50);
  },
  // Inside Timer
  componentWillUnmount: function () {
    clearInterval(this.forceUpdateInterval);
  },
  // leanpub-start-insert
  handleStartClick: function () {
    this.props.onStartClick(this.props.id);
  },
  handleStopClick: function () {
    this.props.onStopClick(this.props.id);
  },
  // leanpub-end-insert
  // ...
  handleTrashClick: function () {
    this.props.onTrashClick(this.props.id);
  },
  render: function () {
    const elapsedString = helpers.renderElapsedString(
      this.props.elapsed, this.props.runningSince
    );
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
            <span
              className='right floated edit icon'
              onClick={this.props.onEditClick}
            >
              <i className='edit icon'></i>
            </span>
            <span
              className='right floated trash icon'
              onClick={this.handleTrashClick}
            >
              <i className='trash icon'></i>
            </span>
          </div>
        </div>
        {/* At the bottom of `Timer.render()`` */}
        {/* leanpub-start-insert */}
        <TimerActionButton
          timerIsRunning={!!this.props.runningSince}
          onStartClick={this.handleStartClick}
          onStopClick={this.handleStopClick}
        />
        {/* leanpub-end-insert */}
      </div>
    );
  },
});

const TimerActionButton = React.createClass({
  render: function () {
    if (this.props.timerIsRunning) {
      return (
        <div
          className='ui bottom attached red basic button'
          onClick={this.props.onStopClick}
        >
          Stop
        </div>
      );
    } else {
      return (
        <div
          className='ui bottom attached green basic button'
          onClick={this.props.onStartClick}
        >
          Start
        </div>
      );
    }
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
