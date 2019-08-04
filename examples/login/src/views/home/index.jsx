import './index.styl';
import React, { Component } from 'react';
import logo from './logo.svg';

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

  click = () => {
    const { state } = this;
    state.key.key1.key11 = Math.random();
    this.setState(this.state);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <button onClick={this.click}>点击按钮</button>
          <div>{this.state.key.key1.key11}</div>
          <div>{this.state.key.key2.key22}</div>
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

export default App;
