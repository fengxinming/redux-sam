import React, { Component } from 'react';
import { connect } from 'react-redux';

class Counter extends Component {
  constructor(props) {
    super(props);

    this.$mapActions(['increment', 'decrement', 'incrementIfOdd', 'incrementAsync']);
  }

  render() {
    const evenOrOdd = this.props.count % 2 === 0 ? 'even' : 'odd';
    return (
      <div id="app">
        Clicked: {this.props.count} times, count is {evenOrOdd}.
        <br />
        <button onClick={this.increment}>&nbsp;+&nbsp;</button>&nbsp;
        <button onClick={this.decrement} >&nbsp;-&nbsp;</button>&nbsp;
        <br />
        <button onClick={this.incrementIfOdd} > Increment if odd</button>&nbsp;
        <button onClick={this.incrementAsync} > Increment async</button>&nbsp;
      </div >
    );
  }
}

export default connect((state) => ({ count: state.count }))(Counter);
