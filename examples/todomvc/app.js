import './index.css';
import 'todomvc-app-css/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { store } from './store';

ReactDOM.render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('root'));

serviceWorker.unregister();
