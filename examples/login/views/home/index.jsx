import './index.styl';
import React, { Component } from 'react';
import logo from './logo.svg';
import { connect } from 'react-redux';

class App extends Component {
  state = {
    key: {
      key1: {
        key11: 'abc'
      },
      key2: {
        key22: 'askdjflasjdlfjasdkfsadf'
      }
    }
  }

  onCommit = () => {
    this.$sam.commit('increment');
  }

  onDispatch = () => {
    this.$sam.dispatch('increment');
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div>
            <button className="test-button" onClick={this.onCommit}>commit</button>
            <button className="test-button" onClick={this.onDispatch}>dispatch</button>
          </div>
          <div>Count: {this.props.count}</div>
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


export default connect(state => ({ count: state.home.count }))(App);
