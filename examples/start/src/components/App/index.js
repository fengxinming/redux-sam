import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from './logo.svg';
import './index.css';

class App extends Component {
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
            <button className="button" onClick={this.onCommit}>commit</button>&nbsp;
            <button className="button" onClick={this.onDispatch}>dispatch</button>
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
