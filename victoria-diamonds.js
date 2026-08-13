// ============================================
// Victoria Diamonds — Premium Interactive JS
// ============================================

// ---------- Header scroll effect ----------
const header = document.getElementById('header');
const progressBar = document.getElementById('progressBar');

function updateScrollState() {
   const scrollY = window.scrollY;
   
   if (scrollY > 100) {
      header.classList.add('scrolled');
   } else {
      header.classList.remove('scrolled');
   }

   const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
   const progress = scrollHeight > 0 ? (scrollY / scrollHeight) * 100 : 0;
   if (progressBar) {
      progressBar.style.width = `${progress}%`;
   }
}

window.addEventListener('scroll', updateScrollState, { passive: true });
updateScrollState();

// ---------- Mobile navigation ----------
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileNavClose = document.getElementById('mobileNavClose');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

function openMobileNav() {
   mobileNav.classList.add('active');
   mobileOverlay.classList.add('active');
   document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
   mobileNav.classList.remove('active');
   mobileOverlay.classList.remove('active');
   document.body.style.overflow = '';
}

menuToggle.addEventListener('click', openMobileNav);
mobileNavClose.addEventListener('click', closeMobileNav);
mobileOverlay.addEventListener('click', closeMobileNav);

mobileNavLinks.forEach(link => {
   link.addEventListener('click', closeMobileNav);
});

// ---------- Smooth scroll ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
   if (anchor.classList.contains('js-transparency-trigger')) return;
   if (anchor.classList.contains('js-guarantee-trigger')) return;
   anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      if (href === '#') {
         window.scrollTo({ top: 0, behavior: 'smooth' });
         return;
      }
      const target = href === '#collections' && window.matchMedia('(max-width: 860px)').matches
         ? document.getElementById('collections-mobile')
         : document.querySelector(href);
      if (target) {
         const headerHeight = header.offsetHeight;
         const targetPosition = target.offsetTop - headerHeight;
         window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
   });
});

// ---------- Hero image slideshow ----------
const slides = document.querySelectorAll('.hero-slide');
const heroTitle = document.getElementById('heroTitle');
const slideDots = document.querySelectorAll('.slide-dot');
const slideCurrent = document.getElementById('slideCurrent');
const slideTotal = document.getElementById('slideTotal');
const heroArrowPrev = document.getElementById('heroArrowPrev');
const heroArrowNext = document.getElementById('heroArrowNext');
let currentSlide = 0;
let slideInterval;

function padNumber(num) {
   return num < 10 ? `0${num}` : `${num}`;
}

function updateSlideCounter(index) {
   if (slideCurrent && slideTotal) {
      slideCurrent.textContent = padNumber(index + 1);
      slideTotal.textContent = padNumber(slides.length);
   }
}

function goToSlide(index) {
   if (index === currentSlide) return;
   
   slides[currentSlide].classList.remove('active');
   slideDots[currentSlide].classList.remove('active');
   
   if (heroTitle) {
      heroTitle.style.opacity = '0';
   }
   
   currentSlide = index;
   
   setTimeout(() => {
      if (heroTitle) {
         heroTitle.textContent = slides[currentSlide].dataset.title;
         heroTitle.style.opacity = '1';
      }
   }, 500);
   
   slides[currentSlide].classList.add('active');
   slideDots[currentSlide].classList.add('active');
   
   updateSlideCounter(currentSlide);
   
   const activeDot = slideDots[currentSlide];
   activeDot.style.animation = 'none';
   void activeDot.offsetHeight;
   activeDot.style.animation = '';
}

function changeSlide() {
   const next = (currentSlide + 1) % slides.length;
   goToSlide(next);
}

function prevSlide() {
   const prev = (currentSlide - 1 + slides.length) % slides.length;
   stopSlideShow();
   goToSlide(prev);
   startSlideShow();
}

function nextSlide() {
   const next = (currentSlide + 1) % slides.length;
   stopSlideShow();
   goToSlide(next);
   startSlideShow();
}

function startSlideShow() {
   slideInterval = setInterval(changeSlide, 2000);
}

function stopSlideShow() {
   clearInterval(slideInterval);
}

if (heroArrowPrev) {
   heroArrowPrev.addEventListener('click', prevSlide);
}
if (heroArrowNext) {
   heroArrowNext.addEventListener('click', nextSlide);
}

document.addEventListener('keydown', function(e) {
   if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
   if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
   else if (e.key === 'ArrowRight') { e.preventDefault(); nextSlide(); }
});

