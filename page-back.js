/* Shared previous-page navigation. Never changes product configuration or checkout. */
document.addEventListener('DOMContentLoaded', () => {
 'use strict';
 const zh = () => document.documentElement.lang.startsWith('zh');
 if(location.pathname==='/'||location.pathname==='/VictoriaDiamonds/'||/\/index(?:\.html)?$/.test(location.pathname))return;
 const pageKey = value => { const url = new URL(value, location.href); url.searchParams.delete('lang');return url.origin + url.pathname.replace(/\.html$/, '').replace(/\/$/, '') + url.search; };
 const arrivalLength = history.length;
 const collectionPage = new Set(['daily-sparkle','high-note-collection','forever-bond','silver-collection','aura-collection','mens-collection','keepsake-collection','tennis-collection','halo-collection','pet-lover-collection','view-catalogue']).has(location.pathname.replace(/\/$/, '').split('/').pop().replace(/\.html$/, ''));
 function fallback() {
  if(/\/pet-lover-collection(?:\.html)?$/.test(location.pathname))return 'silver-collection.html';
  if (collectionPage) return 'index.html#collections';
  if (document.referrer && new URL(document.referrer).origin === location.origin && pageKey(document.referrer) !== pageKey(location.href)) return document.referrer;
  const product = window.VDProducts?.products.find(piece => piece.id === new URLSearchParams(location.search).get('item'));
  if (product && window.VDProducts.collections[product.collection]) return window.VDProducts.collections[product.collection][1];
  return /journal-/.test(location.pathname) ? 'journal.html' : 'view-catalogue.html';
 }
 function back(event) {
  event.preventDefault();
  if (collectionPage) { location.assign(fallback()); return; }
  // Skip same-page anchors such as #order; return to the preceding document.
  const entries = window.navigation?.entries?.();
  if (entries) {
   const current = window.navigation.currentEntry.index;
   const previous = entries.filter(entry => entry.index < current && entry.url && /^https?:/.test(entry.url) && pageKey(entry.url) !== pageKey(location.href)).pop();
   if (previous) { window.navigation.traverseTo(previous.key); return; }
   location.assign(fallback());return;
  }
  if (document.referrer && pageKey(document.referrer) !== pageKey(location.href) && history.length > 1) {
   history.go(-Math.max(1, history.length - arrivalLength + 1)); return;
  }
  location.assign(fallback());
 }
 function refresh() {
  document.querySelectorAll('[data-page-back]').forEach(link => {
   link.textContent = zh() ? '← 返回上一頁' : '← Back';
   link.setAttribute('aria-label', zh() ? '返回上一頁' : 'Go back to the previous page');
   if (collectionPage) link.setAttribute('aria-label', zh() ? '返回首頁系列' : 'Back to collections on the homepage');
   if (link.tagName === 'A') link.href = fallback();
  });
 }
 document.addEventListener('click', event => {
  const link = event.target.closest('[data-page-back]');
  if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const modal = link.closest('dialog:not(.inline-checkout)');
  if (modal) { event.preventDefault(); modal.close(); return; }
  back(event);
 });
 document.querySelectorAll('a[href]').forEach(link => {
  const local = new URL(link.href, location.href).origin === location.origin;
  if (local && (/^\s*←?\s*Back\b/i.test(link.textContent) || link.matches('.back-link')) && !link.hasAttribute('data-page-back')) {
   if(link.closest('header')&&document.querySelector('.page-back-bar')){link.remove();return;}
   link.textContent=zh()?'首頁':'Home';
  }
 });
 refresh();
 new MutationObserver(refresh).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
});
