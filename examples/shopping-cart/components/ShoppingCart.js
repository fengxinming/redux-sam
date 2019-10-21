import React, { Component } from 'react';
import { currency } from '../currency';
import { connect } from 'react-redux';
import { cartTotalPrice, cartProducts } from '../store/getters';
import { Button } from 'antd';

class ShoppingCart extends Component {
  constructor(props) {
    super(props);

    this.$mapActions(['addProductToCart'], 'cart');
  }

  checkout(products) {
    this.$sam.dispatch('cart/checkout', products);
  }

  render() {
    const { products, checkoutStatus } = this.props;
    const len = products.length;

    return (
      <div className="cart">
        <h2>Your Cart</h2>
        <p style={{ display: !len ? 'block' : 'none' }}><i>Please add some products to cart.</i></p>
        <ul>
          {products.map(product => (
            <li key={product.id}>
              {product.title} - {currency(product.price)} x {product.quantity}
            </li>
          ))}
        </ul>
        <p>Total: {currency(cartTotalPrice(products))}</p>
        <p><Button type="primary" disabled={!len} onClick={() => this.checkout(products)}>Checkout</Button></p>
        <p style={{ display: checkoutStatus ? 'block' : 'none' }}>Checkout {checkoutStatus}.</p>
      </div>
    );
  }
}

export default connect(state => {
  return {
    products: cartProducts(state.cart.items, state.products.all),
    checkoutStatus: state.cart.checkoutStatus
  };
})(ShoppingCart);
