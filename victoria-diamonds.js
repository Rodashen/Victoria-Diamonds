(function() {
    'use strict';

    // ============================================
    // Victoria Diamonds - Main JavaScript
    // ============================================

    // ---------- Header, Mobile Navigation, and Information Modals ----------
    document.addEventListener('DOMContentLoaded', function() {
        const header = document.querySelector('.site-header');
        const mobileMenuToggle = document.getElementById('menuToggle');
        const mobileNav = document.getElementById('mobileNav');
        const mobileOverlay = document.getElementById('mobileOverlay');
        const mobileNavClose = document.getElementById('mobileNavClose');
        const transparencyModal = document.getElementById('transparencyModal');
        const guaranteeModal = document.getElementById('guaranteeModal');
        const managedModals = [
            transparencyModal,
            guaranteeModal
        ].filter(Boolean);
        const originalBodyOverflow = document.body.style.overflow;

        function updateBodyScroll() {
            const mobileNavIsOpen =
                mobileNav && mobileNav.classList.contains('active');
            const modalIsOpen = managedModals.some(function(modal) {
                return modal.classList.contains('active');
            });

            document.body.style.overflow =
                mobileNavIsOpen || modalIsOpen ? 'hidden' : originalBodyOverflow;
        }

        function setMobileNavigation(isOpen) {
            if (!mobileMenuToggle || !mobileNav || !mobileOverlay) {
                return;
            }

            mobileNav.classList.toggle('active', isOpen);
            mobileOverlay.classList.toggle('active', isOpen);
            mobileMenuToggle.classList.toggle('active', isOpen);
            mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
            updateBodyScroll();
        }

        function openModal(modal) {
            if (!modal) {
                return;
            }

            setMobileNavigation(false);
            managedModals.forEach(function(managedModal) {
                if (managedModal !== modal) {
                    managedModal.classList.remove('active');
                    managedModal.setAttribute('aria-hidden', 'true');
                }
            });

            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            updateBodyScroll();
        }

        function closeModal(modal) {
            if (!modal) {
                return;
            }

            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            updateBodyScroll();
        }

        if (header) {
            function updateHeaderState() {
                header.classList.toggle('scrolled', window.scrollY > 50);
            }

            updateHeaderState();
            window.addEventListener('scroll', updateHeaderState);
        }

        if (mobileMenuToggle && mobileNav && mobileOverlay) {
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileMenuToggle.addEventListener('click', function() {
                setMobileNavigation(
                    !mobileNav.classList.contains('active')
                );
            });

            mobileOverlay.addEventListener('click', function() {
                setMobileNavigation(false);
            });

            if (mobileNavClose) {
                mobileNavClose.addEventListener('click', function() {
                    setMobileNavigation(false);
                });
            }

            mobileNav.querySelectorAll('a').forEach(function(link) {
                link.addEventListener('click', function() {
                    setMobileNavigation(false);
                });
            });
        }

        document.querySelectorAll('.js-transparency-trigger').forEach(function(trigger) {
            trigger.addEventListener('click', function(event) {
                event.preventDefault();
                openModal(transparencyModal);
            });
        });

        document.querySelectorAll('.js-guarantee-trigger').forEach(function(trigger) {
            trigger.addEventListener('click', function(event) {
                event.preventDefault();
                openModal(guaranteeModal);
            });
        });

        managedModals.forEach(function(modal) {
            modal.addEventListener('click', function(event) {
                if (event.target === modal) {
                    closeModal(modal);
                }
            });

            modal.querySelectorAll('.modal-close-x, .modal-close-btn').forEach(function(button) {
                button.addEventListener('click', function() {
                    closeModal(modal);
                });
            });
        });

        document.addEventListener('keydown', function(event) {
            if (event.key !== 'Escape') {
                return;
            }

            const activeModal = managedModals.find(function(modal) {
                return modal.classList.contains('active');
            });

            if (activeModal) {
                closeModal(activeModal);
            } else if (mobileNav && mobileNav.classList.contains('active')) {
                setMobileNavigation(false);
            }
        });
    });


    // ---------- Smooth Scroll ----------
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            if (!targetId || targetId === '#') {
                return;
            }

            const target = document.querySelector(targetId);

            if (target) {
                e.preventDefault();

                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.pageYOffset -
                    headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ---------- Hero Slideshow ----------
    const heroSlides = document.querySelectorAll('.hero-slide');

    if (heroSlides.length > 1) {
        let currentHeroSlide = 0;

        heroSlides.forEach(function(slide, index) {
            slide.classList.toggle('active', index === 0);
        });

        setInterval(function() {
            heroSlides[currentHeroSlide].classList.remove('active');

            currentHeroSlide =
                (currentHeroSlide + 1) % heroSlides.length;

            heroSlides[currentHeroSlide].classList.add('active');
        }, 6000);
    }


    // ---------- Cursor Shine Effect ----------
    const cursorShine = document.querySelector('.cursor-shine');

    if (cursorShine) {
        document.addEventListener('mousemove', function(e) {
            cursorShine.style.left = e.clientX + 'px';
            cursorShine.style.top = e.clientY + 'px';
        });
    }


    // ---------- Statistics Counter ----------
    const statNumbers = document.querySelectorAll('[data-count]');

    if (statNumbers.length) {
        const statsObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (!entry.isIntersecting) {
                    return;
                }

                const element = entry.target;
                const target = parseInt(element.getAttribute('data-count'), 10);

                if (isNaN(target)) {
                    return;
                }

                let start = 0;
                const duration = 1800;
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    const easedProgress =
                        1 - Math.pow(1 - progress, 3);

                    const currentValue =
                        Math.floor(easedProgress * target);

                    element.textContent = currentValue.toLocaleString();

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        element.textContent = target.toLocaleString();
                    }
                }

                requestAnimationFrame(updateCounter);
                observer.unobserve(element);
            });
        }, {
            threshold: 0.3
        });

        statNumbers.forEach(function(element) {
            statsObserver.observe(element);
        });
    }


    // ---------- Active Navigation ----------
    const sections = document.querySelectorAll('section[id]');

    if (sections.length) {
        const navLinks = document.querySelectorAll(
            '.main-nav a[href^="#"]'
        );

        const sectionObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    navLinks.forEach(function(link) {
                        link.classList.remove('active');

                        if (
                            link.getAttribute('href') ===
                            '#' + entry.target.id
                        ) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.25
        });

        sections.forEach(function(section) {
            sectionObserver.observe(section);
        });
    }


    // ---------- Collection / Product Interactions ----------
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });

        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });


    // ---------- Reveal Animations ----------
    const revealElements = document.querySelectorAll(
        '.reveal, .fade-in, .slide-up'
    );

    if (revealElements.length) {
        const revealObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.1
        });

        revealElements.forEach(function(element) {
            revealObserver.observe(element);
        });
    }


    // ---------- Language / Translation ----------
    function getStoredLanguage() {
        const savedLanguage = localStorage.getItem('victoriaLanguage');

        if (savedLanguage) {
            return savedLanguage;
        }

        return document.documentElement.getAttribute('lang') || 'en';
    }

    function applyLanguageSelection(language) {
        if (!language) {
            return;
        }

        document.documentElement.setAttribute('lang', language);
        localStorage.setItem('victoriaLanguage', language);

        const languageButtons =
            document.querySelectorAll('[data-language]');

        languageButtons.forEach(function(btn) {
            btn.classList.toggle('active', btn.getAttribute('data-language') === language);
        });

        const selects =
            document.querySelectorAll('#langSelect, #langSelectMobile');

        selects.forEach(function(select) {
            select.value = language;
        });
    }

    function initializeLanguage() {
        const languageButtons =
            document.querySelectorAll('[data-language]');

        const preferredLanguage = getStoredLanguage();

        if (preferredLanguage) {
            applyLanguageSelection(preferredLanguage);
        }

        languageButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                const language = this.getAttribute('data-language');

                if (!language) {
                    return;
                }

                applyLanguageSelection(language);
            });
        });

        const selects = document.querySelectorAll('#langSelect, #langSelectMobile');

        selects.forEach(function(select) {
            select.addEventListener('change', function() {
                applyLanguageSelection(this.value);
            });
        });
    }

    initializeLanguage();


    // ---------- Consent Management ----------
    let consentBanner = null;
    let consentAcceptButton = null;
    let consentEssentialButton = null;

    function resolveConsentLanguage() {
        const language = localStorage.getItem('victoriaLanguage') || document.documentElement.getAttribute('lang') || 'en';
        return language === 'zh-HK' ? 'zh-HK' : 'en';
    }

    function updateConsentBannerCopy() {
        if (!consentBanner) {
            return;
        }

        const isZh = resolveConsentLanguage() === 'zh-HK';
        const copy = isZh ? {
            title: '我們使用 Cookie 來提升您的網站體驗',
            description: '為了確保網站正常運作、保護帳戶安全及改善服務，我們使用必要 Cookie 及可選 Cookie。請選擇您的偏好。',
            accept: '接受所有 Cookie',
            essential: '只接受必要 Cookie',
            policy: '查看 Cookie 政策',
            privacy: '私隱政策'
        } : {
            title: 'We use cookies to improve your experience',
            description: 'We use essential cookies to keep the site secure and functional, and optional cookies to support better browsing and service improvements.',
            accept: 'Accept all cookies',
            essential: 'Only essential cookies',
            policy: 'Cookie policy',
            privacy: 'Privacy policy'
        };

        const title = consentBanner.querySelector('[data-consent-title]');
        const description = consentBanner.querySelector('[data-consent-description]');
        const accept = consentBanner.querySelector('[data-consent-accept]');
        const essential = consentBanner.querySelector('[data-consent-essential]');
        const policy = consentBanner.querySelector('[data-consent-policy]');
        const privacy = consentBanner.querySelector('[data-consent-privacy]');

        if (title) title.textContent = copy.title;
        if (description) description.textContent = copy.description;
        if (accept) accept.textContent = copy.accept;
        if (essential) essential.textContent = copy.essential;
        if (policy) policy.textContent = copy.policy;
        if (privacy) privacy.textContent = copy.privacy;
    }

    function hideConsentBanner() {
        if (!consentBanner) {
            return;
        }

        consentBanner.classList.add('hidden');
        consentBanner.setAttribute('aria-hidden', 'true');
    }

    function scheduleNewsletterAfterConsent() {
        if (sessionStorage.getItem('emailPopupShown')) {
            return;
        }

        if (window.__newsletterPopupTimer) {
            clearTimeout(window.__newsletterPopupTimer);
        }

        window.__newsletterPopupTimer = setTimeout(function() {
            showEmailSubscriptionPopup();
        }, 1200);
    }

    function storeConsentChoice(choice, preferences) {
        localStorage.setItem('vdCookieConsent', choice);

        if (preferences) {
            localStorage.setItem('vdCookiePreferences', JSON.stringify(preferences));
        }

        localStorage.setItem('vdCookieConsentSource', 'banner');
        hideConsentBanner();
        updateConsentBannerCopy();
    }

    function initializeConsentBanner() {
        consentBanner = document.getElementById('cookieConsentBanner');
        consentAcceptButton = document.getElementById('cookieConsentAccept');
        consentEssentialButton = document.getElementById('cookieConsentEssential');

        if (!consentBanner) {
            return;
        }

        consentBanner.classList.remove('hidden');
        consentBanner.setAttribute('aria-hidden', 'false');

        updateConsentBannerCopy();

        const consentButtons = [
            consentAcceptButton,
            consentEssentialButton
        ].filter(Boolean);

        consentButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                const choice = this.getAttribute('data-consent-choice') || 'essential';
                const preferences = {
                    essential: true,
                    analytics: choice === 'all',
                    marketing: choice === 'all'
                };

                localStorage.setItem('vdCookieConsentSource', 'banner');
                storeConsentChoice(choice, preferences);
            });
        });
    }

    // ============================================
    // Email Subscription Modal
    // ============================================

    let emailSubscriptionModal = null;
    let emailSubscriptionPopup = null;
    let emailSubscriptionCloseX = null;
    let emailSubscriptionForm = null;
    let emailSubscriptionIframe = null;

    let emailSubscriptionSubmissionPending = false;
    let emailSubscriptionSuccessTimer = null;


    // ---------- Initialize Elements ----------
    function initEmailSubscriptionElements() {
        emailSubscriptionModal =
            document.getElementById('emailSubscriptionModal');

        emailSubscriptionPopup =
            document.getElementById('emailSubscriptionPopup');

        emailSubscriptionCloseX =
            document.getElementById('emailSubscriptionCloseX');

        emailSubscriptionForm =
            document.getElementById('emailSubscriptionForm');

        emailSubscriptionIframe =
            document.getElementById('zohoSubmitIframe');
    }


    // ---------- Reset Popup States ----------
