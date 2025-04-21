async function fetchProducts() {
    const res = await fetch('http://localhost:4000/api/products');
    const {products} = await res.json();
    const container = document.getElementById('products');
    products.forEach(p => {
      const div = document.createElement('div');
      div.className = 'product';
      div.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <h4>${p.name}</h4>
        <p>₽${p.price.toFixed(2)}</p>
        <button data-id="${p._id}">Добавить в корзину</button>
      `;
      div.querySelector('button').onclick = () => addToCart(p._id);
      container.appendChild(div);
    });
  }
  async function addToCart(id) {
    await fetch('http://localhost:4000/api/cart/add', {
      method:'POST',
      credentials:'include',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({productId:id, qty:1})
    });
    alert('Товар добавлен');
  }
  window.onload = fetchProducts;