slideDots.forEach(dot => {
   dot.addEventListener('click', function() {
      const index = parseInt(this.dataset.index);
      stopSlideShow();
      goToSlide(index);
      startSlideShow();
   });
});

if (slides.length > 1) {
   updateSlideCounter(0);
   startSlideShow();
}

const heroImage = document.querySelector('.hero-image');
if (heroImage) {
   heroImage.addEventListener('mouseenter', stopSlideShow);
   heroImage.addEventListener('mouseleave', startSlideShow);
}

// ---------- Cursor shine effect ----------
const cursorShine = document.createElement('div');
cursorShine.className = 'cursor-shine';
document.body.appendChild(cursorShine);

let cursorX = 0, cursorY = 0;
let shineX = 0, shineY = 0;

document.addEventListener('mousemove', (e) => {
   cursorX = e.clientX;
   cursorY = e.clientY;
});

function animateShine() {
   shineX += (cursorX - shineX) * 0.08;
   shineY += (cursorY - shineY) * 0.08;
   cursorShine.style.left = `${shineX}px`;
   cursorShine.style.top = `${shineY}px`;
   requestAnimationFrame(animateShine);
}
animateShine();

if ('ontouchstart' in window) {
   cursorShine.style.display = 'none';
}

// ---------- Scroll-triggered stat counter ----------
const statNumbers = document.querySelectorAll('.stat-number');
let statsCounted = false;

function animateStats() {
   if (statsCounted) return;
   statsCounted = true;
   
   statNumbers.forEach(stat => {
      const text = stat.textContent.trim();
      const hasPlus = text.includes('+');
      const targetValue = parseInt(text.replace(/[^0-9]/g, ''));
      if (isNaN(targetValue)) return;
      
      let currentValue = 0;
      const duration = 2000;
      const startTime = performance.now();
      
      function updateCounter(currentTime) {
         const elapsed = currentTime - startTime;
         const progress = Math.min(elapsed / duration, 1);
         const eased = 1 - Math.pow(1 - progress, 3);
         currentValue = Math.floor(eased * targetValue);
         stat.textContent = hasPlus ? `${currentValue}+` : currentValue;
         
         if (progress < 1) {
            requestAnimationFrame(updateCounter);
         } else {
            stat.textContent = text;
         }
      }
      
      requestAnimationFrame(updateCounter);
   });
}

// ---------- Active nav section highlight ----------
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-main > a:not(.nav-cta):not(.nav-catalog)');

function updateActiveNav() {
   const scrollY = window.scrollY + header.offsetHeight + 100;
   
   sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const id = section.getAttribute('id');
      
      if (scrollY >= sectionTop && scrollY < sectionBottom) {
         navLinks.forEach(link => {
            link.classList.remove('nav-active');
            if (link.getAttribute('href') === `#${id}`) {
               link.classList.add('nav-active');
            }
         });
      }
   });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

// ---------- Enhanced scroll reveal with stagger ----------
const revealObserverOptions = {
   threshold: 0.1,
   rootMargin: '0px 0px -60px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
   entries.forEach(entry => {
      if (entry.isIntersecting) {
         const el = entry.target;
         
         const children = el.querySelectorAll('.reveal-stagger > *');
         if (children.length > 0) {
            children.forEach((child, index) => {
               setTimeout(() => {
                  child.classList.add('revealed');
               }, index * 150);
            });
         }
         
         if (el.classList.contains('craft-stats') && !statsCounted) {
            animateStats();
         }
         
         el.classList.add('revealed');
         revealObserver.unobserve(el);
      }
   });
}, revealObserverOptions);

document.querySelectorAll('section, .featured-grid, .collections-grid, .testimonials-grid, .contact-grid, .footer-grid').forEach(section => {
   section.classList.add('reveal');
   revealObserver.observe(section);
});

document.querySelectorAll('.craft-stats, .hero-image-overlay').forEach(el => {
   el.classList.add('reveal');
   revealObserver.observe(el);
});

// ---------- Magnetic button effect ----------
const magneticButtons = document.querySelectorAll('.btn-primary, .nav-cta, .nav-catalog');

magneticButtons.forEach(btn => {
   btn.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      this.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
   });
   
   btn.addEventListener('mouseleave', function() {
      this.style.transform = '';
   });
});

