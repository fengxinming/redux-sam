export const incrementIfOdd = ({ commit, state }) => {
  if ((state.count + 1) % 2 === 0) {
    commit('increment');
  }
}

export const incrementAsync = ({ commit }) => {
  setTimeout(() => {
    commit('increment');
  }, 1000);
}
