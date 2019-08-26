import { createStore } from '../../redux-sam';
import { Component } from 'react';
import createLogger from '../../redux-sam/logger';
import cart from './modules/cart'
import products from './modules/products'

const { store } = createStore({
  modules: {
    cart,
    products
  },
  plugins: [process.env.NODE_ENV !== 'production' && createLogger()]
}, Component);

export { store };
