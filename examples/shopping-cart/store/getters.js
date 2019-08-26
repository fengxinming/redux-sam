
export function cartProducts(items, products) {
  return items.map(({ id, quantity }) => {
    const product = products.find(product => product.id === id)
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      quantity
    };
  })
}

export function cartTotalPrice(products) {
  return products.reduce((total, product) => {
    return total + product.price * product.quantity
  }, 0)
}
