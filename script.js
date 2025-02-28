// Global variables
let map;
let autocomplete;
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
let selectedAddress = localStorage.getItem("selectedAddress") || "";

// Define an array of restaurants
const restaurants = [
  { name: "Pizza Palace", cuisine: "Italian", price: "$$$", logo: "images/pizza_palace_logo.jpg" },
  { name: "Sushi Spot", cuisine: "Japanese", price: "$$$", logo: "images/sushi_spot_logo.jpg" },
  { name: "Burger Barn", cuisine: "American", price: "$$", logo: "images/burger_barn_logo.jpg" },
  { name: "Taco Haven", cuisine: "Mexican", price: "$$", logo: "images/taco_haven_logo.jpg" },
  { name: "Pasta Paradise", cuisine: "Italian", price: "$$$", logo: "images/pasta_paradise_logo.jpg" },
  { name: "Noodle Nirvana", cuisine: "Asian", price: "$$$", logo: "images/noodle_nirvana_logo.jpg" },
  { name: "Steakhouse Supreme", cuisine: "Steak", price: "$$$$", logo: "images/steakhouse_supreme_logo.jpg" },
  { name: "Dim Sum Delight", cuisine: "Chinese", price: "$$", logo: "images/dim_sum_delight_logo.jpg" },
  { name: "Vegan Vibes", cuisine: "Vegan", price: "$$", logo: "images/vegan_vibes_logo.jpg" },
  { name: "BBQ Bliss", cuisine: "BBQ", price: "$$$", logo: "images/bbq_bliss_logo.jpg" }
];

// Define the menu items for each restaurant
const menus = {
  "Pizza Palace": [
    { name: "Margherita", price: 12 },
    { name: "Pepperoni", price: 14 },
    { name: "Vegetarian", price: 13 }
  ],
  "Sushi Spot": [
    { name: "California Roll", price: 10 },
    { name: "Tuna Sashimi", price: 15 },
    { name: "Salmon Nigiri", price: 12 }
  ],
  "Burger Barn": [
    { name: "Cheeseburger", price: 8 },
    { name: "Veggie Burger", price: 9 },
    { name: "BBQ Bacon Burger", price: 10 }
  ],
  "Taco Haven": [
    { name: "Beef Tacos", price: 7 },
    { name: "Chicken Tacos", price: 7 },
    { name: "Vegetarian Tacos", price: 6 }
  ],
  "Pasta Paradise": [
    { name: "Spaghetti", price: 11 },
    { name: "Lasagna", price: 13 },
    { name: "Fettuccine Alfredo", price: 12 }
  ],
  "Noodle Nirvana": [
    { name: "Ramen", price: 9 },
    { name: "Pho", price: 10 },
    { name: "Soba", price: 8 }
  ],
  "Steakhouse Supreme": [
    { name: "Filet Mignon", price: 25 },
    { name: "Ribeye", price: 30 },
    { name: "T-Bone", price: 28 }
  ],
  "Dim Sum Delight": [
    { name: "Spring Rolls", price: 6 },
    { name: "Dumplings", price: 8 },
    { name: "Bao Buns", price: 7 }
  ],
  "Vegan Vibes": [
    { name: "Tofu Stir Fry", price: 9 },
    { name: "Vegan Burrito", price: 10 },
    { name: "Lentil Soup", price: 7 }
  ],
  "BBQ Bliss": [
    { name: "Pulled Pork", price: 12 },
    { name: "Ribs", price: 15 },
    { name: "BBQ Chicken", price: 13 }
  ]
};

// Initialize application based on current page
document.addEventListener('DOMContentLoaded', function() {
  // Check which page we're on based on elements
  const isRestaurantPage = document.getElementById('restaurant-page') !== null;
  const isMainPage = document.getElementById('user-dashboard') !== null;
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  
  if (isRestaurantPage) {
    // Initialize restaurant page
    initRestaurantPage();
  } else if (isMainPage) {
    if (isLoggedIn) {
      // Skip login and show dashboard if logged in
      document.getElementById("login-page").style.display = "none";
      document.getElementById("user-dashboard").style.display = "block";
      showRestaurants();
      updateCartIndicator();
      loadAddresses();
      showTab('restaurants'); // Show restaurants tab by default
    } else {
      // Show login if not logged in
      showLogin();
    }
    
    // Add event listeners for main page
    document.getElementById("signup-btn")?.addEventListener("click", showRegistrationPage);
    
    // Add tab navigation functionality
    const restaurantsTab = document.getElementById('restaurants-tab');
    const addressesTab = document.getElementById('addresses-tab');
    
    if (restaurantsTab) {
      restaurantsTab.addEventListener('click', () => showTab('restaurants'));
    }
    
    if (addressesTab) {
      addressesTab.addEventListener('click', () => showTab('addresses'));
    }
    
    // Add search functionality
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
      searchBar.addEventListener('input', filterRestaurants);
    }
  }
});

