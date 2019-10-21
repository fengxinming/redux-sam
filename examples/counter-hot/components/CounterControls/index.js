import './index.styl';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { recentHistory } from '../../store/getters';
import { Button } from 'antd';

class Counter extends Component {
  constructor(props) {
    super(props);

    this.$mapActions([
      'incrementIfOdd',
      'incrementAsync'
    ]);
    this.$mapMutations([
      'increment',
      'decrement'
    ]);
  }

  render() {
    return (
      <div className="cmp-counter">
        Value: {this.props.count}
        <br />
        <br />
        <Button type="primary" onClick={this.increment}>+</Button>&nbsp;
        <Button type="primary" onClick={this.decrement}>-</Button>&nbsp;
        <Button type="primary" onClick={this.incrementIfOdd}>Increment if odd</Button>&nbsp;
        <Button type="primary" onClick={this.incrementAsync}>Increment async</Button>
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
