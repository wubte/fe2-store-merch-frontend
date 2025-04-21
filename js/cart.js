async function loadCart() {
    const res = await fetch('http://localhost:4000/api/cart', {credentials:'include'});
    const {cart} = await res.json();
    const container = document.getElementById('cartItems');
    container.innerHTML = '';
    let total = 0;
    cart.forEach(i => {
      const div = document.createElement('div');
      div.innerHTML = `
        ${i.productId.name} x${i.qty} — $${(i.productId.price*i.qty).toFixed(2)}
        <button data-id="${i.productId._id}">Удалить</button>
      `;
      div.querySelector('button').onclick = () => remove(i.productId._id);
      container.appendChild(div);
      total += i.qty * i.productId.price;
    });
    document.getElementById('cartTotal').textContent = total.toFixed(2);
  }
  async function remove(id) {
    await fetch('http://localhost:4000/api/cart/remove', {
      method:'POST', credentials:'include',
      headers:{'Content-Type':'application/json'}, body:JSON.stringify({productId:id})
    });
    loadCart();
  }
  document.getElementById('checkout')?.addEventListener('click', async () => {
    const res = await fetch('http://localhost:4000/api/order/create', {method:'POST', credentials:'include'});
    const {url} = await res.json();
    window.location = url;
  });

window.onload = loadCart;

function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

// Сохранение корзины в localStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Добавить товар в корзину
function addToCart(productId, name, price, image) {
  const cart = getCart();

  // Проверим, есть ли уже такой товар
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name,
      price,
      image,
      quantity: 1
    });
  }

  saveCart(cart);
  alert(`${name} добавлен в корзину`);
}

// Отобразить корзину
function renderCart() {
  const cartItemsContainer = document.getElementById('cartItems');
  const totalElement = document.getElementById('cartTotal');
  const cart = getCart();
  let total = 0;

  cartItemsContainer.innerHTML = '';

  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <span>${item.name} x${item.quantity}</span>
      <span>${(item.price * item.quantity).toFixed(2)} ₽</span>
      <button onclick="removeFromCart('${item.id}')">Удалить</button>
    `;
    cartItemsContainer.appendChild(div);
    total += item.price * item.quantity;
  });

  totalElement.textContent = total.toFixed(2);
}

// Удалить товар из корзины
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  renderCart();
}

// Очистить корзину
function clearCart() {
  localStorage.removeItem('cart');
  renderCart();
}

// Подключить к кнопке оформления заказа
const checkoutButton = document.getElementById('checkout');
if (checkoutButton) {
  checkoutButton.addEventListener('click', () => {
    window.location.href = 'checkout.html';
  });
}

// При загрузке страницы корзины — отрисовать её
if (document.getElementById('cartItems')) {
  renderCart();
}