// ---------- Parallax effect on hero ----------
const heroSection = document.querySelector('.hero');
if (heroSection) {
   window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;
      if (scrollPos < window.innerHeight) {
         const heroSlides = heroSection.querySelectorAll('.hero-slide.active img');
         heroSlides.forEach(img => {
            img.style.transform = `translateY(${scrollPos * 0.05}px) scale(1.08)`;
         });
      }
   }, { passive: true });
}

// ---------- Form submission ----------
const form = document.getElementById('appointmentForm');
if (form) {
   form.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Thank you for your inquiry! We will contact you within 24 hours to confirm your appointment.');
      form.reset();
   });
}

// ---------- Transparency Modal ----------
const transparencyModal = document.getElementById('transparencyModal');
const transparencyModalCloseX = document.getElementById('transparencyModalCloseX');
const transparencyModalCloseBtn = document.getElementById('transparencyModalCloseBtn');
const transparencyTriggers = document.querySelectorAll('.js-transparency-trigger');

function openTransparencyModal() {
    if (transparencyModal) {
        transparencyModal.classList.add('active');
        transparencyModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
}

function closeTransparencyModal() {
    if (transparencyModal) {
        transparencyModal.classList.remove('active');
        transparencyModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

transparencyTriggers.forEach(function(trigger) {
    trigger.addEventListener('click', function(e) {
        // Close the mobile nav if it's the trigger from the hamburger menu
        if (typeof closeMobileNav === 'function') {
            closeMobileNav();
        }
        if (this.getAttribute('href') === '#') {
            e.preventDefault();
        }
        openTransparencyModal();
    });
});
if (transparencyModalCloseX) {
    transparencyModalCloseX.addEventListener('click', closeTransparencyModal);
}
if (transparencyModalCloseBtn) {
    transparencyModalCloseBtn.addEventListener('click', closeTransparencyModal);
}
if (transparencyModal) {
    transparencyModal.addEventListener('click', function(e) {
        if (e.target === this) closeTransparencyModal();
    });
}

// ---------- Artist Modal ----------
const artistModal = document.getElementById('artistModal');
const artistModalCloseX = document.getElementById('artistModalCloseX');
const artistModalCloseBtn = document.getElementById('artistModalCloseBtn');
const craftArtistBtn = document.getElementById('craftArtistBtn');

function openArtistModal() {
    if (artistModal) {
        artistModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeArtistModal() {
    if (artistModal) {
        artistModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

if (craftArtistBtn) {
    craftArtistBtn.addEventListener('click', openArtistModal);
}
if (artistModalCloseX) {
    artistModalCloseX.addEventListener('click', closeArtistModal);
}
if (artistModalCloseBtn) {
    artistModalCloseBtn.addEventListener('click', closeArtistModal);
}
if (artistModal) {
    artistModal.addEventListener('click', function(e) {
        if (e.target === this) closeArtistModal();
    });
}

// ---------- Guarantee Modal ----------
const guaranteeModal = document.getElementById('guaranteeModal');
const guaranteeModalCloseX = document.getElementById('guaranteeModalCloseX');
const guaranteeModalCloseBtn = document.getElementById('guaranteeModalCloseBtn');
const guaranteeTriggers = document.querySelectorAll('.js-guarantee-trigger');

function openGuaranteeModal() {
    if (guaranteeModal) {
        guaranteeModal.classList.add('active');
        guaranteeModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
}

function closeGuaranteeModal() {
    if (guaranteeModal) {
        guaranteeModal.classList.remove('active');
        guaranteeModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

guaranteeTriggers.forEach(function(trigger) {
    trigger.addEventListener('click', function(e) {
        // Close the mobile nav if it's the trigger from the hamburger menu
        if (typeof closeMobileNav === 'function') {
            closeMobileNav();
        }
        e.preventDefault();
        openGuaranteeModal();
    });
});
if (guaranteeModalCloseX) {
    guaranteeModalCloseX.addEventListener('click', closeGuaranteeModal);
}
if (guaranteeModalCloseBtn) {
    guaranteeModalCloseBtn.addEventListener('click', closeGuaranteeModal);
}
if (guaranteeModal) {
    guaranteeModal.addEventListener('click', function(e) {
        if (e.target === this) closeGuaranteeModal();
    });
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (transparencyModal && transparencyModal.classList.contains('active')) {
            closeTransparencyModal();
        } else if (artistModal && artistModal.classList.contains('active')) {
            closeArtistModal();
        } else if (guaranteeModal && guaranteeModal.classList.contains('active')) {
            closeGuaranteeModal();
        }
    }
});

// ---------- Gold shimmer on hero title ----------
const heroTitleEl = document.querySelector('.hero-title em');
if (heroTitleEl) {
   setInterval(() => {
      heroTitleEl.style.textShadow = '0 0 20px rgba(212, 168, 83, 0.3)';
      setTimeout(() => {
         heroTitleEl.style.textShadow = 'none';
      }, 1500);
   }, 4000);
}

// ---------- Testimonial card stagger observer ----------
const testimonialCards = document.querySelectorAll('.testimonial-card');
testimonialCards.forEach((card, index) => {
   card.style.opacity = '0';
   card.style.transform = 'translateY(30px)';
   card.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
   
   const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
         if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            cardObserver.unobserve(entry.target);
         }
      });
   }, { threshold: 0.1 });
   
   cardObserver.observe(card);
});

// ---------- Collection item stagger ----------
const collectionItems = document.querySelectorAll('.collection-item');
collectionItems.forEach((item, index) => {
   item.style.opacity = '0';
   item.style.transform = 'translateY(30px)';
   item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
   
   const itemObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
         if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            itemObserver.unobserve(entry.target);
         }
      });
   }, { threshold: 0.1 });
   
   itemObserver.observe(item);
});

