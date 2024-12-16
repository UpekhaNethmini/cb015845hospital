document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.getElementById("product-grid");
  const cartTableBody = document.querySelector("#cart-table tbody");
  const totalPriceElement = document.getElementById("total-price");
  const addToFavoritesButton = document.getElementById("add-to-favorites");
  const applyFavoritesButton = document.getElementById("apply-favorites");
  const buyNowButton = document.getElementById("buy-now");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let favorites = [];
  let products = {};

  fetch("JSON/medicines.json")
      .then(response => response.json())
      .then(data => {
          products = data;
          displayProducts("analgesics"); // Default category
      });

  function displayProducts(category) {
      const categoryProducts = products[category] || [];
      productGrid.innerHTML = categoryProducts.map(product => `
          <div class="product">
              <img src="${product.image}" alt="${product.name}">
              <h3>${product.name}</h3>
              <p class="price">Price: LKR ${product.price.toLocaleString()}</p>
              <label>Quantity: <input type="number" min="1" value="1"></label>
              <button class="add-to-cart" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
          </div>
      `).join('');
  }

  document.querySelectorAll(".tab").forEach(button => {
      button.addEventListener("click", () => {
          document.querySelectorAll(".tab").forEach(btn => btn.classList.remove("active"));
          button.classList.add("active");
          displayProducts(button.dataset.category);
      });
  });

  productGrid.addEventListener("click", e => {
      if (e.target.classList.contains("add-to-cart")) {
          const name = e.target.dataset.name;
          const price = parseFloat(e.target.dataset.price);
          const quantity = parseInt(e.target.previousElementSibling.querySelector("input").value);
          addToCart(name, price, quantity);
      }
  });

  function addToCart(name, price, quantity) {
      const existingItem = cart.find(item => item.name === name);
      if (existingItem) {
          existingItem.quantity += quantity;
          existingItem.totalPrice = existingItem.price * existingItem.quantity;
      } else {
          cart.push({ name, quantity, price, totalPrice: price * quantity });
      }
      updateCartUI();
      localStorage.setItem("cart", JSON.stringify(cart));
  }

  function updateCartUI() {
      cartTableBody.innerHTML = cart.map(item => `
          <tr>
              <td>${item.name}</td>
              <td>LKR ${item.price.toLocaleString()}</td>
              <td><input type="number" value="${item.quantity}" min="1" class="quantity-input" data-name="${item.name}"></td>
              <td>LKR ${item.totalPrice.toLocaleString()}</td>
              <td><button class="delete-item" data-name="${item.name}">Delete</button></td>
          </tr>
      `).join('');
      totalPriceElement.textContent = `Total Price: LKR ${cart.reduce((sum, item) => sum + item.totalPrice, 0).toLocaleString()}`;
  }

  cartTableBody.addEventListener("input", e => {
      if (e.target.classList.contains("quantity-input")) {
          updateItemQuantity(e.target.dataset.name, parseInt(e.target.value));
      }
  });

  function updateItemQuantity(name, newQuantity) {
      const item = cart.find(item => item.name === name);
      if (item) {
          item.quantity = newQuantity;
          item.totalPrice = item.price * newQuantity;
          updateCartUI();
          localStorage.setItem("cart", JSON.stringify(cart));
      }
  }

  cartTableBody.addEventListener("click", e => {
      if (e.target.classList.contains("delete-item")) {
          deleteItem(e.target.dataset.name);
      }
  });

  function deleteItem(name) {
      cart = cart.filter(item => item.name !== name);
      updateCartUI();
      localStorage.setItem("cart", JSON.stringify(cart));
  }

  addToFavoritesButton.addEventListener("click", () => {
      favorites = [...cart];
      alert("Your cart has been saved to favorites!");
  });

  applyFavoritesButton.addEventListener("click", () => {
      if (favorites.length) {
          cart = [...favorites];
          updateCartUI();
          localStorage.setItem("cart", JSON.stringify(cart));
          alert("Favorites applied to cart!");
      } else {
          alert("No favorites to apply.");
      }
  });

  buyNowButton.addEventListener("click", () => {
      if (cart.length === 0) {
          alert("Your cart is empty! Please add some items before purchasing.");
      } else {
          localStorage.setItem("cart", JSON.stringify(cart));
          window.location.href = "orderpage.html";
      }
  });

  updateCartUI();
});
