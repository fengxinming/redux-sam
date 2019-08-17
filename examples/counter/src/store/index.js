import { createStore } from '../redux-sam';
import { Component } from 'react';
import createLogger from '../redux-sam/logger';

const state = {
  count: 0
}

const mutations = {
  increment(state) {
    state.count++
  },
  decrement(state) {
    state.count--
  }
}

const actions = {
  increment: ({ commit }) => commit('increment'),
  decrement: ({ commit }) => commit('decrement'),
  incrementIfOdd({ commit, state }) {
    if ((state.count + 1) % 2 === 0) {
      commit('increment')
    }
  },
  incrementAsync({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('increment')
        resolve()
      }, 1000)
    })
  }
}

const { store } = createStore({
  state,
  actions,
  mutations,
  plugins: [process.env.NODE_ENV !== 'production' && createLogger()]
}, Component.prototype);

export { store };
