document.addEventListener('DOMContentLoaded', () => {

    const revealTargets = document.querySelectorAll('section > div, .premium-card, .image-shell');
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        revealTargets.forEach(target => target.classList.add('reveal'));
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12 });
        revealTargets.forEach(target => revealObserver.observe(target));
    }

    /* ======================================================================
       0. Scroll-Bound Canvas Image Sequence (Apple Style)
       ====================================================================== */
    const scrollCanvas = document.getElementById('scroll-canvas');
    const scrollVideoSection = document.getElementById('scroll-video-section');

    if (scrollCanvas && scrollVideoSection && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const ctx = scrollCanvas.getContext('2d');
        const frameCount = 426; 
        const images = [];
        let imagesLoaded = 0;
        
        // Set fixed dimensions based on your video aspect ratio
        scrollCanvas.width = 1920; 
        scrollCanvas.height = 1080;

        const currentFrame = index => `img/sequence/frame_${index.toString().padStart(4, '0')}.jpg`;
        
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            img.onload = () => {
                imagesLoaded++;
                if (i === 0) {
                    ctx.drawImage(img, 0, 0, scrollCanvas.width, scrollCanvas.height);
                }
            };
            images.push(img);
        }

        let targetFrame = 0;
        let currentFrameIndex = 0;
        const ease = 0.04; // Lower number means smoother, "floatier" interpolation

        const renderCanvasFrame = () => {
            if (imagesLoaded > 10) { // Start rendering if we have some frames
                const rect = scrollVideoSection.getBoundingClientRect();
                const scrollRange = rect.height - window.innerHeight;
                
                let progress = -rect.top / scrollRange;
                progress = Math.max(0, Math.min(1, progress));
                
                targetFrame = progress * (frameCount - 1);
                currentFrameIndex += (targetFrame - currentFrameIndex) * ease;
                
                const frameToDraw = Math.round(currentFrameIndex);
                if (images[frameToDraw] && images[frameToDraw].complete && images[frameToDraw].naturalWidth > 0) {
                    ctx.drawImage(images[frameToDraw], 0, 0, scrollCanvas.width, scrollCanvas.height);
                }
            }
            requestAnimationFrame(renderCanvasFrame);
        };
        
        requestAnimationFrame(renderCanvasFrame);
    }

    /* ======================================================================
       1. Mobile Menu Toggle
       ====================================================================== */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavSheet = document.getElementById('mobile-nav-sheet');

    if (mobileMenuBtn && mobileNavSheet) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            mobileNavSheet.classList.toggle('hidden');
            const isOpen = !mobileNavSheet.classList.contains('hidden');
            mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
            mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
            mobileNavSheet.setAttribute('aria-hidden', String(!isOpen));
            
            const icon = mobileMenuBtn.querySelector('i');
            if (!isOpen) {
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
                                <button class="decrease-qty px-2 py-0.5 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition" aria-label="Decrease quantity" data-index="${index}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus"><path d="M5 12h14"/></svg>
                                </button>
                                <span class="text-xs font-semibold px-2 w-6 text-center dark:text-white" aria-live="polite">${item.quantity}</span>
                                <button class="increase-qty px-2 py-0.5 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition" aria-label="Increase quantity" data-index="${index}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                                </button>
                            </div>
                            <button class="remove-item text-gray-400 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition text-sm" aria-label="Remove item" data-index="${index}" title="Remove item">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
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

    const cartToggleButtons = [cartIconBtn, mobileCartIconBtn].filter(Boolean);

    const setCartOpen = (isOpen) => {
        if (cartDrawer) {
            cartDrawer.classList.toggle('hidden', !isOpen);
            cartDrawer.setAttribute('aria-hidden', String(!isOpen));
        }
        if (cartOverlay) {
            cartOverlay.classList.toggle('hidden', !isOpen);
        }
        cartToggleButtons.forEach(btn => {
            btn.setAttribute('aria-expanded', String(isOpen));
            btn.setAttribute('aria-label', isOpen ? 'Close cart' : 'Open cart');
        });
    };

    const toggleCart = (e) => {
        if(e) e.preventDefault();
        const isOpen = cartDrawer ? cartDrawer.classList.contains('hidden') : false;
        setCartOpen(isOpen);
    };

    if (cartIconBtn) cartIconBtn.addEventListener('click', toggleCart);
    if (mobileCartIconBtn) mobileCartIconBtn.addEventListener('click', toggleCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        const checkoutHTML = `
        <div id="checkout-modal" class="hidden fixed inset-0 bg-black/50 z-[70] items-center justify-center px-4 py-8 backdrop-blur-sm">
            <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
                <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div>
                        <p class="text-xs font-bold tracking-widest uppercase text-securaCoral mb-1">Order request</p>
                        <h3 class="text-2xl font-bold text-securaDark dark:text-white">Complete Your Order</h3>
                    </div>
                    <button id="close-checkout-btn" type="button" class="text-gray-400 hover:text-securaCoral text-2xl" aria-label="Close checkout">&times;</button>
                </div>

                <div id="checkout-form-view" class="overflow-y-auto">
                    <form id="checkout-form" class="grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-0">
                        <div class="p-6 space-y-6">
                            <div class="rounded-xl border border-purple-100 bg-purple-50 dark:bg-gray-800 dark:border-gray-700 p-4 text-sm text-gray-700 dark:text-gray-300">
                                SecuraLabs reviews each request before confirming availability, payment, and fulfillment details.
                            </div>

                            <div>
                                <h4 class="font-bold text-securaDark dark:text-white mb-4">Contact</h4>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label for="checkout-name" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full name</label>
                                        <input id="checkout-name" name="name" type="text" required autocomplete="name" class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base focus:outline-none focus:border-securaPurple focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-securaPurple bg-white dark:bg-gray-800 dark:text-white">
                                    </div>
                                    <div>
                                        <label for="checkout-email" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                        <input id="checkout-email" name="email" type="email" required autocomplete="email" class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base focus:outline-none focus:border-securaPurple focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-securaPurple bg-white dark:bg-gray-800 dark:text-white">
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 class="font-bold text-securaDark dark:text-white mb-4">Shipping</h4>
                                <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
                                    <div class="md:col-span-6">
                                        <label for="checkout-address" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Address</label>
                                        <input id="checkout-address" name="address" type="text" required autocomplete="shipping street-address" class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base focus:outline-none focus:border-securaPurple focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-securaPurple bg-white dark:bg-gray-800 dark:text-white">
                                    </div>
                                    <div class="md:col-span-3">
                                        <label for="checkout-city" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">City</label>
                                        <input id="checkout-city" name="city" type="text" required autocomplete="shipping address-level2" class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base focus:outline-none focus:border-securaPurple focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-securaPurple bg-white dark:bg-gray-800 dark:text-white">
                                    </div>
                                    <div class="md:col-span-1">
                                        <label for="checkout-state" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">State</label>
                                        <input id="checkout-state" name="state" type="text" required maxlength="2" autocomplete="shipping address-level1" class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base focus:outline-none focus:border-securaPurple focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-securaPurple bg-white dark:bg-gray-800 dark:text-white uppercase">
                                    </div>
                                    <div class="md:col-span-2">
                                        <label for="checkout-zip" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">ZIP code</label>
                                        <input id="checkout-zip" name="zip" type="text" required inputmode="numeric" autocomplete="shipping postal-code" class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base focus:outline-none focus:border-securaPurple focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-securaPurple bg-white dark:bg-gray-800 dark:text-white">
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 class="font-bold text-securaDark dark:text-white mb-4">Order Type</h4>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <label class="flex items-start gap-3 p-4 border border-securaPurple bg-purple-50 dark:bg-gray-800 dark:border-securaPurple rounded-xl cursor-pointer">
                                        <input type="radio" name="payment" value="Direct order" checked class="mt-1 accent-securaPurple">
                                        <span>
                                            <span class="block font-semibold text-securaDark dark:text-white">Direct order</span>
                                            <span class="block text-sm text-gray-600 dark:text-gray-400">For individual and small-pack requests.</span>
                                        </span>
                                    </label>
                                    <label class="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer">
                                        <input type="radio" name="payment" value="Venue invoice" class="mt-1 accent-securaPurple">
                                        <span>
                                            <span class="block font-semibold text-securaDark dark:text-white">Venue invoice</span>
                                            <span class="block text-sm text-gray-600 dark:text-gray-400">For bulk or institutional orders.</span>
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <aside class="bg-securaLight dark:bg-gray-800/70 p-6 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-gray-800">
                            <h4 class="font-bold text-securaDark dark:text-white mb-4">Order Summary</h4>
                            <div id="checkout-items" class="space-y-4 mb-6"></div>
                            <div class="space-y-3 text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
                                <div class="flex justify-between text-gray-600 dark:text-gray-300">
                                    <span>Subtotal</span>
                                    <span id="checkout-subtotal">$0.00</span>
                                </div>
                                <div class="flex justify-between text-gray-600 dark:text-gray-300">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div class="flex justify-between text-lg font-bold text-securaDark dark:text-white border-t border-gray-200 dark:border-gray-700 pt-3">
                                    <span>Total</span>
                                    <span id="checkout-total">$0.00</span>
                                </div>
                            </div>
                            <button type="submit" id="checkout-submit-btn" class="btn-primary mt-6 w-full relative">
                                <span class="btn-text">Submit Order Request</span>
                                <svg class="btn-spinner hidden animate-spin absolute w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </button>
                            <button id="back-to-cart-btn" type="button" class="btn-secondary mt-3 w-full">Back to Cart</button>
                        </aside>
                    </form>
                </div>

                <div id="checkout-success-view" class="hidden p-8 text-center">
                    <div class="w-16 h-16 bg-purple-100 dark:bg-gray-800 text-securaPurple rounded-full flex items-center justify-center mx-auto mb-5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                    <p class="text-xs font-bold tracking-widest uppercase text-securaCoral mb-2">Request received</p>
                    <h3 class="text-3xl font-bold text-securaDark dark:text-white mb-3">Your order request is ready for review.</h3>
                    <p id="checkout-confirmation-text" class="text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-6"></p>
                    <button id="finish-checkout-btn" type="button" class="btn-primary px-8">Done</button>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', checkoutHTML);

        const checkoutModal = document.getElementById('checkout-modal');
        const checkoutForm = document.getElementById('checkout-form');
        const checkoutFormView = document.getElementById('checkout-form-view');
        const checkoutSuccessView = document.getElementById('checkout-success-view');
        const checkoutItems = document.getElementById('checkout-items');
        const checkoutSubtotal = document.getElementById('checkout-subtotal');
        const checkoutTotal = document.getElementById('checkout-total');
        const checkoutConfirmationText = document.getElementById('checkout-confirmation-text');
        const closeCheckoutBtn = document.getElementById('close-checkout-btn');
        const backToCartBtn = document.getElementById('back-to-cart-btn');
        const finishCheckoutBtn = document.getElementById('finish-checkout-btn');

        const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[char]));

        function renderCheckoutSummary() {
            const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
            checkoutItems.innerHTML = cart.map(item => `
                <div class="flex justify-between gap-4 text-sm">
                    <div>
                        <p class="font-semibold text-securaDark dark:text-white">${escapeHtml(item.productName)}</p>
                        <p class="text-gray-500 dark:text-gray-400">Qty ${item.quantity}</p>
                    </div>
                    <p class="font-bold text-securaPurple whitespace-nowrap">$${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                </div>
            `).join('');
            checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
            checkoutTotal.textContent = `$${subtotal.toFixed(2)}`;
        }

        function openCheckout() {
            if (cart.length === 0) {
                return;
            }

            renderCheckoutSummary();
            checkoutFormView.classList.remove('hidden');
            checkoutSuccessView.classList.add('hidden');
            checkoutModal.classList.remove('hidden');
            checkoutModal.classList.add('flex');
            setCartOpen(false);
        }

        function closeCheckout() {
            checkoutModal.classList.add('hidden');
            checkoutModal.classList.remove('flex');
        }

        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCheckout();
        });

        closeCheckoutBtn.addEventListener('click', closeCheckout);
        finishCheckoutBtn.addEventListener('click', closeCheckout);

        backToCartBtn.addEventListener('click', () => {
            closeCheckout();
            setCartOpen(true);
        });

        checkoutModal.addEventListener('click', (e) => {
            if (e.target === checkoutModal) {
                closeCheckout();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !checkoutModal.classList.contains('hidden')) {
                closeCheckout();
            }
        });

        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!checkoutForm.checkValidity()) {
                checkoutForm.reportValidity();
                return;
            }

            const formData = new FormData(checkoutForm);
            const orderNumber = `SEC-${Date.now().toString().slice(-6)}`;
            const name = formData.get('name');
            const email = formData.get('email');

            const submitBtn = document.getElementById('checkout-submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnSpinner = submitBtn.querySelector('.btn-spinner');

            submitBtn.disabled = true;
            btnText.classList.add('opacity-0');
            btnSpinner.classList.remove('hidden');

            setTimeout(() => {
                cart = [];
                saveCart();
                updateCartUI();
                checkoutForm.reset();
                checkoutConfirmationText.textContent = `Order request ${orderNumber} was created for ${name}. SecuraLabs will follow up at ${email} with availability and next steps.`;
                checkoutFormView.classList.add('hidden');
                checkoutSuccessView.classList.remove('hidden');
                
                // Reset button state for future
                submitBtn.disabled = false;
                btnText.classList.remove('opacity-0');
                btnSpinner.classList.add('hidden');
            }, 1200);
        });
    }

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

            const submitBtn = document.getElementById('contact-submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnSpinner = submitBtn.querySelector('.btn-spinner');

            submitBtn.disabled = true;
            btnText.classList.add('opacity-0');
            btnSpinner.classList.remove('hidden');

            setTimeout(() => {
                contactForm.classList.add('hidden');
                
                if (successMessage) {
                    successMessage.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-3 text-securaPurple lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg><br/><span></span>';
                    successMessage.querySelector('span').textContent = `Thank you for contacting SecuraLabs, ${name}. Our team in Sao Paulo will get back to you shortly regarding your inquiry.`;
                    successMessage.classList.remove('hidden');
                    successMessage.focus();
                }
            }, 1200);
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
                    mobileNavSheet.setAttribute('aria-hidden', 'true');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    mobileMenuBtn.setAttribute('aria-label', 'Open menu');
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
                    btn.setAttribute('aria-label', 'Switch to light mode');
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                    btn.setAttribute('aria-label', 'Switch to dark mode');
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
