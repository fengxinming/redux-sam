import './index.styl';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from './logo.svg';
import { Button } from 'antd';

class App extends Component {
  onCommit = () => {
    this.$sam.commit('increment');
  }

  onCommit2 = () => {
    this.$store.dispatch('increment');
  }

  onDispatch = () => {
    this.$sam.dispatch('increment');
  }

  onDispatch2 = () => {
    this.$store.dispatchAsync('increment');
  }

  onDispatch3 = () => {
    this.$sam.dispatch('decrement');
  }

  onDispatch4 = () => {
    this.$store.dispatchAsync('decrement');
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div>
            <Button onClick={this.onCommit}>this.$sam.commit( mutation )</Button>&nbsp;&nbsp;
            <Button onClick={this.onCommit2}>this.$store.dispatch( mutation )</Button>
            <br />
            <br />
            <Button type="primary" onClick={this.onDispatch}>this.$sam.dispatch( action )</Button>&nbsp;&nbsp;
            <Button type="primary" onClick={this.onDispatch2}>this.$store.dispatchAsync( action )</Button>
            <br />
            <br />
            <Button onClick={this.onDispatch3}>this.$sam.dispatch( mutation )</Button>&nbsp;&nbsp;
            <Button onClick={this.onDispatch4}>this.$store.dispatchAsync( mutation )</Button>
          </div>
          <p>{this.props.count}</p>
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default connect(state => ({
  count: state.count
}))(App);