// Initialize restaurant page
function initRestaurantPage() {
  const backButton = document.getElementById('back-to-restaurants-btn');
  const restaurantName = getQueryParam('name');
  
  if (backButton) {
    backButton.addEventListener('click', backToRestaurants);
  }
  
  if (restaurantName) {
    showMenu(restaurantName);
  }
  
  // Update cart indicator on restaurant page
  updateCartIndicator();
}

// Function to get URL query parameters
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Function to navigate back to the restaurant list page
function backToRestaurants() {
  // Use history to go back if possible, otherwise redirect
  if (window.history.length > 1) {
    window.history.back();
  } else {
    // Make sure we preserve login state by using local storage
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "index.html";
  }
}

// Show/hide tabs
function showTab(tabName) {
  // Hide all tab content
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Remove active class from all tab buttons
  const tabButtons = document.querySelectorAll('.tabs button');
  tabButtons.forEach(button => {
    button.classList.remove('active');
  });
  
  // Show the selected tab content and activate button
  document.getElementById(tabName).classList.add('active');
  document.getElementById(`${tabName}-tab`).classList.add('active');
  
  // Initialize map if showing addresses tab
  if (tabName === 'addresses') {
    initMap();
    loadAddresses();
  }
}

// Initialize Google Maps
function initMap() {
  const mapContainer = document.getElementById('map');
  const addressInput = document.getElementById('address');
  
  if (!mapContainer || !addressInput) return;
  
  // Initialize map
  map = new google.maps.Map(mapContainer, {
    center: { lat: 40.7128, lng: -74.0060 }, // Default to New York City
    zoom: 12
  });
  
  // Create marker
  const marker = new google.maps.Marker({
    map: map,
    draggable: true
  });
  
  // Initialize address autocomplete
  autocomplete = new google.maps.places.Autocomplete(addressInput, { types: ["geocode"] });
  
  // Update map when place is selected
  autocomplete.addListener("place_changed", function() {
    const place = autocomplete.getPlace();
    if (!place.geometry) {
      alert("No details available for this location.");
      return;
    }
    
    // Set map center and marker position
    map.setCenter(place.geometry.location);
    marker.setPosition(place.geometry.location);
  });
}

