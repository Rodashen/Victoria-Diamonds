/* Shared, progressively enhanced interactions for the Prism presentation. */
(() => {
  const ready = () => {
    const zh = () => /^zh/.test(document.documentElement.lang);
    const main = document.querySelector('.prism-gallery, .catalogue-hero, .newsletter-page, .wrap');
    if (main) {
      main.id ||= 'main-content';
      const skip = document.createElement('a');
      skip.href = '#' + main.id; skip.className = 'skip-link'; skip.textContent = 'Skip to content';
      document.body.prepend(skip);
    }
    const footer = document.querySelector('.catalogue-footer');
    if (footer) {
      const links = document.createElement('nav'); links.className = 'prism-footer-links'; links.setAttribute('aria-label','Information');
      links.innerHTML = '<a href="newsletter.html">Newsletter</a><a href="privacy-policy.html">Privacy</a><a href="cookie-policy.html">Cookies</a><a href="https://calendly.com/general-victoria-diamonds/30min" target="_blank" rel="noopener">Private appointments</a>';
      footer.append(links);
    }
    document.querySelectorAll('.collection-section').forEach(section => {
      const count = section.querySelector('.count');
      if (count) { count.removeAttribute('data-i18n'); count.dataset.prismCount = section.querySelectorAll('.product-card').length; }
    });
    const updateCounts = () => {
      document.querySelectorAll('[data-prism-count]').forEach(el => {
        el.textContent = el.dataset.prismCount + (zh() ? ' 件作品' : ' pieces');
      });
      document.querySelectorAll('.category-label[data-category]').forEach(el => {
        const category=el.dataset.category;
        const en=category==='Earring Stud'?'Earring Studs':category==='Brooch'?'Brooches':category+'s';
        el.textContent=zh() && typeof translations!=='undefined' ? translations['zh-HK']['category-'+category] || en : en;
      });
      if(footer) {
        const text=zh()?['電子通訊','私隱政策','Cookie 政策','私人預約']:['Newsletter','Privacy','Cookies','Private appointments'];
        footer.querySelectorAll('.prism-footer-links a').forEach((link,index)=>{link.textContent=text[index];});
      }
    };
    updateCounts();
    new MutationObserver(updateCounts).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    document.querySelectorAll('.faq-question').forEach(question => {
      question.tabIndex = 0; question.setAttribute('role','button');
      const item = question.closest('.faq-item');
      const sync = () => question.setAttribute('aria-expanded', String(item.classList.contains('active')));
      sync(); new MutationObserver(sync).observe(item,{attributes:true,attributeFilter:['class']});
      question.addEventListener('keydown', e => {if(e.key==='Enter'||e.key===' '){e.preventDefault();question.click();}});
    });
    document.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.product-card')) {e.preventDefault(); e.target.click();}
    });
    // Silver products in All Collections open the existing full-payment checkout page.
    if (location.pathname.endsWith('view-catalogue.html')) {
      const modalActions = document.querySelector('#productModal .modal-actions');
      if (modalActions) {
        const buy = document.createElement('a'); buy.className = 'modal-buy-now'; buy.textContent = 'Buy Now'; buy.hidden = true;
        modalActions.prepend(buy);
        document.addEventListener('click', e => {
          const card = e.target.closest('.product-card'); if (!card) return;
          const silver = !!card.closest('#silverCollection'); buy.hidden = !silver;
          if (silver) {buy.textContent = zh() ? '立即購買' : 'Buy Now'; buy.href = 'silver-collection.html?checkout=1&product=' + encodeURIComponent(card.querySelector('[data-product-name]').dataset.productName);}
        });
      }
    }
    if (document.querySelector('.product-card')) {
      const selected = new URLSearchParams(location.search).get('product');
      const card = [...document.querySelectorAll('.product-card')].find(c => c.querySelector('[data-product-name]')?.dataset.productName === selected);
      if (card) requestAnimationFrame(() => {card.click(); if(new URLSearchParams(location.search).get('checkout')==='1') document.querySelector('#modalBuyNow')?.click();});
    }
    const image = document.querySelector('#modalImg');
    if (image) {
      image.tabIndex = 0; image.setAttribute('role','button'); image.setAttribute('aria-label','Zoom product image'); image.setAttribute('aria-pressed','false');
      const zoom = () => {const on = image.classList.toggle('prism-zoomed'); image.setAttribute('aria-pressed',String(on));};
      image.addEventListener('click', zoom);
      image.addEventListener('keydown', e => {if(e.key==='Enter'||e.key===' '){e.preventDefault();zoom();}});
      new MutationObserver(() => {image.classList.remove('prism-zoomed');image.setAttribute('aria-pressed','false');}).observe(image,{attributes:true,attributeFilter:['src']});
    }
    const newsletter = document.querySelector('#emailSubscriptionPopup');
    if (newsletter) {
      const column = newsletter.querySelector('.email-subscription-text-column');
      if (column) {
        const options = document.createElement('div'); options.className = 'prism-newsletter-options';
        const privacy = document.createElement('a');privacy.href='privacy-policy.html'; privacy.textContent=zh()?'私隱政策':'Privacy policy';
        const later = document.createElement('button');later.type='button';later.textContent=zh()?'稍後再說':'Perhaps later';later.addEventListener('click',()=>document.querySelector('#emailSubscriptionCloseX')?.click());
        options.append(privacy,later);column.append(options);
        const localize = () => {privacy.textContent=zh()?'私隱政策':'Privacy policy';later.textContent=zh()?'稍後再說':'Perhaps later';privacy.href='privacy-policy.html?lang='+(zh()?'zh-HK':'en');};
        new MutationObserver(localize).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
      }
      newsletter.querySelectorAll('input[name="Email"]').forEach(input=>{input.type='email';input.required=true;input.autocomplete='email';});
    }
    // All modal variants share keyboard containment and return focus to their opener.
    let previousFocus = null;
    const visible = root => [...root.querySelectorAll('a[href],button,input,select,textarea,[tabindex="0"]')].filter(el=>!el.disabled && el.getClientRects().length && !el.hidden);
    const overlays = [...document.querySelectorAll('.modal-overlay')];
    overlays.forEach(overlay => {
      overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');
      overlay.setAttribute('aria-label',overlay.id==='emailSubscriptionModal'?'Newsletter':overlay.id==='checkoutModal'?'Checkout':'Product and service information');
      new MutationObserver(() => {
        if(overlay.classList.contains('active')) {previousFocus=document.activeElement;requestAnimationFrame(()=>visible(overlay)[0]?.focus());}
        else if(!overlays.some(o=>o.classList.contains('active'))) {previousFocus?.focus();}
      }).observe(overlay,{attributes:true,attributeFilter:['class']});
    });
    document.addEventListener('keydown', e=>{
      if(e.key!=='Tab')return;
      const overlay=overlays.findLast(o=>o.classList.contains('active'));if(!overlay)return;
      const items=visible(overlay),first=items[0],last=items.at(-1);if(!first)return;
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    });
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();
})();
