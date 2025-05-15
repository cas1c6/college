let allProducts = null;

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded');
    console.log('Initial cart:', cart);

    // Инициализация счетчика корзины
    updateCartCount();

    // Отображение корзины, если мы на странице корзины
    if (document.querySelector('.cart-page')) {
        displayCart();
    }

    // Добавляем обработчики для всех кнопок добавления в корзину
    document.querySelectorAll('.add-to-cart').forEach(button => {
        console.log('Adding click handler to button:', button);
        button.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Button clicked');
            window.addToCart(this);
        });
    });

    // Карусель на главной странице
    const mainCarousel = document.querySelector('.carousel');
    if (mainCarousel) {
        console.log('Carousel found');
        const container = mainCarousel.querySelector('.carousel-container');
        const slides = mainCarousel.querySelector('.carousel-slide');
        const prevButton = mainCarousel.querySelector('.prev');
        const nextButton = mainCarousel.querySelector('.next');
        const productCards = mainCarousel.querySelectorAll('.product-card');

        let currentIndex = 0;
        const cardWidth = productCards[0].offsetWidth + 32; // 32px - это gap между карточками
        const visibleCards = window.innerWidth > 768 ? 3 : window.innerWidth > 480 ? 2 : 1;
        const maxIndex = productCards.length - visibleCards;

        console.log('Carousel settings:', {
            cardWidth,
            visibleCards,
            maxIndex,
            totalCards: productCards.length
        });

        function updateCarousel() {
            if (slides) {
                const offset = currentIndex * cardWidth;
                console.log('Updating carousel, offset:', offset);
                slides.style.transform = `translateX(-${offset}px)`;
            }
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                console.log('Prev button clicked');
                if (currentIndex > 0) {
                    currentIndex--;
                } else {
                    currentIndex = maxIndex; // loop to last
                }
                updateCarousel();
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                console.log('Next button clicked');
                if (currentIndex < maxIndex) {
                    currentIndex++;
                } else {
                    currentIndex = 0; // loop to first
                }
                updateCarousel();
            });
        }

        // Обновляем позицию карусели при изменении размера окна
        window.addEventListener('resize', () => {
            const newVisibleCards = window.innerWidth > 768 ? 3 : window.innerWidth > 480 ? 2 : 1;
            if (newVisibleCards !== visibleCards) {
                currentIndex = 0;
                updateCarousel();
            }
        });

        // Инициализация карусели
        updateCarousel();
    } else {
        console.log('Carousel not found');
    }

    // Корзина
    // let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();

    // Update cart count
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            // Считаем общее количество товаров с учетом quantity
            const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            cartCount.textContent = totalItems;
            console.log('Cart count updated:', totalItems);
        } else {
            console.log('Cart count element not found');
        }
    }

    // Show notification
    function showNotification(message, type = 'info') {
        console.log('Showing notification:', message, type);
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Cart page functionality
    const cartPage = document.querySelector('.cart-page');
    if (cartPage) {
        const cartItems = document.querySelector('.cart-items');
        const subtotalElement = document.querySelector('.subtotal');
        const shippingElement = document.querySelector('.shipping');
        const totalElement = document.querySelector('.total-amount');

        // Remove item from cart
        cartItems.addEventListener('click', function (e) {
            if (e.target.closest('.remove-item')) {
                const index = e.target.closest('.remove-item').dataset.index;
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                displayCart();
                updateCartCount();
                showNotification('Товар удален из корзины', 'info');
            }
        });

        // Checkout button
        const checkoutButton = document.querySelector('.checkout-button');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', function () {
                if (cart.length === 0) {
                    showNotification('Корзина пуста', 'error');
                    return;
                }
                // Здесь будет логика оформления заказа
                showNotification('Переход к оформлению заказа...', 'info');
            });
        }

        displayCart();
    }

    // Contact form functionality
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            console.log('Form submitted:', data);
            showNotification('Сообщение отправлено');
            this.reset();
        });
    }

    // Поиск по каталогу
    if (window.location.pathname.includes('catalog.html')) {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const productCards = document.querySelectorAll('.catalog-grid .product-card');

        function filterCatalog() {
            const query = searchInput.value.trim().toLowerCase();
            productCards.forEach(card => {
                const name = card.querySelector('h3').textContent.toLowerCase();
                if (name.includes(query)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', filterCatalog);
        }
        if (searchInput) {
            searchInput.addEventListener('keyup', function (e) {
                if (e.key === 'Enter') filterCatalog();
            });
        }
    }

    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 1rem 2rem;
            border-radius: 5px;
            animation: slideIn 0.3s ease-out;
            z-index: 1000;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .cart-item {
            display: flex;
            align-items: center;
            padding: 1rem;
            border-bottom: 1px solid #dee2e6;
        }
        
        .cart-item img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            margin-right: 1rem;
        }
        
        .cart-item-details {
            flex-grow: 1;
        }
        
        .remove-item {
            background: none;
            border: none;
            color: #dc3545;
            cursor: pointer;
            padding: 0.5rem;
        }
        
        .remove-item:hover {
            color: #c82333;
        }
    `;
    document.head.appendChild(style);

    // Auth functionality
    const authForms = document.querySelectorAll('.auth-form');
    if (authForms.length > 0) {
        authForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                // Here you would typically send the data to your backend
                console.log('Form submitted:', data);

                // For demo purposes, we'll just redirect to profile
                window.location.href = 'profile.html';
            });
        });
    }

    // Profile functionality
    const profileNav = document.querySelector('.profile-nav');
    if (profileNav) {
        const sections = document.querySelectorAll('.profile-section');
        const navLinks = profileNav.querySelectorAll('a:not(.logout)');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);

                // Update active states
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Show target section
                sections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === targetId) {
                        section.classList.add('active');
                    }
                });
            });
        });

        // Handle logout
        const logoutLink = profileNav.querySelector('.logout');
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                // Here you would typically clear the session/tokens
                window.location.href = 'login.html';
            });
        }
    }

    // Profile form handling
    const profileForm = document.querySelector('.profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(profileForm);
            const data = Object.fromEntries(formData.entries());

            // Here you would typically send the data to your backend
            console.log('Profile updated:', data);

            // Show success message
            alert('Профиль успешно обновлен');
        });
    }

    // --- Сохраняем исходный список товаров для каталога ---
    function filterProducts() {
        const productsContainer = document.querySelector('.product-grid') || document.querySelector('.catalog-grid');
        if (!productsContainer) return;

        // Инициализация только если есть товары
        if (!allProducts || allProducts.length === 0) {
            const products = Array.from(productsContainer.children).filter(el => el.classList.contains('product-card'));
            if (products.length > 0) {
                allProducts = products;
            } else {
                // Если товаров нет, не очищаем контейнер и не фильтруем
                return;
            }
        }

        const selectedBrandBtn = document.querySelector('.brand-button.active');
        const selectedBrand = selectedBrandBtn ? selectedBrandBtn.dataset.brand : 'all';
        const priceRange = document.getElementById('price-range');
        const maxPrice = priceRange ? parseInt(priceRange.value) : Infinity;
        const sortSelect = document.getElementById('sort-by');
        const sortBy = sortSelect ? sortSelect.value : 'default';

        // Фильтрация
        let filteredProducts = allProducts.filter(product => {
            const price = parseInt(product.dataset.price || product.querySelector('.price').textContent.replace(/[^\d]/g, ''));
            const brand = product.dataset.brand;
            return price <= maxPrice && (selectedBrand === 'all' || brand === selectedBrand);
        });

        // Сортировка
        filteredProducts.sort((a, b) => {
            const priceA = parseInt(a.dataset.price || a.querySelector('.price').textContent.replace(/[^\d]/g, ''));
            const priceB = parseInt(b.dataset.price || b.querySelector('.price').textContent.replace(/[^\d]/g, ''));
            const ratingA = parseFloat(a.dataset.rating || 0);
            const ratingB = parseFloat(b.dataset.rating || 0);
            const dateA = new Date(a.dataset.date || 0);
            const dateB = new Date(b.dataset.date || 0);

            switch (sortBy) {
                case 'price-asc':
                    return priceA - priceB;
                case 'price-desc':
                    return priceB - priceA;
                case 'rating':
                    return ratingB - ratingA;
                case 'newest':
                    return dateB - dateA;
                default:
                    return 0;
            }
        });

        // Очищаем контейнер и добавляем отфильтрованные и отсортированные элементы
        productsContainer.innerHTML = '';
        filteredProducts.forEach(product => {
            productsContainer.appendChild(product);
        });
    }

    // Обработчики событий для фильтрации и сортировки
    const priceRange = document.getElementById('price-range');
    if (priceRange) {
        priceRange.addEventListener('input', () => {
            const maxPriceDisplay = document.getElementById('max-price');
            if (maxPriceDisplay) maxPriceDisplay.textContent = `${priceRange.value.toLocaleString()} ₽`;
            filterProducts();
        });
    }

    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', filterProducts);
    }

    const brandButtons = document.querySelectorAll('.brand-button');
    brandButtons.forEach(button => {
        button.addEventListener('click', () => {
            brandButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterProducts();
        });
    });

    // Избранное
    const favoriteButtons = document.querySelectorAll('.favorite-button');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('active');
            const productCard = button.closest('.product-card');
            const productId = productCard.dataset.id;

            if (button.classList.contains('active')) {
                addToFavorites(productId);
                showNotification('Товар добавлен в избранное', 'success');
            } else {
                removeFromFavorites(productId);
                showNotification('Товар удален из избранного', 'info');
            }
        });
    });

    // Сравнение товаров
    const compareButtons = document.querySelectorAll('.compare-button');
    const comparisonContainer = document.querySelector('.comparison-container');
    const comparisonTable = document.querySelector('.comparison-table tbody');
    const closeComparison = document.querySelector('.close-comparison');
    let productsToCompare = [];

    compareButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.product-card');
            const productId = productCard.dataset.id;

            if (productsToCompare.includes(productId)) {
                productsToCompare = productsToCompare.filter(id => id !== productId);
                button.textContent = 'Сравнить';
            } else {
                if (productsToCompare.length < 2) {
                    productsToCompare.push(productId);
                    button.textContent = 'Убрать из сравнения';
                } else {
                    showNotification('Можно сравнить только 2 товара', 'error');
                    return;
                }
            }

            if (productsToCompare.length === 2) {
                showComparison(productsToCompare);
            } else {
                comparisonContainer.style.display = 'none';
            }
        });
    });

    // Закрытие окна сравнения
    if (closeComparison) {
        closeComparison.addEventListener('click', () => {
            comparisonContainer.style.display = 'none';
            productsToCompare = [];
            compareButtons.forEach(button => {
                button.textContent = 'Сравнить';
            });
        });
    }

    // Функция отображения сравнения
    async function showComparison(productIds) {
        try {
            const products = await Promise.all(
                productIds.map(id => fetchProductDetails(id))
            );

            comparisonTable.innerHTML = '';

            // Добавление характеристик для сравнения
            const characteristics = [
                { name: 'Бренд', key: 'brand' },
                { name: 'Модель', key: 'model' },
                { name: 'Цена', key: 'price' },
                { name: 'Рейтинг', key: 'rating' },
                { name: 'Материал корпуса', key: 'caseMaterial' },
                { name: 'Механизм', key: 'movement' },
                { name: 'Водонепроницаемость', key: 'waterResistance' }
            ];

            characteristics.forEach(char => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${char.name}</td>
                    <td>${products[0][char.key]}</td>
                    <td>${products[1][char.key]}</td>
                `;
                comparisonTable.appendChild(row);
            });

            comparisonContainer.style.display = 'block';
        } catch (error) {
            showNotification('Ошибка при загрузке данных для сравнения', 'error');
        }
    }

    // API запросы
    async function fetchProductDetails(productId) {
        try {
            const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.PRODUCT_DETAILS.replace(':id', productId)}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching product details:', error);
            throw error;
        }
    }

    async function addToFavorites(productId) {
        try {
            const response = await fetch('/api/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId })
            });
            if (!response.ok) throw new Error('Ошибка добавления в избранное');
            return await response.json();
        } catch (error) {
            console.error('Ошибка:', error);
            throw error;
        }
    }

    async function removeFromFavorites(productId) {
        try {
            const response = await fetch(`/api/favorites/${productId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Ошибка удаления из избранного');
            return await response.json();
        } catch (error) {
            console.error('Ошибка:', error);
            throw error;
        }
    }

    // Webhook обработчик
    window.addEventListener('message', event => {
        if (event.data.type === 'orderStatusUpdate') {
            showNotification(`Статус заказа #${event.data.orderId} обновлен: ${event.data.status}`, 'info');
        } else if (event.data.type === 'newReview') {
            showNotification(`Новый отзыв о товаре ${event.data.productName}`, 'info');
        }
    });

    // После DOMContentLoaded, если это каталог, выставляю максимальную цену и вызываю filterProducts с задержкой
    if (window.location.pathname.includes('catalog.html')) {
        setTimeout(() => {
            const productsContainer = document.querySelector('.product-grid') || document.querySelector('.catalog-grid');
            if (!productsContainer) return;
            const productCards = Array.from(productsContainer.children).filter(el => el.classList.contains('product-card'));
            if (productCards.length > 0) {
                // Найти максимальную цену
                let maxPrice = Math.max(...productCards.map(card => parseInt(card.dataset.price || card.querySelector('.price').textContent.replace(/[^\d]/g, ''))));
                // Установить максимальное значение ползунка
                const priceRange = document.getElementById('price-range');
                const maxPriceDisplay = document.getElementById('max-price');
                if (priceRange) {
                    priceRange.max = maxPrice;
                    priceRange.value = maxPrice;
                }
                if (maxPriceDisplay) {
                    maxPriceDisplay.textContent = `${maxPrice.toLocaleString()} ₽`;
                }
            }
            filterProducts();
        }, 100); // небольшая задержка, чтобы DOM успел отрисоваться
    }
});