// Load user addresses
function loadAddresses() {
  const addressList = document.getElementById('address-list');
  if (!addressList) return;
  
  addressList.innerHTML = "";
  
  // Get addresses from local storage
  const addresses = JSON.parse(localStorage.getItem("addresses")) || [];
  
  addresses.forEach((address, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="address-item">
        <span>${address}</span>
        <div class="address-actions">
          <button class="select-address-btn" onclick="selectAddress('${address}')">Select</button>
          <button class="delete-address-btn" onclick="deleteAddress(${index})">Delete</button>
        </div>
      </div>
    `;
    addressList.appendChild(li);
  });
  
  // Show selected address indicator
  if (selectedAddress) {
    const selectedAddressIndicator = document.createElement('div');
    selectedAddressIndicator.id = 'selected-address-indicator';
    selectedAddressIndicator.innerHTML = `<strong>Delivery Address:</strong> ${selectedAddress}`;
    addressList.insertAdjacentElement('beforebegin', selectedAddressIndicator);
  }
}

// Add address to list
function addAddress() {
  const address = document.getElementById('address').value;
  if (!address) return;
  
  // Get existing addresses
  const addresses = JSON.parse(localStorage.getItem("addresses")) || [];
  
  // Add new address if not already exists
  if (!addresses.includes(address)) {
    addresses.push(address);
    localStorage.setItem("addresses", JSON.stringify(addresses));
    
    // Set as selected address
    selectAddress(address);
    
    // Reload addresses
    loadAddresses();
  }
  
  // Clear input
  document.getElementById('address').value = '';
}

// Select address for delivery
function selectAddress(address) {
  selectedAddress = address;
  localStorage.setItem("selectedAddress", address);
  
  // Update selected address indicator
  const indicator = document.getElementById('selected-address-indicator');
  if (indicator) {
    indicator.innerHTML = `<strong>Delivery Address:</strong> ${address}`;
  } else {
    const addressList = document.getElementById('address-list');
    const selectedAddressIndicator = document.createElement('div');
    selectedAddressIndicator.id = 'selected-address-indicator';
    selectedAddressIndicator.innerHTML = `<strong>Delivery Address:</strong> ${address}`;
    addressList.insertAdjacentElement('beforebegin', selectedAddressIndicator);
  }
  
  alert(`Selected address: ${address}`);
}

// Delete address
function deleteAddress(index) {
  const addresses = JSON.parse(localStorage.getItem("addresses")) || [];
  const deletedAddress = addresses[index];
  
  // Remove address
  addresses.splice(index, 1);
  localStorage.setItem("addresses", JSON.stringify(addresses));
  
  // Update selected address if deleted
  if (selectedAddress === deletedAddress) {
    selectedAddress = addresses.length > 0 ? addresses[0] : "";
    localStorage.setItem("selectedAddress", selectedAddress);
  }
  
  // Reload addresses
  loadAddresses();
}

// Filter restaurants by search term
function filterRestaurants() {
  const searchTerm = document.getElementById('search-bar').value.toLowerCase();
  
  if (!searchTerm) {
    showRestaurants(restaurants);
    return;
  }
  
  const filtered = restaurants.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(searchTerm) || 
           restaurant.cuisine.toLowerCase().includes(searchTerm);
  });
  
  showRestaurants(filtered);
}

// Show restaurants
function showRestaurants(filteredRestaurants = restaurants) {
  const restaurantList = document.getElementById("restaurant-list");
  if (!restaurantList) return;
  
  restaurantList.innerHTML = "";
  filteredRestaurants.forEach(restaurant => {
    const div = document.createElement("div");
    div.classList.add("restaurant");
    div.innerHTML = `
      <h3>${restaurant.name}</h3>
      <img src="${restaurant.logo}" alt="${restaurant.name} logo" class="restaurant-logo">
      <p>${restaurant.cuisine} - ${restaurant.price}</p>
      <div class="restaurant-eta">25-35 min</div>
    `;
    div.onclick = () => {
      window.location.href = `restaurant.html?name=${encodeURIComponent(restaurant.name)}`;
    };
    restaurantList.appendChild(div);
  });
  
  // Add logout button to header
  const header = document.querySelector('header');
  if (header && !document.getElementById('main-logout-btn')) {
    const logoutBtn = document.createElement('button');
    logoutBtn.id = 'main-logout-btn';
    logoutBtn.innerText = 'Logout';
    logoutBtn.onclick = logoutUser;
    
    const cartBtn = document.createElement('button');
    cartBtn.id = 'main-cart-btn';
    cartBtn.innerHTML = `Cart <span id="cart-count">${cart.length}</span>`;
    cartBtn.onclick = viewCart;
    
    const actionDiv = document.createElement('div');
    actionDiv.className = 'header-actions';
    actionDiv.appendChild(cartBtn);
    actionDiv.appendChild(logoutBtn);
    
    header.appendChild(actionDiv);
  }
}

// Show menu for selected restaurant
function showMenu(restaurantName) {
  const menuContainer = document.getElementById("menu-items");
  const restaurantNameElement = document.getElementById("restaurant-name");
  
  if (!menuContainer || !restaurantNameElement || !menus[restaurantName]) {
    console.error("Menu not available or restaurant not found:", restaurantName);
    return;
  }
  
  restaurantNameElement.innerText = restaurantName;
  menuContainer.innerHTML = "";
  
  menus[restaurantName].forEach(item => {
    const div = document.createElement("div");
    div.classList.add("menu-item");
    div.innerHTML = `
      <p>${item.name} - $${item.price.toFixed(2)}</p>
      <button onclick="addToCart('${restaurantName}', '${item.name}', ${item.price})">Add to Cart</button>
    `;
    menuContainer.appendChild(div);
  });
}

// Update cart indicator
function updateCartIndicator() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.innerText = cart.length;
  }
}

// Cart functions
function addToCart(restaurant, item, price) {
  const cartItem = { restaurant, item, price };
  cart.push(cartItem);
  localStorage.setItem("cart", JSON.stringify(cart));
  
  // Update cart indicator
  updateCartIndicator();
  
  // Show notification
  alert(`Added ${item} from ${restaurant} to cart!`);
}

function viewCart() {
  const cartModal = document.getElementById("cart-modal");
  const cartList = document.getElementById("cart-list");
  const cartTotal = document.getElementById("cart-total");
  
  if (!cartModal || !cartList) return;
  
  // Clear cart list
  cartList.innerHTML = "";
  
  if (cart.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Your cart is empty.";
    cartList.appendChild(li);
    if (cartTotal) cartTotal.textContent = "Total: $0.00";
    
    // Hide checkout button if cart is empty
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) checkoutBtn.style.display = 'none';
  } else {
    // Display cart items
    let total = 0;
    
    // Group items by restaurant
    const restaurants = {};
    cart.forEach(item => {
      if (!restaurants[item.restaurant]) {
        restaurants[item.restaurant] = [];
      }
      restaurants[item.restaurant].push(item);
      total += item.price;
    });
    
    // Create list items grouped by restaurant
    Object.keys(restaurants).forEach(restaurantName => {
      const restaurantHeader = document.createElement('li');
      restaurantHeader.className = 'restaurant-header';
      restaurantHeader.textContent = restaurantName;
      cartList.appendChild(restaurantHeader);
      
      restaurants[restaurantName].forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
          <div class="cart-item">
            <span>${item.item} - $${item.price.toFixed(2)}</span>
            <button class="remove-item-btn" onclick="removeFromCart('${item.restaurant}', '${item.item}', ${item.price})">Remove</button>
          </div>
        `;
        cartList.appendChild(li);
      });
    });
    
    // Update total
    if (cartTotal) cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    
    // Show checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.style.display = 'block';
    } else {
      const checkoutButton = document.createElement('button');
      checkoutButton.id = 'checkout-btn';
      checkoutButton.textContent = 'Proceed to Checkout';
      checkoutButton.onclick = proceedToCheckout;
      document.querySelector('.cart-content').appendChild(checkoutButton);
    }
  }
  
  // Add delivery address to cart modal
  const deliveryAddressElement = document.getElementById('cart-delivery-address');
  if (!deliveryAddressElement) {
    const addressElement = document.createElement('div');
    addressElement.id = 'cart-delivery-address';
    
    if (selectedAddress) {
      addressElement.innerHTML = `<strong>Delivery to:</strong> ${selectedAddress}`;
    } else {
      addressElement.innerHTML = '<strong>No delivery address selected.</strong> Please add an address in the Addresses tab.';
    }
    
    // Insert before cart list
    cartList.insertAdjacentElement('beforebegin', addressElement);
  } else {
    if (selectedAddress) {
      deliveryAddressElement.innerHTML = `<strong>Delivery to:</strong> ${selectedAddress}`;
    } else {
      deliveryAddressElement.innerHTML = '<strong>No delivery address selected.</strong> Please add an address in the Addresses tab.';
    }
  }
  
  // Show modal
  cartModal.style.display = "block";
}

