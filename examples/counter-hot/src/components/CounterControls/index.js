import React, { Component } from 'react';
import { connect } from 'react-redux';
import { recentHistory } from '../../store/getters';

class Counter extends Component {
  constructor(props) {
    super(props);

    this.$mapActions([
      'increment',
      'decrement',
      'incrementIfOdd',
      'incrementAsync'
    ]);
  }

  render() {
    return (
      <div>
        Value: {this.props.count}
        <br />
        <button onClick={this.increment}>+</button>
        <button onClick={this.decrement}>-</button>
        <br />
        <button onClick={this.incrementIfOdd}>Increment if odd</button>
        <button onClick={this.incrementAsync}>Increment async</button>
        <div>
          <div>Recent History (last 5 entries): {recentHistory(this.props.history)}</div>
        </div>
      </div>
    );
  }
}

export default connect((state) => ({
  count: state.count,
  history: state.history
}))(Counter);
