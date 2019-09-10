import React, { Component } from 'react';
import { currency } from '../currency';
import { connect } from 'react-redux';

class ProductList extends Component {
  constructor(props) {
    super(props);

    this.$mapActions(['addProductToCart'], 'cart');
  }

  componentDidMount() {
    this.$sam.dispatch('products/getAllProducts');
  }

  render() {
    return (
      <ul>
        {
          this.props.products.map(product => (
            <li key={product.id}>
              {product.title} - {currency(product.price)}
              <br />
              <button
                disabled={!product.inventory}
                onClick={() => this.addProductToCart(product)}>
                Add to cart
              </button>
            </li>
          ))
        }
      </ul>
    );
  }
}

export default connect(state => ({
  products: state.products.all,
  productsChanged: state.products.allChanged
}))(ProductList);
