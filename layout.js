(() => {
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        @keyframes securaNavDrop {
            from { opacity: 0; transform: translateY(-14px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .site-nav {
            animation: securaNavDrop 480ms ease-out both;
        }

        .site-nav-inner {
            transition: height 220ms ease, transform 220ms ease;
        }

        .site-nav.is-scrolled {
            box-shadow: 0 14px 32px rgba(31, 41, 55, 0.10);
        }

        .site-nav.is-scrolled .site-nav-inner {
            height: 4rem;
        }

        .site-nav-logo {
            transition: transform 220ms ease, height 220ms ease;
        }

        .site-nav.is-scrolled .site-nav-logo {
            height: 2.5rem;
        }

        .nav-link {
            position: relative;
            display: inline-flex;
            align-items: center;
        }

        .nav-link::after {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            bottom: -0.45rem;
            height: 2px;
            border-radius: 999px;
            background: #875cb6;
            transform: scaleX(0);
            transform-origin: center;
            transition: transform 180ms ease;
        }

        .nav-link:hover::after,
        .nav-link[aria-current="page"]::after {
            transform: scaleX(1);
        }

        .icon-nav-btn {
            transition: transform 180ms ease, color 180ms ease;
        }

        .icon-nav-btn:hover {
            transform: translateY(-2px);
        }

        #mobile-nav-sheet {
            animation: securaNavDrop 220ms ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
            .site-nav,
            #mobile-nav-sheet {
                animation: none;
            }

            .site-nav-inner,
            .site-nav-logo,
            .nav-link::after,
            .icon-nav-btn {
                transition: none;
            }
        }
    `;
    document.head.appendChild(animationStyle);

    const pages = [
        { href: 'index.html', label: 'Home', key: 'index' },
        { href: 'about.html', label: 'About Us', key: 'about' },
        { href: 'shop.html', label: 'Shop', key: 'shop' },
        { href: 'faq.html', label: 'FAQ', key: 'faq' },
        { href: 'contact.html', label: 'Contact', key: 'contact' }
    ];

    const currentFile = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const activeKey = pages.find(page => page.href === currentFile)?.key || '';
    const activeLinkClass = 'nav-link text-securaPurple font-medium transition';
    const linkClass = 'nav-link text-gray-600 dark:text-gray-300 hover:text-securaPurple dark:hover:text-securaPurple font-medium transition';
    const mobileActiveClass = 'text-securaPurple border-b dark:border-gray-800 pb-4';
    const mobileLinkClass = 'text-gray-800 dark:text-gray-200 hover:text-securaPurple border-b dark:border-gray-800 pb-4';

    const desktopLinks = pages.map(page => `
        <a href="${page.href}" class="${page.key === activeKey ? activeLinkClass : linkClass}" ${page.key === activeKey ? 'aria-current="page"' : ''}>${page.label}</a>
    `).join('');

    const mobileLinks = pages.map(page => `
        <a href="${page.href}" class="${page.key === activeKey ? mobileActiveClass : mobileLinkClass}" ${page.key === activeKey ? 'aria-current="page"' : ''}>${page.label}</a>
    `).join('');

    const headerRoot = document.getElementById('site-header');
    if (headerRoot) {
        headerRoot.innerHTML = `
            <nav id="site-nav" class="site-nav fixed w-full z-50 glass-nav dark:bg-gray-900/95 shadow-sm border-b border-gray-100 dark:border-gray-800 transition-colors duration-300" aria-label="Primary navigation">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="site-nav-inner flex justify-between items-center h-20">
                        <div class="flex-shrink-0 flex items-center cursor-pointer">
                            <a href="index.html" class="flex items-center" aria-label="SecuraLabs home">
                                <img src="img/secura-fulllogo.webp" alt="SecuraLabs Logo" width="900" height="344" class="site-nav-logo h-12 w-auto object-contain">
                            </a>
                        </div>

                        <div class="hidden md:flex space-x-8 items-center">
                            ${desktopLinks}

                            <button type="button" class="dark-mode-toggle icon-nav-btn text-gray-600 dark:text-gray-300 hover:text-securaPurple transition relative" aria-label="Switch to dark mode">
                                <i class="fa-solid fa-moon text-xl" aria-hidden="true"></i>
                            </button>

                            <button type="button" id="cart-icon-btn" class="icon-nav-btn text-gray-600 dark:text-gray-300 hover:text-securaCoral transition relative" aria-label="Open cart" aria-controls="cart-drawer" aria-expanded="false">
                                <i class="fa-solid fa-cart-shopping text-xl" aria-hidden="true"></i>
                                <span id="cart-counter" class="hidden absolute -top-2 -right-3 bg-securaCoral text-white text-xs font-bold px-1.5 py-0.5 rounded-full">0</span>
                            </button>
                        </div>

                        <div class="md:hidden flex items-center space-x-6">
                            <button type="button" class="dark-mode-toggle icon-nav-btn text-gray-600 dark:text-gray-300 hover:text-securaPurple transition relative" aria-label="Switch to dark mode">
                                <i class="fa-solid fa-moon text-xl" aria-hidden="true"></i>
                            </button>
                            <button type="button" id="mobile-cart-icon-btn" class="icon-nav-btn text-gray-600 dark:text-gray-300 hover:text-securaCoral transition relative" aria-label="Open cart" aria-controls="cart-drawer" aria-expanded="false">
                                <i class="fa-solid fa-cart-shopping text-xl" aria-hidden="true"></i>
                                <span id="mobile-cart-counter" class="hidden absolute -top-2 -right-3 bg-securaCoral text-white text-xs font-bold px-1.5 py-0.5 rounded-full">0</span>
                            </button>
                            <button type="button" id="mobile-menu-btn" class="icon-nav-btn text-gray-600 dark:text-gray-300 focus:outline-none" aria-label="Open menu" aria-controls="mobile-nav-sheet" aria-expanded="false">
                                <i class="fa-solid fa-bars text-2xl" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div id="mobile-nav-sheet" class="hidden fixed inset-0 z-40 bg-white dark:bg-gray-900 pt-24 px-6 flex flex-col space-y-6 text-lg font-medium shadow-2xl transition-colors duration-300" aria-hidden="true">
                ${mobileLinks}
            </div>
        `;

        const nav = document.getElementById('site-nav');
        const updateNavScroll = () => {
            nav.classList.toggle('is-scrolled', window.scrollY > 12);
        };
        updateNavScroll();
        window.addEventListener('scroll', updateNavScroll, { passive: true });
    }

    const cartRoot = document.getElementById('cart-root');
    if (cartRoot) {
        cartRoot.innerHTML = `
            <div id="cart-drawer" class="hidden fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-[60] flex flex-col border-l border-gray-200 dark:border-gray-800 transition-colors duration-300" aria-hidden="true" aria-label="Shopping cart">
                <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-securaLight dark:bg-gray-800">
                    <h2 class="text-xl font-bold text-securaDark dark:text-white">Your Cart</h2>
                    <button id="close-cart-btn" type="button" class="text-gray-400 hover:text-securaCoral text-2xl" aria-label="Close cart">&times;</button>
                </div>
                <div id="cart-items-container" class="p-6 flex-grow overflow-y-auto flex flex-col space-y-4">
                    <p class="text-gray-500 dark:text-gray-400 italic text-center mt-10">Your cart is currently empty.</p>
                </div>
                <div class="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                    <div class="flex justify-between mb-4 font-bold text-lg dark:text-white">
                        <span>Subtotal</span>
                        <span id="cart-subtotal">$0.00</span>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">Order requests are reviewed by SecuraLabs before payment and fulfillment.</p>
                    <button id="checkout-btn" type="button" class="w-full bg-securaPurple text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition shadow">Request Checkout</button>
                </div>
            </div>
            <div id="cart-overlay" class="hidden fixed inset-0 bg-black bg-opacity-30 z-[55]"></div>
        `;
    }

    const footerRoot = document.getElementById('site-footer');
    if (footerRoot) {
        footerRoot.innerHTML = `
            <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12 transition-colors duration-300">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                    <div class="mb-6 md:mb-0">
                        <img src="img/secura-fulllogo.webp" alt="SecuraLabs Logo" width="900" height="344" loading="lazy" class="h-14 w-auto object-contain mb-2">
                    </div>
                    <div class="flex space-x-6 text-gray-400" aria-label="Contact links">
                        <a href="contact.html" class="hover:text-securaPurple transition" aria-label="Contact SecuraLabs"><i class="fa-solid fa-envelope text-xl" aria-hidden="true"></i></a>
                    </div>
                </div>
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <p>&copy; 2026 SecuraLabs. All rights reserved.</p>
                    <div class="space-x-4 mt-4 md:mt-0">
                        <a href="privacy.html" class="hover:text-gray-900 dark:hover:text-white">Privacy Policy</a>
                        <a href="terms.html" class="hover:text-gray-900 dark:hover:text-white">Terms of Service</a>
                    </div>
                </div>
            </footer>
        `;
    }
})();
