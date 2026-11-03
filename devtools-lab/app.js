// 새벽오븐 베이커리 — 실습용 스크립트
// 이 파일에는 책에서 찾아 고칠 "버그"가 일부러 들어 있어요.

const CART_KEY = 'dawnoven-cart';

// 방문 기록 쿠키 (애플리케이션 패널 실습용)
document.cookie = 'visited=yes; path=/; max-age=86400';

// 1) 메뉴 데이터 불러오기 (네트워크 패널에서 이 요청을 볼 수 있어요)
fetch('data/menu.json')
  .then(response => response.json())
  .then(menu => renderMenu(menu));

function renderMenu(menu) {
  const list = document.getElementById('menu-list');
  list.innerHTML = menu.map(item => `
    <article class="card">
      <img src="${item.image}">
      <div class="card-body">
        <div class="card-title">
          <h3>${item.name}</h3>
          ${item.badge ? `<span class="badge">${item.badge}</span>` : ''}
        </div>
        <p class="desc">${item.desc}</p>
        <p class="price">${item.price.toLocaleString()}원</p>
        <button class="add-btn" data-name="${item.name}" data-price="${item.price}">담기</button>
      </div>
    </article>
  `).join('');

  document.querySelectorAll('.add-btn').forEach(button => {
    button.addEventListener('click', () => {
      addToCart(button.dataset.name, button.dataset.price);
      sessionStorage.setItem('lastViewed', button.dataset.name);
    });
  });
}

// 2) 장바구니 (localStorage에 저장돼요)
function loadCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(name, price) {
  const cart = loadCart();
  cart.push({ name: name, price: price });
  saveCart(cart);
  renderCart();
}

function renderCart() {
  const cart = loadCart();
  const list = document.getElementById('cart-list');

  if (cart.length === 0) {
    list.innerHTML = '<li class="empty">아직 담은 빵이 없어요</li>';
    document.getElementById('cart-total').textContent = '0원';
    return;
  }

  list.innerHTML = cart.map(item =>
    `<li><span>${item.name}</span><span>${Number(item.price).toLocaleString()}원</span></li>`
  ).join('');

  document.getElementById('cart-total').textContent = calcTotal(cart) + '원';
}

// 3) 합계 계산 — 빵을 두 개 이상 담으면 이상한 숫자가 나와요!
function calcTotal(cart) {
  const prices = cart.map(item => item.price);
  const total = prices.reduce((sum, price) => sum + price);
  return total.toLocaleString();
}

// 4) 버튼 연결
document.getElementById('clear-btn').addEventListener('click', () => {
  localStorage.removeItem(CART_KEY);
  renderCart();
});

document.getElementById('order-btn').addEventListener('click', () => {
  showReciept();
});

function showReceipt() {
  const cart = loadCart();
  if (cart.length === 0) {
    alert('장바구니가 비어 있어요');
    return;
  }
  alert(`주문 완료! 합계 ${calcTotal(cart)}원`);
  localStorage.removeItem(CART_KEY);
  renderCart();
}

renderCart();