function removeFromCart(restaurant, item, price) {
  // Find the index of the item to remove
  const index = cart.findIndex(cartItem => 
    cartItem.restaurant === restaurant && 
    cartItem.item === item && 
    cartItem.price === price
  );
  
  if (index !== -1) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Update cart indicator
    updateCartIndicator();
    
    // Refresh cart view
    viewCart();
  }
}

function closeCart() {
  const cartModal = document.getElementById("cart-modal");
  if (cartModal) cartModal.style.display = "none";
}

function proceedToCheckout() {
  if (!selectedAddress) {
    alert("Please select a delivery address before checkout.");
    closeCart();
    showTab('addresses');
    return;
  }
  
  // Calculate total
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  
  // Create checkout modal
  const modal = document.createElement('div');
  modal.id = 'checkout-modal';
  modal.className = 'checkout-modal';
  
  // Get delivery time (random between 25-45 minutes)
  const deliveryTime = Math.floor(Math.random() * 20) + 25;
  
  modal.innerHTML = `
    <div class="checkout-content">
      <h2>Checkout</h2>
      <div class="checkout-details">
        <p><strong>Delivery Address:</strong> ${selectedAddress}</p>
        <p><strong>Estimated Delivery Time:</strong> ${deliveryTime} minutes</p>
        <p><strong>Order Summary:</strong></p>
        <ul class="checkout-items">
          ${cart.map(item => `<li>${item.item} from ${item.restaurant} - $${item.price.toFixed(2)}</li>`).join('')}
        </ul>
        <div class="checkout-total">
          <p><strong>Subtotal:</strong> $${total.toFixed(2)}</p>
          <p><strong>Delivery Fee:</strong> $2.99</p>
          <p><strong>Tax:</strong> $${(total * 0.08).toFixed(2)}</p>
          <p class="final-total"><strong>Total:</strong> $${(total + 2.99 + (total * 0.08)).toFixed(2)}</p>
        </div>
        <div class="payment-method">
          <p><strong>Payment Method:</strong></p>
          <select id="payment-method">
            <option value="credit-card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="cash">Cash on Delivery</option>
          </select>
        </div>
      </div>
      <div class="checkout-actions">
        <button onclick="placeOrder()">Place Order</button>
        <button onclick="closeCheckout()">Cancel</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  closeCart();
}

function closeCheckout() {
  const checkoutModal = document.getElementById('checkout-modal');
  if (checkoutModal) {
    checkoutModal.remove();
  }
}

function placeOrder() {
  // Simulate order placement
  const orderNumber = Math.floor(Math.random() * 1000000);
  alert(`Order #${orderNumber} placed successfully! Your food is on the way.`);
  
  // Clear cart
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartIndicator();
  
  // Close checkout modal
  closeCheckout();
  
  // Show order confirmation
  const confirmationModal = document.createElement('div');
  confirmationModal.id = 'confirmation-modal';
  confirmationModal.className = 'confirmation-modal';
  
  confirmationModal.innerHTML = `
    <div class="confirmation-content">
      <h2>Order Confirmed!</h2>
      <p>Your order #${orderNumber} has been placed successfully.</p>
      <p>We'll deliver to: ${selectedAddress}</p>
      <p>Estimated delivery time: 30-45 minutes</p>
      <button onclick="closeConfirmation()">OK</button>
    </div>
  `;
  
  document.body.appendChild(confirmationModal);
}

