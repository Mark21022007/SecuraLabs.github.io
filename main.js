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

    function updateCartUI() {
        let cartCount = cart.length;
        let subtotal = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);

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
            cart.forEach(item => {
                const itemRow = document.createElement('div');
                itemRow.className = 'flex justify-between items-center border-b border-gray-100 pb-4';
                itemRow.innerHTML = `
                    <div>
                        <h4 class="font-bold text-gray-800 text-sm">${item.productName}</h4>
                        <span class="text-xs text-gray-500">Qty: 1</span>
                    </div>
                    <div class="font-bold text-securaPurple">$${item.price}</div>
                `;
                cartItemsContainer.appendChild(itemRow);
            });
        }
        
        if (cartSubtotalEl) {
            cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        }
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
        cart.push({productName, price});
        localStorage.setItem('securaCart', JSON.stringify(cart));
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
});
