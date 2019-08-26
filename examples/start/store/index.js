import { createStore } from '../../redux-sam';
import { Component } from 'react';
import mutations from './mutations';
import actions from './actions';

const { store } = createStore({
  state: {
    count: 0
  },
  mutations,
  actions
}, Component);

export { store };