function resetEmailSubscriptionStates() {
    if (!emailSubscriptionPopup) {
        return;
    }

    const formState =
        emailSubscriptionPopup.querySelector(
            '.email-subscription-form-state'
        );

    const successState =
        emailSubscriptionPopup.querySelector(
            '.email-subscription-success'
        );

    const errorState =
        emailSubscriptionPopup.querySelector(
            '.email-subscription-error'
        );

    const heading =
        emailSubscriptionPopup.querySelector(
            '.email-subscription-text-column h2'
        );

    const description =
        emailSubscriptionPopup.querySelector(
            '.email-subscription-text-column > p'
        );

    // Restore the original form
    if (formState) {
        formState.style.display = 'flex';
        formState.hidden = false;
    }

    // Restore heading
    if (heading) {
        heading.style.display = '';
    }

    // Restore description
    if (description) {
        description.style.display = '';
    }

    // Hide success message
    if (successState) {
        successState.classList.remove('show');
        successState.style.display = 'none';
    }

    // Hide error message
    if (errorState) {
        errorState.classList.remove('show');
        errorState.style.display = 'none';
    }

    emailSubscriptionSubmissionPending = false;

    if (emailSubscriptionSuccessTimer) {
        clearTimeout(emailSubscriptionSuccessTimer);
        emailSubscriptionSuccessTimer = null;
    }
}

    // ---------- Show Success ----------
   function showEmailSubscriptionSuccess() {
    if (!emailSubscriptionPopup) {
        return;
    }

    const textColumn =
        emailSubscriptionPopup.querySelector(
            '.email-subscription-text-column'
        );

    if (!textColumn) {
        return;
    }

    /*
     * Replace the ENTIRE right side of the popup.
     * This removes:
     * - Email field
     * - Last Name field
     * - Submit button
     * - Original heading
     * - Original description
     * - Any leftover form elements
     */

    textColumn.innerHTML = `
        <div class="email-subscription-success-final">

            <div class="success-content">

                <div class="success-eyebrow">
                    VICTORIA DIAMONDS
                </div>

                <h2>
                    Thank You for Subscribing!
                </h2>

                <p class="success-main-text">
                    Welcome to the Victoria Diamonds community. We're delighted to have you with us.
                </p>

                <p class="success-sub-text">
                    Follow us on Instagram to discover our latest creations, bespoke jewellery, and behind-the-scenes moments.
                </p>

                <a
                    href="https://www.instagram.com/victoriadiamondsco/"
                    target="_blank"
                    rel="noopener"
                    class="success-instagram-link"
                    aria-label="Follow Victoria Diamonds on Instagram"
                >
                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        class="success-instagram-icon"
                    >
                        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.2A4.8 4.8 0 1 1 7.2 12 4.8 4.8 0 0 1 12 7.2Zm0 2A2.8 2.8 0 1 0 14.8 12 2.8 2.8 0 0 0 12 9.2Zm5.2-3.2a1.2 1.2 0 1 1-1.2 1.2 1.2 1.2 0 0 1-1.2 1.2 1.2 1.2 0 0 1 1.2-1.2Z"/>
                    </svg>

                    <span>@victoriadiamondsco</span>
                </a>

            </div>

        </div>
    `;

    /*
     * Add the styling directly so existing popup CSS
     * cannot interfere with the success screen.
     */

    const styleId = 'victoria-success-screen-styles';

    if (!document.getElementById(styleId)) {

        const style = document.createElement('style');

        style.id = styleId;

        style.textContent = `
            .email-subscription-success-final {
                width: 100%;
                height: 100%;
                min-height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
                padding: 60px 55px;
            }

            .email-subscription-success-final .success-content {
                width: 100%;
                max-width: 390px;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: center;
                text-align: left;
            }

            .email-subscription-success-final .success-eyebrow {
                font-family: 'DM Sans', sans-serif;
                font-size: 10px;
                font-weight: 600;
                letter-spacing: 0.22em;
                text-transform: uppercase;
                margin-bottom: 22px;
                opacity: 0.6;
            }

            .email-subscription-success-final h2 {
                margin: 0 0 22px 0 !important;
                padding: 0 !important;
                font-family: 'Cormorant Garamond', serif !important;
                font-size: clamp(42px, 4vw, 58px) !important;
                line-height: 0.95 !important;
                font-weight: 400 !important;
                letter-spacing: -0.02em !important;
                color: #1c1c1c !important;
            }

            .email-subscription-success-final .success-main-text {
                margin: 0 0 7px 0 !important;
                padding: 0 !important;
                font-family: 'DM Sans', sans-serif !important;
                font-size: 16px !important;
                line-height: 1.6 !important;
                color: #1c1c1c !important;
            }

            .email-subscription-success-final .success-sub-text {
                margin: 0 !important;
                padding: 0 !important;
                font-family: 'DM Sans', sans-serif !important;
                font-size: 14px !important;
                line-height: 1.6 !important;
                color: #777 !important;
            }

            .success-instagram-link {
                display: inline-flex !important;
                align-items: center !important;
                gap: 12px !important;
                margin-top: 38px !important;
                padding-top: 20px !important;
                border-top: 1px solid rgba(28, 28, 28, 0.14) !important;
                width: 100% !important;
                box-sizing: border-box !important;
                text-decoration: none !important;
                font-family: 'DM Sans', sans-serif !important;
                font-size: 13px !important;
                font-weight: 500 !important;
                letter-spacing: 0.03em !important;
                color: #1c1c1c !important;
                transition: opacity 0.25s ease !important;
            }

            .success-instagram-link:hover {
                opacity: 0.55 !important;
            }

            .success-instagram-icon {
                width: 21px !important;
                height: 21px !important;
                flex: 0 0 21px !important;
                fill: #1c1c1c !important;
            }

            @media (max-width: 700px) {

                .email-subscription-success-final {
                    padding: 45px 32px;
                }

                .email-subscription-success-final h2 {
                    font-size: 44px !important;
                }

            }
        `;

        document.head.appendChild(style);
    }

    emailSubscriptionSubmissionPending = false;
}
// ============================================
// FAQ Accordion
// ============================================