// API endpoints
const API = {
    BASE_URL: 'https://api.luxurywatches.com/v1',
    ENDPOINTS: {
        PRODUCTS: '/products',
        PRODUCT_DETAILS: '/products/:id',
        ORDERS: '/orders',
        PROFILE: '/profile',
        ORDER_HISTORY: '/orders/history',
        FAVORITES: '/favorites',
        REVIEWS: '/reviews',
        RECOMMENDATIONS: '/recommendations',
        CART: '/cart',
        ORDER_STATUS: '/orders/:id/status'
    }
};

// API requests
async function fetchProducts(params = {}) {
    try {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.PRODUCTS}?${queryString}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

async function fetchProductDetails(productId) {
    try {
        const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.PRODUCT_DETAILS.replace(':id', productId)}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching product details:', error);
        throw error;
    }
}

async function createOrder(orderData) {
    try {
        const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.ORDERS}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        return await response.json();
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

async function updateProfile(profileData) {
    try {
        const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.PROFILE}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
}

async function fetchOrderHistory() {
    try {
        const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.ORDER_HISTORY}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching order history:', error);
        throw error;
    }
}

async function fetchFavorites() {
    try {
        const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.FAVORITES}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching favorites:', error);
        throw error;
    }
}

async function submitReview(reviewData) {
    try {
        const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.REVIEWS}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
        });
        return await response.json();
    } catch (error) {
        console.error('Error submitting review:', error);
        throw error;
    }
}

