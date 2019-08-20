import { Component } from 'react';
import { createStore } from '../redux-sam';
import createSamLogger from '../redux-sam/logger';
import home from './modules/home';
import login from './modules/login';

const { store, sam } = createStore({
  modules: {
    home,
    login
  },
  plugins: [process.env.NODE_ENV === 'development' && createSamLogger()]
}, Component);

export { store, sam };