function initializeFAQAccordion() {

    const faqQuestions =
        document.querySelectorAll('.faq-question');

    faqQuestions.forEach(function(question) {

        question.addEventListener('click', function() {

            const item =
                this.closest('.faq-item');

            if (!item) {
                return;
            }

            item.classList.toggle('active');

        });

    });

}


if (document.readyState === 'loading') {

    document.addEventListener(
        'DOMContentLoaded',
        initializeFAQAccordion
    );

} else {

    initializeFAQAccordion();

}

// ============================================
// FAQ Reveal Animation
// ============================================

function initializeFAQReveal() {

    const faqSection = document.querySelector('.faq');

    if (faqSection) {
        faqSection.classList.add('revealed');

        faqSection.style.opacity = '1';
        faqSection.style.visibility = 'visible';
        faqSection.style.transform = 'translateY(0)';
    }

    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function(item, index) {

        item.style.opacity = '0';
        item.style.visibility = 'visible';
        item.style.transform = 'translateY(16px)';

        item.style.transition =
            'opacity 0.6s ease ' +
            (index * 0.05 + 0.05) +
            's, transform 0.6s ease ' +
            (index * 0.05 + 0.05) +
            's';

        const itemObserver =
            new IntersectionObserver(
                function(entries) {

                    entries.forEach(function(entry) {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                'revealed'
                            );

                            entry.target.style.opacity = '1';
                            entry.target.style.visibility = 'visible';
                            entry.target.style.transform =
                                'translateY(0)';

                            itemObserver.unobserve(
                                entry.target
                            );
                        }

                    });

                },
                {
                    threshold: 0.05
                }
            );

        itemObserver.observe(item);
    });
}