function closeConfirmation() {
  const confirmationModal = document.getElementById('confirmation-modal');
  if (confirmationModal) {
    confirmationModal.remove();
  }
}

// Authentication functions
function showLogin() {
  document.getElementById("login-page").style.display = "block";
  document.getElementById("registration-page").style.display = "none";
  document.getElementById("user-dashboard").style.display = "none";
}

function showRegistrationPage() {
  document.getElementById("login-page").style.display = "none";
  document.getElementById("registration-page").style.display = "block";
  document.getElementById("user-dashboard").style.display = "none";
}

async function loginUser(event) {
  event.preventDefault();
  
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  
  try {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Store login state
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify({ username }));
      
      document.getElementById("login-page").style.display = "none";
      document.getElementById("user-dashboard").style.display = "block";
      showRestaurants();
      loadAddresses();
      showTab('restaurants'); // Show restaurants tab by default
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    // For demo purposes, skip the login (remove in production)
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify({ username }));
    
    document.getElementById("login-page").style.display = "none";
    document.getElementById("user-dashboard").style.display = "block";
    showRestaurants();
    loadAddresses();
    showTab('restaurants');
  }
}

async function registerUser() {
  const username = document.getElementById("reg-username").value;
  const password = document.getElementById("reg-password").value;
  const email = document.getElementById("reg-email").value;
  
  try {
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert('User registered successfully!');
      showLogin();
    } else {
      alert(data.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('Registration error: ' + error.message);
  }
}

function logoutUser() {
  // Clear any tokens or state
  localStorage.removeItem('token');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('currentUser');
  
  // Keep cart and addresses for convenience
  
  // Redirect to login page
  showLogin();
}

// Make certain functions globally available
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.viewCart = viewCart;
window.closeCart = closeCart;
window.loginUser = loginUser;
window.registerUser = registerUser;
window.logoutUser = logoutUser;
window.showRegistrationPage = showRegistrationPage;
window.showTab = showTab;
window.addAddress = addAddress;
window.selectAddress = selectAddress;
window.deleteAddress = deleteAddress;
window.backToRestaurants = backToRestaurants;
window.initMap = initMap;
window.proceedToCheckout = proceedToCheckout;
window.closeCheckout = closeCheckout;
window.placeOrder = placeOrder;
window.closeConfirmation = closeConfirmation;
window.filterRestaurants = filterRestaurants;