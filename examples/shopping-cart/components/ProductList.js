import React, { Component } from 'react';
import { currency } from '../currency';
import { connect } from 'react-redux';
import { Button } from 'antd';

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
            <li key={product.id} style={{ lineHeight: '40px' }}>
              <label style={{ display: 'inline-block', width: '300px' }}>{product.title} - {currency(product.price)}</label>
              <Button
                type="primary"
                disabled={!product.inventory}
                onClick={() => this.addProductToCart(product)}>
                Add to cart
              </Button>
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
