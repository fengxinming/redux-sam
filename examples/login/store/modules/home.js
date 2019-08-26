import sleep from 'celia/sleep';

export default {
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++;
    }
  },
  actions: {
    async increment({ commit }) {
      await sleep(1000);
      commit('increment');
      commit('increment');
    }
  }
};
