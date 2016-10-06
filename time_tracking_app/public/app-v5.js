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
  // Inside TimersDashboard
  handleEditFormSubmit: function (attrs) {
    this.updateTimer(attrs);
  },
  // leanpub-start-insert
  handleTrashClick: function (timerId) {
    this.deleteTimer(timerId);
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
  // Inside TimersDashboard
  // leanpub-start-insert
  deleteTimer: function (timerId) {
    this.setState({
      timers: this.state.timers.filter(t => t.id !== timerId),
    });
  },
  // leanpub-end-insert
  render: function () {
    return (
      <div className='ui three column centered grid'>
        <div className='column'>
          {/* Inside TimersDashboard.render() */}
          <EditableTimerList
            timers={this.state.timers}
            onFormSubmit={this.handleEditFormSubmit}
            // leanpub-start-insert
            onTrashClick={this.handleTrashClick}
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
    // Inside EditableTimerList.render()
    const timers = this.props.timers.map((timer) => (
      <EditableTimer
        key={timer.id}
        id={timer.id}
        title={timer.title}
        project={timer.project}
        elapsed={timer.elapsed}
        runningSince={timer.runningSince}
        onFormSubmit={this.props.onFormSubmit}
        // leanpub-start-insert
        onTrashClick={this.props.onTrashClick}
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
          // leanpub-start-insert
          onTrashClick={this.props.onTrashClick}
          // leanpub-end-insert
        />
      );
    }
  },
});

const Timer = React.createClass({
  // leanpub-start-insert
  handleTrashClick: function () {
    this.props.onTrashClick(this.props.id);
  },
  // leanpub-end-insert
  render: function () {
    // ...
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
          {/* Inside Timer.render() */}
          <div className='extra content'>
            <span
              className='right floated edit icon'
              onClick={this.props.onEditClick}
            >
              <i className='edit icon'></i>
            </span>
            {/* leanpub-start-insert */}
            <span
              className='right floated trash icon'
              onClick={this.handleTrashClick}
            >
            {/* leanpub-end-insert */}
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
