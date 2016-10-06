import React, {Children, PropTypes} from 'react';
import styles from './Wizard.css';

const Breadcrumb = React.createClass({
  propTypes: {
    onClick: PropTypes.func.isRequired,
    idx: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired
  },

  onClick: function(e) {
    this.props.onClick(this.props.idx)
  },
  render: function() {
    return (
      <a className={this.props.className}
         onClick={this.onClick}>{this.props.title}</a>
    )
  }
});

const WizardStep = React.createClass({
  propTypes: {
    title: PropTypes.string.isRequired,
    component: PropTypes.func.isRequired,
    validateComplete: PropTypes.func,
  },

  getInitialState: function() {
    return {
      canGoNext: this.isValid(this.props.data)
    }
  },

  componentWillReceiveProps: function(newProps) {
    this.setState({
      canGoNext: this.isValid(newProps.data)
    })
  },

  isValid: function(data) {
    let validateComplete = this.props.validateComplete;
    if (!validateComplete) {
      validateComplete = function() { return true; }
    }
    return validateComplete(data)
  },

  render: function() {
    let Component = this.props.component;
    const compProps = Object.assign({}, this.props, this.state);
    const content = React.createElement(Component, compProps);
    return (
      <div>
        {content}
      </div>
    )
  }
});

const Wizard = React.createClass({
  propTypes: {
    initialIndex: PropTypes.number,
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
    initialData: PropTypes.object
  },

  getDefaultProps: function() {
    return {
      initialIndex: 0,
      initialData: {}
    }
  },

  getInitialState: function() {
    return {
      currentStepIdx: this.props.initialIndex,
      data: this.props.initialData
    }
  },

  onChangeStep: function(idx) {
    if (this.canGoTo(idx)) {
      this.setState({
        currentStepIdx: idx
      });
    }
  },

  onNext: function(e) {
    e.preventDefault();

    let nextIdx = this.state.currentStepIdx + 1;
    if (nextIdx >= this.props.children.length) {
      nextIdx = 0;
    }

    this.setState({
      currentStepIdx: nextIdx
    });
  },

  isActive: function(idx) {
    return idx === this.state.currentStepIdx;
  },

  canGoTo: function(nextIdx) {
    const falsyCount = this.props.children
            .filter((c, idx) => idx <= nextIdx)
            .map(c => (c.props.validateComplete || TrueFn)(this.state.data))
            .filter(c => !c);

    return falsyCount.length == 0;
  },

  renderBreadcrumbs: function() {
    const crumbs = this.props.children.map((c, idx) => {
      return (<Breadcrumb
              key={c.props.title}
              idx={idx}
              className={this.isActive(idx) ? styles.active : ''}
              onClick={this.onChangeStep}
              title={c.props.title} />)
    });
    return (
      <div className={styles.breadcrumbs}>
        {crumbs}
      </div>
    )
  },

  onChangeInput: function(name) {
    const that = this;
    return function(e) {
      let newData = Object.assign({}, that.state.data, {});
      newData[name] = e.target.value;
      that.setState({
        data: newData
      });
    }
  },

  renderContent: function() {
    const content = this.props.children[this.state.currentStepIdx];

    return (
      <div className={styles.container}>
        {React.createElement(WizardStep, {
          key: 'step-' + this.state.currentStepIdx,
          data: this.state.data,
          title: content.props.title,
          component: content.props.component,
          validateComplete: content.props.validateComplete,
          onChangeInput: this.onChangeInput,
          onNext: this.onNext
        })}
      </div>
    )
  },

  render: function() {
    return (
      <div className={styles.container}>
        {this.renderBreadcrumbs()}
        {this.renderContent()}
      </div>
    );
  }
});

Wizard.Step = WizardStep;

export default Wizard;