// ============================================
// Translation / Language Switching
// ============================================

function getSavedLang() {
    return localStorage.getItem('vd-lang') || 'en';
}

function saveLang(lang) {
    localStorage.setItem('vd-lang', lang);
}

function storeOriginalText() {
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
        if (!el.hasAttribute('data-i18n-original')) {
            el.setAttribute('data-i18n-original', el.innerHTML);
        }
    });
}

function applyTranslations(lang) {
    var dict = translations[lang] || {};
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
        var key = el.getAttribute('data-i18n');
        if (lang === 'en') {
            var original = el.getAttribute('data-i18n-original');
            if (original) {
                el.innerHTML = original;
            }
        } else if (dict[key]) {
            el.innerHTML = dict[key];
        }
    });
    document.documentElement.lang = lang === 'zh-HK' ? 'zh-Hant-HK' : 'en';
    var selector = document.getElementById('langSelect');
    if (selector) { selector.value = lang; }
    var mobileSelector = document.getElementById('langSelectMobile');
    if (mobileSelector) { mobileSelector.value = lang; }
    document.querySelectorAll('[data-i18n="footer-terms-conditions"]').forEach(function(link) {
        link.href = lang === 'zh-HK' ? 'T&C-zh-HK.pdf' : 'T&C.pdf';
    });
}

function initLanguage() {
    storeOriginalText();
    // A shared URL such as `/?lang=zh-HK` opens the site in Chinese and
    // remembers that choice as visitors move through the catalogue.
    var langFromUrl = new URLSearchParams(window.location.search).get('lang');
    // The plain homepage always starts in English. Language-specific shared
    // links (for example `?lang=zh-HK`) explicitly select and save a locale.
    var initialLang = langFromUrl && translations[langFromUrl] ? langFromUrl : 'en';
    saveLang(initialLang);
    applyTranslations(initialLang);

    var selector = document.getElementById('langSelect');
    if (selector) {
        selector.addEventListener('change', function() {
            var lang = this.value;
            saveLang(lang);
            var ms = document.getElementById('langSelectMobile');
            if (ms) { ms.value = lang; }
            applyTranslations(lang);
        });
    }

    var mobileSelector = document.getElementById('langSelectMobile');
    if (mobileSelector) {
        mobileSelector.addEventListener('change', function() {
            var lang = this.value;
            saveLang(lang);
            var sel = document.getElementById('langSelect');
            if (sel) { sel.value = lang; }
            applyTranslations(lang);
        });
    }
}

function restoreCollectionPosition() {
    if (window.location.hash !== '#collections') { return; }
    var target = window.matchMedia('(max-width: 860px)').matches
        ? document.getElementById('collections-mobile')
        : document.getElementById('collections');
    if (target) {
        window.requestAnimationFrame(function() {
            target.scrollIntoView({ block: 'start' });
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initLanguage();
        restoreCollectionPosition();
    });
} else {
    initLanguage();
    restoreCollectionPosition();
}

// ============================================
// Console signature
// ============================================
console.log('%c Victoria Diamonds ', 'background: #1C1C1C; color: #D4A853; font-size: 14px; font-weight: bold; padding: 8px 12px; border-radius: 4px; font-family: Cormorant Garamond, serif;');
console.log('%c Handcrafted gold jewelry of exceptional quality.', 'color: #A69080; font-size: 12px; font-style: italic;');