async function fetchRecommendations() {
    try {
        const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.RECOMMENDATIONS}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        throw error;
    }
}

async function updateCart(cartData) {
    try {
        const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.CART}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cartData)
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating cart:', error);
        throw error;
    }
}

async function checkOrderStatus(orderId) {
    try {
        const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.ORDER_STATUS.replace(':id', orderId)}`);
        return await response.json();
    } catch (error) {
        console.error('Error checking order status:', error);
        throw error;
    }
}

// New functions
function filterProductsByPrice(minPrice, maxPrice) {
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        const price = parseFloat(product.querySelector('.price').textContent.replace('$', '').replace(',', ''));
        if (price >= minPrice && price <= maxPrice) {
            product.style.display = '';
        } else {
            product.style.display = 'none';
        }
    });
}

function toggleFavorite(productId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.indexOf(productId);

    if (index === -1) {
        favorites.push(productId);
        showNotification('Товар добавлен в избранное');
    } else {
        favorites.splice(index, 1);
        showNotification('Товар удален из избранного');
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButton(productId);
}

function submitProductReview(productId, rating, comment) {
    const review = {
        productId,
        rating,
        comment,
        date: new Date().toISOString()
    };

    const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
    if (!reviews[productId]) {
        reviews[productId] = [];
    }
    reviews[productId].push(review);
    localStorage.setItem('reviews', JSON.stringify(reviews));

    showNotification('Отзыв успешно добавлен');
}

function filterByBrand(brand) {
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        const productBrand = product.dataset.brand;
        product.style.display = productBrand === brand ? '' : 'none';
    });
}

function applyDiscount(productId, discountPercentage) {
    const product = document.querySelector(`[data-product-id="${productId}"]`);
    if (product) {
        const priceElement = product.querySelector('.price');
        const originalPrice = parseFloat(priceElement.dataset.originalPrice || priceElement.textContent.replace('$', '').replace(',', ''));
        const discountedPrice = originalPrice * (1 - discountPercentage / 100);
        priceElement.textContent = `$${discountedPrice.toFixed(2)}`;
        priceElement.dataset.originalPrice = originalPrice;
    }
}

function updateProductRating(productId) {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
    const productReviews = reviews[productId] || [];

    if (productReviews.length > 0) {
        const averageRating = productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length;
        const ratingElement = document.querySelector(`[data-product-id="${productId}"] .rating`);
        if (ratingElement) {
            ratingElement.textContent = `★ ${averageRating.toFixed(1)}`;
        }
    }
}

function getProductRecommendations(productId) {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
    const viewedProducts = JSON.parse(localStorage.getItem('viewedProducts')) || [];

    // Простой алгоритм рекомендаций на основе просмотренных товаров
    const recommendations = viewedProducts
        .filter(id => id !== productId)
        .slice(0, 4);

    return recommendations;
}

function compareProducts(productIds) {
    const products = productIds.map(id => document.querySelector(`[data-product-id="${id}"]`));
    const comparisonContainer = document.createElement('div');
    comparisonContainer.className = 'comparison-container';

    const comparisonTable = document.createElement('table');
    comparisonTable.innerHTML = `
        <tr>
            <th>Характеристика</th>
            ${products.map(p => `<th>${p.querySelector('h3').textContent}</th>`).join('')}
        </tr>
        <tr>
            <td>Цена</td>
            ${products.map(p => `<td>${p.querySelector('.price').textContent}</td>`).join('')}
        </tr>
        <tr>
            <td>Рейтинг</td>
            ${products.map(p => `<td>${p.querySelector('.rating')?.textContent || 'Нет оценок'}</td>`).join('')}
        </tr>
    `;

    comparisonContainer.appendChild(comparisonTable);
    document.body.appendChild(comparisonContainer);
}

// Webhook handler
const webhookHandler = {
    events: {},

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    },

    trigger(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
};

// Глобальные переменные
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Делаем функцию addToCart глобальной
window.addToCart = function (button) {
    console.log('Add to cart button clicked:', button);

    const productCard = button.closest('.product-card');
    if (!productCard) {
        console.log('Product card not found');
        return;
    }
    console.log('Product card found:', productCard);

    const product = {
        id: productCard.dataset.id,
        name: productCard.querySelector('h3').textContent,
        price: productCard.querySelector('.price').textContent,
        image: productCard.querySelector('img').src,
        brand: productCard.dataset.brand,
        quantity: 1
    };
    console.log('Product data:', product);

    // Проверяем, есть ли уже такой товар в корзине
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    if (existingProductIndex === -1) {
        // Если товара нет в корзине, добавляем его
        cart.push(product);
    } else {
        // Если товар уже есть, увеличиваем количество
        cart[existingProductIndex].quantity = (cart[existingProductIndex].quantity || 1) + 1;
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`Товар "${product.name}" добавлен в корзину (${cart[existingProductIndex]?.quantity || 1} шт.)`, 'success');
};

// Функция обновления корзины на сервере
async function updateCartOnServer(product) {
    try {
        const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.CART}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });
        if (!response.ok) throw new Error('Ошибка обновления корзины');
    } catch (error) {
        console.error('Ошибка при обновлении корзины на сервере:', error);
    }
}

// Функция обновления счетчика корзины
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        // Считаем общее количество товаров с учетом quantity
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCount.textContent = totalItems;
        console.log('Cart count updated:', totalItems);
    } else {
        console.log('Cart count element not found');
    }
}

// Функция показа уведомлений
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Функция отображения корзины
function displayCart() {
    const cartItems = document.querySelector('.cart-items');
    const subtotalElement = document.querySelector('.subtotal');
    const shippingElement = document.querySelector('.shipping');
    const totalElement = document.querySelector('.total-amount');

    if (!cartItems) return;

    cartItems.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        const price = parseFloat(item.price.replace(/[^\d]/g, ''));
        const quantity = item.quantity || 1;
        const itemTotal = price * quantity;
        subtotal += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="price">${item.price} x ${quantity} шт.</p>
                <div class="quantity-controls">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <span class="quantity">${quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                </div>
                <p class="item-total">Итого: ${itemTotal.toLocaleString()} ₽</p>
            </div>
            <button class="remove-item" data-index="${index}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(cartItem);
    });

    const shipping = subtotal > 0 ? 1000 : 0; // Доставка 1000 рублей
    const total = subtotal + shipping;

    if (subtotalElement) subtotalElement.textContent = `${subtotal.toLocaleString()} ₽`;
    if (shippingElement) shippingElement.textContent = `${shipping.toLocaleString()} ₽`;
    if (totalElement) totalElement.textContent = `${total.toLocaleString()} ₽`;

    // Добавляем обработчики для кнопок изменения количества
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function () {
            const index = this.dataset.index;
            if (this.classList.contains('plus')) {
                cart[index].quantity = (cart[index].quantity || 1) + 1;
            } else if (this.classList.contains('minus')) {
                if (cart[index].quantity > 1) {
                    cart[index].quantity = cart[index].quantity - 1;
                } else {
                    // Если количество становится 0, удаляем товар из корзины
                    cart.splice(index, 1);
                }
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
            updateCartCount();
        });
    });

    // Добавляем обработчики для кнопок удаления
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function () {
            const index = this.dataset.index;
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
            updateCartCount();
            showNotification('Товар удален из корзины', 'info');
        });
    });
}

// Функция очистки корзины (для отладки)
function clearCart() {
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount();
    console.log('Cart cleared');
}

// Добавляем обработчик изменения сортировки
document.addEventListener('DOMContentLoaded', function () {
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', function () {
            filterProducts();
        });
    }
}); 