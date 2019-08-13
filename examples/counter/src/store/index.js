import { createStore, applyMiddleware } from 'redux';
import { Sam, reducer, middleware, createHelpers } from '../redux-sam';

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

const sam = new Sam({
  state,
  actions,
  mutations
});

const { mapActions, mapMutations } = createHelpers(sam);

const store = createStore(reducer(sam), sam.state, applyMiddleware(middleware(sam)));

export { store, sam, mapActions, mapMutations };
