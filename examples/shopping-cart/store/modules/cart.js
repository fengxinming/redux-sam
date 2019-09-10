import shop from '../../api/shop'

// initial state
// shape: [{ id, quantity }]
const state = {
  items: [],
  itemsChanged: 0,
  checkoutStatus: null
}

// actions
const actions = {
  checkout({ commit, state }, products) {
    // const savedCartItems = [...state.items]
    const savedCartItems = state.items
    commit('setCheckoutStatus', null)
    // empty cart
    commit('setCartItems', { items: [] })
    shop.buyProducts(
      products,
      () => commit('setCheckoutStatus', 'successful'),
      () => {
        commit('setCheckoutStatus', 'failed')
        // rollback to the cart saved before sending the request
        commit('setCartItems', { items: savedCartItems, itemsChanged: state.itemsChanged++ })
      }
    )
  },

  addProductToCart({ state, commit }, product) {
    commit('setCheckoutStatus', null)
    if (product.inventory > 0) {
      const cartItem = state.items.find(item => item.id === product.id)
      if (!cartItem) {
        commit('pushProductToCart', { id: product.id })
      } else {
        commit('incrementItemQuantity', cartItem)
      }
      // remove 1 item from stock
      commit('products/decrementProductInventory', { id: product.id }, { root: true })
    }
  }
}

// mutations
const mutations = {
  pushProductToCart(state, { id }) {
    state.items.push({
      id,
      quantity: 1
    })
  },

  incrementItemQuantity(state, { id }) {
    const cartItem = state.items.find(item => item.id === id)
    cartItem.quantity++
  },

  setCartItems(state, { items, itemsChanged }) {
    state.items = items
    state.itemsChanged = itemsChanged
  },

  setCheckoutStatus(state, status) {
    state.checkoutStatus = status
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
