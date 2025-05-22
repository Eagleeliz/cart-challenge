// Data for menu items
const menuItems = [
    { id: 'waffle', name: "Waffle with Berries", price: 6.50, image: "images/image-waffle-desktop.jpg" },
    { id: 'creme_brulee', name: "Vanilla Bean Crème Brûlée", price: 7.00, image: "images/image-creme-brulee-desktop.jpg" },
    { id: 'macaron', name: "Macaron Mix of Five", price: 8.00, image: "images/image-macaron-desktop.jpg" },
    { id: 'tiramisu', name: "Classic Tiramisu", price: 5.50, image: "images/image-tiramisu-desktop.jpg" },
    { id: 'baklava', name: "Pistachio Baklava", price: 4.00, image: "images/image-baklava-desktop.jpg" },
    { id: 'pie', name: "Lemon Meringue Pie", price: 5.00, image: "images/image-meringue-desktop.jpg" },
    { id: 'strawberry_shortcake', name: "Strawberry Shortcake", price: 6.00, image: "images/image-cake-mobile.jpg" },
    { id: 'chocolate_brownie', name: "Salted Caramel Brownie", price: 4.50, image: "images/image-brownie-tablet.jpg" },
    { id: 'mini_layer_cake', name: "Vanilla Panna Cotta", price: 3.50, image: "images/image-panna-cotta-desktop.jpg" }
];

// DOM Elements
const menuItemsContainer = document.querySelector(".menu-items");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");
const cartItemCountElement = document.getElementById("cart-item-count");
const confirmOrderButton = document.getElementById("confirm-order");
const cartEmptyState = document.getElementById("cart-empty-state");
const orderConfirmationModal = document.getElementById("order-confirmation-modal");
const modalCartSummary = document.getElementById("modal-cart-summary");
const modalCartTotal = document.getElementById("modal-cart-total");
const startNewOrderButton = document.getElementById("start-new-order");

// Cart State - Initialized with active state items
let cart = [
    { id: 'tiramisu', name: "Classic Tiramisu", price: 5.50, image: "images/image-tiramisu-desktop.jpg", quantity: 1 },
    { id: 'creme_brulee', name: "Vanilla Bean Crème Brûlée", price: 7.00, image: "images/image-creme-brulee-desktop.jpg", quantity: 4 },
    { id: 'mini_layer_cake', name: "Vanilla Panna Cotta", price: 3.50, image: "images/image-panna-cotta-desktop.jpg", quantity: 2 }
];

/**
 * Calculates the total price of all items in the cart
@returns {number} 
//  */
function calculateCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

/**
 * Calculates the total number of items (quantity) in the cart.
 * @returns {number} The total item count.
 */
function calculateItemCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Displays all menu items on the page.

 
function displayMenuItems() {
    menuItemsContainer.innerHTML = ""; // used to Clear previous items
    menuItems.forEach((item) => {
        const menuItemDiv = document.createElement("div");
        menuItemDiv.classList.add("menu-item");

        const existingCartItem = cart.find(cartItem => cartItem.id === item.id);
        const controlHtml = existingCartItem
            ? `
            <div class="quantity-controls" data-item-id="${item.id}">
                <button class="quantity-btn minus-btn" aria-label="Decrease quantity">-</button>
                <span class="quantity-display">${existingCartItem.quantity}</span>
                <button class="quantity-btn plus-btn" aria-label="Increase quantity">+</button>
            </div>
            `
            : `
            <button class="add-to-cart-btn" data-item-id="${item.id}" aria-label="Add to cart">
                <img src="images/icon-add-to-cart.svg" alt="Shopping cart icon" class="button-icon"> Add to Cart
            </button>
            `;

        menuItemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>$${item.price.toFixed(2)}</p>
            ${controlHtml}
        `;
        menuItemsContainer.appendChild(menuItemDiv);
    });
}

/**
 * Adds an item to the cart or increases its quantity if already present.
 * @param {string} itemId - The ID of the item to add.
 */
function addItemToCart(itemId) {
    const selectedItem = menuItems.find(item => item.id === itemId);
    if (!selectedItem) return;

    const existingCartItem = cart.find(item => item.id === itemId);

    if (existingCartItem) {
        existingCartItem.quantity += 1;
    } else {
        cart.push({ ...selectedItem, quantity: 1 });
    }
    updateCartAndMenu();
}

/**
 * Decreases the quantity of an item in the cart. Removes the item if quantity drops to 0.
 * @param {string} itemId - The ID of the item to decrease quantity.
 */
function decreaseItemQuantity(itemId) {
    const existingCartItem = cart.find(item => item.id === itemId);
    if (!existingCartItem) return;

    existingCartItem.quantity -= 1;

    if (existingCartItem.quantity <= 0) {
        cart = cart.filter(item => item.id !== itemId); // Remove item if quantity is zero
    }
    updateCartAndMenu();
}

/**
 * Removes an item completely from the cart.
 * @param {string} itemId 
 */
function removeItemFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartAndMenu();
}


//  Updates the cart display, item count, total, and re-renders menu items.

function updateCartAndMenu() {
    const currentTotal = calculateCartTotal();
    const currentItemCount = calculateItemCount();

    cartItemsContainer.innerHTML = ""; // Clear previous cart items

    if (cart.length === 0) {
        cartEmptyState.classList.remove('hidden'); // Show empty state message
    } else {
        cartEmptyState.classList.add('hidden'); // Hide empty state message
        cart.forEach(item => {
            const cartItemDiv = document.createElement("div");
            cartItemDiv.classList.add("cart-item");
            cartItemDiv.innerHTML = `
                <div class="cart-item-info">
                    <span>${item.name}</span>
                    <span>${item.quantity}x @ $${item.price.toFixed(2)}</span>
                </div>
                <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove-item-btn" data-item-id="${item.id}" aria-label="Remove item">
                    <img src="images/icon-remove-item.svg" alt="Remove item icon" class="remove-icon">
                </button>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
        });
    }

    cartTotalElement.textContent = `$${currentTotal.toFixed(2)}`;
    cartItemCountElement.textContent = currentItemCount;

    // Re-render menu items to update quantity controls
    displayMenuItems();
}


//  Displays the order confirmation modal with current cart details.
 
function showOrderConfirmation() {
    modalCartSummary.innerHTML = ''; // Clear previous summary
    cart.forEach(item => {
        const modalItemDiv = document.createElement('div');
        modalItemDiv.classList.add('modal-cart-item');
        modalItemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="rounded-lg">
            <div class="modal-item-details">
                <span>${item.name}</span>
                <span>${item.quantity}x @ $${item.price.toFixed(2)}</span>
            </div>
            <span class="modal-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        modalCartSummary.appendChild(modalItemDiv);
    });
    modalCartTotal.textContent = `$${calculateCartTotal().toFixed(2)}`;
    orderConfirmationModal.classList.remove('hidden');
}

/**
 * Hides the order confirmation modal and resets the cart.
 */
function hideOrderConfirmationAndReset() {
    orderConfirmationModal.classList.add('hidden');
    cart = [];
    updateCartAndMenu();
}



// Event listener for menu items (Add to Cart, +, - buttons)
menuItemsContainer.addEventListener("click", (event) => {
    const target = event.target;
    const itemId = target.closest('[data-item-id]')?.dataset.itemId;

    if (!itemId) return;

    if (target.classList.contains("add-to-cart-btn") || target.closest(".add-to-cart-btn")) {
        addItemToCart(itemId);
    } else if (target.classList.contains("plus-btn") || target.closest(".plus-btn")) {
        addItemToCart(itemId);
    } else if (target.classList.contains("minus-btn") || target.closest(".minus-btn")) {
        decreaseItemQuantity(itemId);
    }
});

// Event listener for removing items from the cart summary (X icon)
cartItemsContainer.addEventListener("click", (event) => {
    const target = event.target;
    const itemId = target.closest('.remove-item-btn')?.dataset.itemId;

    if (itemId) {
        removeItemFromCart(itemId);
    }
});

// Confirm Order button
confirmOrderButton.addEventListener("click", () => {
    if (cart.length > 0) {
        showOrderConfirmation();
    } else {
        alert("Your cart is empty! Please add items before confirming your order.");
    }
});

// Start New Order button in the modal
startNewOrderButton.addEventListener("click", hideOrderConfirmationAndReset);

// Call updateCartAndMenu initially to display menu items and the empty cart state
updateCartAndMenu();

