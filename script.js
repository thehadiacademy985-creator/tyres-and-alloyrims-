// ==================== PRODUCT DATABASE ====================
const products = [
    // Tyres
    {
        id: 1,
        name: 'All-Season Radial Tyre',
        category: 'tyres',
        price: 85,
        description: 'Reliable all-season performance for everyday driving',
        icon: '🛞'
    },
    {
        id: 2,
        name: 'Performance Summer Tyre',
        category: 'tyres',
        price: 125,
        description: 'Enhanced grip and handling for summer conditions',
        icon: '🛞'
    },
    {
        id: 3,
        name: 'Winter Snow Tyre',
        category: 'tyres',
        price: 110,
        description: 'Superior traction in snow and ice conditions',
        icon: '🛞'
    },
    {
        id: 4,
        name: 'Off-Road Adventure Tyre',
        category: 'tyres',
        price: 150,
        description: 'Durable tread for rugged terrain',
        icon: '🛞'
    },
    {
        id: 5,
        name: 'Eco-Friendly Green Tyre',
        category: 'tyres',
        price: 95,
        description: 'Low rolling resistance for fuel efficiency',
        icon: '🛞'
    },
    {
        id: 6,
        name: 'Premium Luxury Tyre',
        category: 'tyres',
        price: 180,
        description: 'Smooth ride and reduced noise technology',
        icon: '🛞'
    },
    // Alloy Rims
    {
        id: 7,
        name: 'Classic Silver Alloy Rim',
        category: 'rims',
        price: 200,
        description: '17-inch classic design, 5-hole pattern',
        icon: '⚙️'
    },
    {
        id: 8,
        name: 'Sport Black Alloy Rim',
        category: 'rims',
        price: 280,
        description: '19-inch aggressive sport design with gloss finish',
        icon: '⚙️'
    },
    {
        id: 9,
        name: 'Premium Chrome Alloy Rim',
        category: 'rims',
        price: 350,
        description: '20-inch luxury chrome finish, ultra lightweight',
        icon: '⚙️'
    },
    {
        id: 10,
        name: 'Matte Grey Alloy Rim',
        category: 'rims',
        price: 240,
        description: '18-inch modern design with matte grey coating',
        icon: '⚙️'
    },
    {
        id: 11,
        name: 'Mesh Design Alloy Rim',
        category: 'rims',
        price: 310,
        description: '19-inch mesh design, light alloy construction',
        icon: '⚙️'
    },
    {
        id: 12,
        name: 'Vintage Spoke Alloy Rim',
        category: 'rims',
        price: 220,
        description: '17-inch classic spoke design for timeless look',
        icon: '⚙️'
    }
];

// ==================== SHOPPING CART MANAGEMENT ====================
let cart = [];

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('tirehubcart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
        renderCartItems();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('tirehubcart', JSON.stringify(cart));
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    renderCartItems();
    showNotification(`${product.name} added to cart!`);
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCartItems();
}

// Update quantity
function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = parseInt(quantity);
        saveCart();
        renderCartItems();
    }
}

// Update cart count badge
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

// ==================== CART UI RENDERING ====================
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    sidebar.classList.toggle('open');
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        updateCartTotals();
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.category === 'tyres' ? 'Tyre' : 'Alloy Rim'}</p>
                <div class="cart-item-price">$${item.price}</div>
                <div class="quantity-control">
                    <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <input type="number" value="${item.quantity}" readonly>
                    <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    updateCartTotals();
}

function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// ==================== PRODUCT FILTERING & DISPLAY ====================
let currentFilter = 'all';

function renderProducts(filter = 'all') {
    const grid = document.getElementById('productsGrid');
    const filtered = filter === 'all' 
        ? products 
        : products.filter(p => p.category === filter);

    grid.innerHTML = filtered.map(product => `
        <div class="product-card">
            <div class="product-image">${product.icon}</div>
            <div class="product-info">
                <span class="product-category">${product.category === 'tyres' ? 'Tyre' : 'Alloy Rim'}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price}</div>
                <div class="product-footer">
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn-wishlist" onclick="addToWishlist(${product.id})">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterProducts(category) {
    currentFilter = category;

    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    renderProducts(category);
}

// ==================== WISHLIST FUNCTIONALITY ====================
function addToWishlist(productId) {
    const product = products.find(p => p.id === productId);
    const wishlist = JSON.parse(localStorage.getItem('tirehubwishlist') || '[]');

    if (!wishlist.find(p => p.id === productId)) {
        wishlist.push(product);
        localStorage.setItem('tirehubwishlist', JSON.stringify(wishlist));
        showNotification(`${product.name} added to wishlist!`);
    } else {
        showNotification(`${product.name} is already in your wishlist`);
    }
}

// ==================== NOTIFICATION SYSTEM ====================
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: #27ae60;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 300;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ==================== CONTACT FORM ====================
function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const name = event.target[0].value;
    const email = event.target[1].value;
    const message = event.target[2].value;

    // Simulate form submission
    console.log('Form submitted:', { name, email, message });
    showNotification('Thank you! We will contact you soon.');

    event.target.reset();
}

// ==================== MOBILE MENU ====================
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navLinks.style.cssText += `
        position: absolute;
        top: 60px;
        right: 0;
        background-color: var(--primary-color);
        flex-direction: column;
        width: 100%;
        z-index: 99;
    `;
}

// ==================== SMOOTH SCROLL FOR MOBILE ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            if (window.innerWidth <= 768) {
                const navLinks = document.querySelector('.nav-links');
                navLinks.style.display = 'none';
            }
        }
    });
});

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderProducts();
});
