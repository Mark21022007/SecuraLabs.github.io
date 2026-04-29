document.addEventListener('DOMContentLoaded', () => {

    /* ======================================================================
       1. Mobile Menu Toggle
       ====================================================================== */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavSheet = document.getElementById('mobile-nav-sheet');

    if (mobileMenuBtn && mobileNavSheet) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            mobileNavSheet.classList.toggle('hidden');
            
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileNavSheet.classList.contains('hidden')) {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            } else {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            }
        });
    }

    /* ======================================================================
       2. Shopping Cart Functionality
       ====================================================================== */
    const cartIconBtn = document.getElementById('cart-icon-btn');
    const mobileCartIconBtn = document.getElementById('mobile-cart-icon-btn');
    const cartDrawer = document.getElementById('cart-drawer');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartOverlay = document.getElementById('cart-overlay');
    
    const cartCounter = document.getElementById('cart-counter');
    const mobileCartCounter = document.getElementById('mobile-cart-counter');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSubtotalEl = document.getElementById('cart-subtotal');
    
    let cart = JSON.parse(localStorage.getItem('securaCart')) || [];
    // Normalize existing cart items to ensure they have a quantity
    cart = cart.map(item => ({ ...item, quantity: item.quantity || 1 }));

    function saveCart() {
        localStorage.setItem('securaCart', JSON.stringify(cart));
    }

    function updateCartUI() {
        let cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        let subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

        [cartCounter, mobileCartCounter].forEach(counter => {
            if (counter) {
                counter.textContent = cartCount;
                if (cartCount > 0) {
                    counter.classList.remove('hidden'); 
                } else {
                    counter.classList.add('hidden');
                }
            }
        });

        if (cartCount === 0 && cartItemsContainer) {
            cartItemsContainer.innerHTML = '<p class="text-gray-500 italic text-center mt-10">Your cart is currently empty.</p>';
        } else if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            cart.forEach((item, index) => {
                const itemRow = document.createElement('div');
                itemRow.className = 'flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4';
                itemRow.innerHTML = `
                    <div class="flex-1 pr-4">
                        <h4 class="font-bold text-gray-800 dark:text-white text-sm mb-2">${item.productName}</h4>
                        <div class="flex items-center space-x-3">
                            <div class="flex items-center border border-gray-200 dark:border-gray-600 rounded">
                                <button class="decrease-qty px-2 py-0.5 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition" data-index="${index}">
                                    <i class="fa-solid fa-minus text-xs"></i>
                                </button>
                                <span class="text-xs font-semibold px-2 w-6 text-center dark:text-white">${item.quantity}</span>
                                <button class="increase-qty px-2 py-0.5 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition" data-index="${index}">
                                    <i class="fa-solid fa-plus text-xs"></i>
                                </button>
                            </div>
                            <button class="remove-item text-gray-400 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition text-sm" data-index="${index}" title="Remove item">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                    <div class="font-bold text-securaPurple dark:text-purple-300 whitespace-nowrap">$${(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
                `;
                cartItemsContainer.appendChild(itemRow);
            });
        }
        
        if (cartSubtotalEl) {
            cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        }
    }

    // Add event delegation for cart buttons
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            
            const index = parseInt(btn.getAttribute('data-index'), 10);
            if (isNaN(index)) return;

            if (btn.classList.contains('increase-qty')) {
                cart[index].quantity++;
                saveCart();
                updateCartUI();
            } else if (btn.classList.contains('decrease-qty')) {
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    cart.splice(index, 1);
                }
                saveCart();
                updateCartUI();
            } else if (btn.classList.contains('remove-item')) {
                cart.splice(index, 1);
                saveCart();
                updateCartUI();
            }
        });
    }

    // Initialize UI
    updateCartUI();

    const toggleCart = (e) => {
        if(e) e.preventDefault();
        if (cartDrawer) cartDrawer.classList.toggle('hidden');
        if (cartOverlay) cartOverlay.classList.toggle('hidden');
    };

    if (cartIconBtn) cartIconBtn.addEventListener('click', toggleCart);
    if (mobileCartIconBtn) mobileCartIconBtn.addEventListener('click', toggleCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    window.addToCart = function(productName, price) {
        const existingItem = cart.find(item => item.productName === productName && item.price === price);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({productName, price, quantity: 1});
        }
        
        saveCart();
        updateCartUI();

        [cartCounter, mobileCartCounter].forEach(counter => {
            if (counter && !counter.classList.contains('hidden')) {
                counter.classList.add('animate-bounce');
                setTimeout(() => counter.classList.remove('animate-bounce'), 1000);
            }
        });

        if(cartDrawer && cartDrawer.classList.contains('hidden')) {
            toggleCart();
        }
    };

    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            let product = btn.getAttribute('data-product') || 'Ki-Liner Product';
            const price = btn.getAttribute('data-price') || '0.00';
            
            const sizeTargetId = btn.getAttribute('data-size-target');
            if (sizeTargetId) {
                const sizeSelect = document.getElementById(sizeTargetId);
                if (sizeSelect) {
                    const selectedSize = sizeSelect.value;
                    product += ` (${selectedSize})`;
                }
            }

            addToCart(product, price);
        });
    });

    /* ======================================================================
       3. Contact Form Submission
       ====================================================================== */
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const successMessage = document.getElementById('contact-success-message');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();

            if (name === "" || email === "") {
                alert("Please provide both your Name and Email address.");
                return;
            }

            contactForm.classList.add('hidden');
            
            if (successMessage) {
                successMessage.innerHTML = `<i class="fa-solid fa-circle-check text-3xl mb-3 text-securaPurple"></i><br/>Thank you for contacting SecuraLabs, ${name}. Our team in São Paulo will get back to you shortly regarding your inquiry.`;
                successMessage.classList.remove('hidden');
            }
        });
    }

    /* ======================================================================
       4. Smooth Scrolling for In-Page Anchors
       ====================================================================== */
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#' || targetId === '#cart') return; 

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                if (mobileNavSheet && !mobileNavSheet.classList.contains('hidden')) {
                    mobileNavSheet.classList.add('hidden');
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    /* ======================================================================
       5. Dark Mode Toggle
       ====================================================================== */
    const darkModeToggleBtns = document.querySelectorAll('.dark-mode-toggle');
    
    const updateDarkModeIcons = () => {
        const isDark = document.documentElement.classList.contains('dark');
        darkModeToggleBtns.forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon) {
                if (isDark) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            }
        });
    };

    darkModeToggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            document.documentElement.classList.toggle('dark');
            const isDark = document.documentElement.classList.contains('dark');
            try {
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            } catch (err) {}
            updateDarkModeIcons();
        });
    });

    // Initialize icons on load
    updateDarkModeIcons();

    /* ======================================================================
       6. Local File Theme Persistence Fallback
       ====================================================================== */
    document.addEventListener('click', (e) => {
        const a = e.target.closest('a');
        if (a && a.href && a.href.includes('.html') && !a.href.includes('#')) {
            try {
                const url = new URL(a.href, window.location.href);
                if (url.origin === window.location.origin || url.protocol === 'file:') {
                    const isDark = document.documentElement.classList.contains('dark');
                    url.searchParams.set('theme', isDark ? 'dark' : 'light');
                    e.preventDefault();
                    window.location.href = url.toString();
                }
            } catch (err) {}
        }
    });

    // Initialize icons on load
    updateDarkModeIcons();

});