// Run correctly whether the script loads before
// or after DOMContentLoaded.
if (document.readyState === 'loading') {

    document.addEventListener(
        'DOMContentLoaded',
        initializeFAQReveal
    );

} else {

    initializeFAQReveal();

}

    // ---------- Show Error ----------
    function showEmailSubscriptionError() {
        if (!emailSubscriptionPopup) {
            return;
        }

        const formState =
            emailSubscriptionPopup.querySelector(
                '.email-subscription-form-state'
            );

        const successState =
            emailSubscriptionPopup.querySelector(
                '.email-subscription-success'
            );

        const errorState =
            emailSubscriptionPopup.querySelector(
                '.email-subscription-error'
            );

        if (formState) {
            formState.style.display = 'none';
            formState.hidden = true;
        }

        if (successState) {
            successState.classList.remove('show');
            successState.style.display = 'none';
        }

        if (errorState) {
            errorState.classList.add('show');
            errorState.style.display = 'flex';
        }

        emailSubscriptionSubmissionPending = false;
    }


    // ---------- Zoho Form Submit ----------
    function handleEmailSubscriptionSubmit(event) {
        if (!emailSubscriptionForm) {
            return;
        }

        const emailField =
            emailSubscriptionForm.querySelector(
                'input[name="Email"]'
            );

        const lastNameField =
            emailSubscriptionForm.querySelector(
                'input[name="Last Name"]'
            );

        /*
         * Zoho's form is submitted normally into the hidden iframe.
         *
         * IMPORTANT:
         * We intentionally DO NOT use fetch() here.
         * Zoho's WebToLeadForm endpoint expects the normal
         * HTML form POST with Zoho's hidden fields.
         */

        if (!emailField || !lastNameField) {
            event.preventDefault();

            console.error(
                '[Email Subscription] Required Zoho fields are missing.'
            );

            showEmailSubscriptionError();
            return;
        }

        const email = emailField.value.trim();
        const lastName = lastNameField.value.trim() || 'Newsletter Subscriber';
        lastNameField.value = lastName;

        // Validate email
        if (
            !email ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            event.preventDefault();

            emailField.focus();
            return;
        }

        // Validate last name
        if (!lastName) {
            event.preventDefault();

            lastNameField.value = 'Newsletter Subscriber';
            return;
        }

        /*
         * Mark the iframe as waiting for Zoho's response.
         *
         * DO NOT call preventDefault().
         *
         * The browser must perform the actual POST to:
         * https://crm.zoho.eu/crm/WebToLeadForm
         *
         * Because target="zohoSubmitIframe", the visitor
         * remains on the Victoria Diamonds page.
         */

        emailSubscriptionSubmissionPending = true;

        console.log(
            '[Email Subscription] Submitting to Zoho CRM:',
            email
        );
    }


    // ---------- Zoho Iframe Response ----------
    function handleZohoSubmitIframeLoad() {

        /*
         * The iframe fires a load event when it first exists.
         * We must ignore that initial event.
         *
         * Only react after the form has actually been submitted.
         */

        if (!emailSubscriptionSubmissionPending) {
            return;
        }

        if (emailSubscriptionSuccessTimer) {
            clearTimeout(emailSubscriptionSuccessTimer);
        }

        emailSubscriptionSuccessTimer = setTimeout(function() {
            showEmailSubscriptionSuccess();
        }, 350);
    }


    // ---------- Initialize Email Modal ----------
    function initializeEmailSubscription() {
        initEmailSubscriptionElements();

        if (
            !emailSubscriptionModal ||
            !emailSubscriptionPopup
        ) {
            console.error(
                '[Email Subscription] Popup elements not found.'
            );

            return;
        }

        resetEmailSubscriptionStates();


        // Close X button
        if (emailSubscriptionCloseX) {
            emailSubscriptionCloseX.addEventListener(
                'click',
                closeEmailSubscription
            );
        }


        // Click outside popup
        emailSubscriptionModal.addEventListener(
            'click',
            function(e) {
                if (e.target === emailSubscriptionModal) {
                    closeEmailSubscription();
                }
            }
        );


        // Zoho form
        if (emailSubscriptionForm) {
            emailSubscriptionForm.addEventListener(
                'submit',
                handleEmailSubscriptionSubmit
            );
        }


        // Hidden iframe
        if (emailSubscriptionIframe) {
            emailSubscriptionIframe.addEventListener(
                'load',
                handleZohoSubmitIframeLoad
            );
        }


        // Show popup
        showEmailSubscriptionPopup();
    }


    // ---------- Open Modal ----------
    function openEmailSubscription() {
        if (!emailSubscriptionModal) {
            return;
        }

        resetEmailSubscriptionStates();

        emailSubscriptionModal.classList.add('active');

        emailSubscriptionModal.setAttribute(
            'aria-hidden',
            'false'
        );

        document.body.style.overflow = 'hidden';
    }


    // ---------- Close Modal ----------
    function closeEmailSubscription() {
        if (!emailSubscriptionModal) {
            return;
        }

        emailSubscriptionModal.classList.remove('active');

        emailSubscriptionModal.setAttribute(
            'aria-hidden',
            'true'
        );

        document.body.style.overflow = '';

        if (emailSubscriptionForm && typeof emailSubscriptionForm.reset === 'function') {
            emailSubscriptionForm.reset();
        }

        resetEmailSubscriptionStates();
    }


    // ---------- Show Popup Once Per Session ----------
    function showEmailSubscriptionPopup() {
        if (!emailSubscriptionModal) {
            return;
        }

        const popupShown =
            sessionStorage.getItem(
                'emailPopupShown'
            );

        if (!popupShown) {
            const delay =
                800 +
                Math.floor(
                    Math.random() * 1000
                );

            window.__newsletterPopupTimer = setTimeout(function() {
                openEmailSubscription();
                sessionStorage.setItem(
                    'emailPopupShown',
                    'true'
                );
            }, delay);
        }
    }


    // ---------- DOM Ready ----------
    if (document.readyState === 'loading') {

        document.addEventListener(
            'DOMContentLoaded',
            function() {
                initializeConsentBanner();
                initializeEmailSubscription();
                scheduleNewsletterAfterConsent();
            }
        );

    } else {

        initializeConsentBanner();
        initializeEmailSubscription();
        scheduleNewsletterAfterConsent();

    }


    // ---------- Escape Key ----------
    document.addEventListener(
        'keydown',
        function(e) {

            if (
                e.key === 'Escape' &&
                emailSubscriptionModal &&
                emailSubscriptionModal.classList.contains(
                    'active'
                )
            ) {
                closeEmailSubscription();
            }

        }
    );


    // ============================================
    // Console Signature
    // ============================================

    console.log(
        '%c Victoria Diamonds ',
        'background: #1C1C1C; color: #D4A853; font-size: 14px; font-weight: bold; padding: 8px 12px; border-radius: 4px; font-family: Cormorant Garamond, serif;'
    );

    console.log(
        '%c Handcrafted gold jewelry of exceptional quality.',
        'color: #A69080; font-size: 12px; font-style: italic;'
    );

})();