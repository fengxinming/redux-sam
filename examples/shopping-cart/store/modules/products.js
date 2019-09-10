import shop from '../../api/shop'

// initial state
const state = {
  all: [],
  allChanged: 0
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
      // state.all = state.all.slice(0);
      state.allChanged++;
    }
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
