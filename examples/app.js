import './global.css';
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

ReactDOM.render((<>
  <h1>Redux Sam Examples</h1>
  <ul>
    <li><a href="start">Start</a></li>
    <li><a href="counter">Counter</a></li>
    <li><a href="counter-hot">Counter with Hot Reload</a></li>
    <li><a href="shopping-cart">Shopping Cart</a></li>
    <li><a href="todomvc">TodoMVC</a></li>
    <li><a href="chat">FluxChat</a></li>
    <li><a href="login">Login</a></li>
  </ul></>), document.getElementById('root'));

serviceWorker.unregister();
