export default {
  increment({ commit }) {
    setTimeout(() => {
      commit('increment');
    }, 1000);
  }
};
