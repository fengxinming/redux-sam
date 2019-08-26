import shop from '../../api/shop'

// initial state
const state = {
  all: []
}

// actions
const actions = {
  getAllProducts({ commit }) {
    shop.getProducts(products => {
      commit('setProducts', products)
    })
  }
}

// mutations
const mutations = {
  setProducts(state, products) {
    state.all = products
  },

  decrementProductInventory(state, { id }) {
    const product = state.all.find(product => product.id === id);
    product.inventory--;
    if (!product.inventory) {
      state.all = state.all.slice(0);
    }
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
