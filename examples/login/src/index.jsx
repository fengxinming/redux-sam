import './index.styl';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './configure-store';
import Router from './router';
import * as serviceWorker from './serviceWorker';

render(
  <Provider store={store}>
    <Router />
  </Provider>,
  document.getElementById('root'));

serviceWorker.unregister();
