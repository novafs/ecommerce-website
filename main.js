// Cart Open Close
let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");

// Open Cart
cartIcon.onclick = () => {
  cart.classList.add("active");
};

// Close Cart
closeCart.onclick = () => {
  cart.classList.remove("active");
};

// Cart Working JS
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

// Main Function
function ready() {
  // Remove Item from Cart
  let removeCartButtons = document.getElementsByClassName("cart-remove");
  for (let button of removeCartButtons) {
    button.addEventListener("click", removeCartItem);
  }

  // Quantity Change
  let quantityInputs = document.getElementsByClassName("cart-quantity");
  for (let input of quantityInputs) {
    input.addEventListener("change", quantityChanged);
  }

  // Add to Cart
  let addCartButtons = document.getElementsByClassName("add-cart");
  for (let button of addCartButtons) {
    button.addEventListener("click", addCartClicked);
  }

  loadCartItems();
}

// Remove Item from Cart
function removeCartItem(event) {
  let buttonClicked = event.target;
  buttonClicked.parentElement.remove();
  updateTotal();
  saveCartItems();
  updateCartIcon();
}

// Quantity Change
function quantityChanged(event) {
  let input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateTotal();
  saveCartItems();
  updateCartIcon();
}

// Add to Cart
function addCartClicked(event) {
  let button = event.target;
  let shopProducts = button.parentElement;
  let title = shopProducts.querySelector(".product-title").innerText;
  let price = shopProducts.querySelector(".price").innerText;
  let productImg = shopProducts.querySelector(".product-img").src;

  addProductToCart(title, price, productImg);
  updateTotal();
  saveCartItems();
  updateCartIcon();
}

function addProductToCart(title, price, productImg) {
  let cartItems = document.querySelector(".cart-content");
  let cartItemNames = cartItems.getElementsByClassName("cart-product-title");

  for (let itemName of cartItemNames) {
    if (itemName.innerText === title) {
      alert("You have already added this item to cart.");
      return;
    }
  }

  let cartShopBox = document.createElement("div");
  cartShopBox.classList.add("cart-box");
  let cartBoxContent = `
    <img src="${productImg}" alt="" class="cart-img">
    <div class="detail-box">
      <div class="cart-product-title">${title}</div>
      <div class="cart-price">${price}</div>
      <input type="number" value="1" class="cart-quantity">
    </div>
    <i class="bx bxs-trash cart-remove"></i>`;

  cartShopBox.innerHTML = cartBoxContent;
  cartItems.append(cartShopBox);

  cartShopBox.querySelector(".cart-remove").addEventListener("click", removeCartItem);
  cartShopBox.querySelector(".cart-quantity").addEventListener("change", quantityChanged);
}

// Update Total
function updateTotal() {
  let cartContent = document.querySelector(".cart-content");
  let cartBoxes = cartContent.getElementsByClassName("cart-box");
  let total = 0;

  for (let cartBox of cartBoxes) {
    let priceElement = cartBox.querySelector(".cart-price");
    let quantityElement = cartBox.querySelector(".cart-quantity");
    let price = parseFloat(priceElement.innerText.replace("$", ""));
    let quantity = parseInt(quantityElement.value);

    total += price * quantity;
  }

  total = Math.round(total * 100) / 100;
  document.querySelector(".total-price").innerText = "$" + total;

  // Save Total to Local Storage
  localStorage.setItem("cartTotal", total);
}

// Save Cart Items
function saveCartItems() {
  let cartContent = document.querySelector(".cart-content");
  let cartBoxes = cartContent.getElementsByClassName("cart-box");
  let cartItems = [];

  for (let cartBox of cartBoxes) {
    let title = cartBox.querySelector(".cart-product-title").innerText;
    let price = cartBox.querySelector(".cart-price").innerText;
    let quantity = cartBox.querySelector(".cart-quantity").value;
    let productImg = cartBox.querySelector(".cart-img").src;

    let item = { title, price, quantity, productImg };
    cartItems.push(item);
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

// Load Cart Items
function loadCartItems() {
  let cartItems = localStorage.getItem("cartItems");
  if (cartItems) {
    cartItems = JSON.parse(cartItems);

    for (let item of cartItems) {
      addProductToCart(item.title, item.price, item.productImg);
      let cartBoxes = document.getElementsByClassName("cart-box");
      let cartBox = cartBoxes[cartBoxes.length - 1];
      cartBox.querySelector(".cart-quantity").value = item.quantity;
    }
  }

  let cartTotal = localStorage.getItem("cartTotal");
  if (cartTotal) {
    document.querySelector(".total-price").innerText = "$" + cartTotal;
  }
  updateCartIcon();
}

// Update Cart Icon Quantity
function updateCartIcon() {
  let cartBoxes = document.getElementsByClassName("cart-box");
  let quantity = 0;

  for (let cartBox of cartBoxes) {
    let quantityElement = cartBox.querySelector(".cart-quantity");
    quantity += parseInt(quantityElement.value);
  }

  let cartIcon = document.querySelector("#cart-icon");
  cartIcon.setAttribute("data-quantity", quantity);
}
