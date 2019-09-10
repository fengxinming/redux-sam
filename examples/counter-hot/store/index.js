import { createStore } from 'redux-sam';
import { Component } from 'react';
import createLogger from 'redux-sam/logger';
import * as actions from './actions'
import * as mutations from './mutations'

const state = {
  count: 0,
  history: []
}

const { store } = createStore({
  state,
  actions,
  mutations,
  plugins: [process.env.NODE_ENV !== 'production' && createLogger()]
}, Component);

if (module.hot) {
  module.hot.accept([
    './actions',
    './mutations'
  ], () => {
    store.hotUpdate({
      actions: require('./actions'),
      mutations: require('./mutations')
    })
  })
}

export { store };
