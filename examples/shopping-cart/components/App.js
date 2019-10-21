import React, { PureComponent } from 'react';
import ProductList from './ProductList.js'
import ShoppingCart from './ShoppingCart.js'

class App extends PureComponent {
  render() {
    return (
      <div id="app" style={{ margin: '20px' }}>
        <h1>Shopping Cart Example</h1>
        <hr />
        <h2>Products</h2>
        <ProductList />
        <hr />
        <ShoppingCart />
      </div>
    );
  }
}

export default App;
