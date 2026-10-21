/* Shared previous-page navigation. Never changes product configuration or checkout. */
document.addEventListener('DOMContentLoaded', () => {
 'use strict';
 const zh = () => document.documentElement.lang.startsWith('zh');
 const pageKey = value => { const url = new URL(value, location.href); return url.origin + url.pathname.replace(/\.html$/, '').replace(/\/$/, '') + url.search; };
 const arrivalLength = history.length;
 function fallback() {
  if (document.referrer && new URL(document.referrer).origin === location.origin && pageKey(document.referrer) !== pageKey(location.href)) return document.referrer;
  const product = window.VDProducts?.products.find(piece => piece.id === new URLSearchParams(location.search).get('item'));
  if (product && window.VDProducts.collections[product.collection]) return window.VDProducts.collections[product.collection][1];
  return /journal-/.test(location.pathname) ? 'journal.html' : 'view-catalogue.html';
 }
 function back(event) {
  event.preventDefault();
  // Skip same-page anchors such as #order; return to the preceding document.
  const entries = window.navigation?.entries?.();
  if (entries) {
   const current = window.navigation.currentEntry.index;
   const previous = entries.filter(entry => entry.index < current && entry.url && pageKey(entry.url) !== pageKey(location.href)).pop();
   if (previous) { window.navigation.traverseTo(previous.key); return; }
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
 function buyingButtons() {
  document.querySelectorAll('#order,.daily-checkout').forEach(section => {
   if (section.id !== 'order' && section.closest('#order')) return;
   if (section.querySelector('[data-page-back]')) return;
   const button = document.createElement('button');
   button.type = 'button'; button.className = 'page-back-link page-buying-back'; button.dataset.pageBack = '';
   section.prepend(button);
  });
  refresh();
 }
 document.querySelectorAll('a[href]').forEach(link => {
  const local = new URL(link.href, location.href).origin === location.origin;
  if (local && (/^\s*←?\s*Back\b/i.test(link.textContent) || link.matches('.back-link')) && !link.hasAttribute('data-page-back')) {
   link.dataset.pageBack = '';
   if (link.closest('header')) link.classList.add('page-back-legacy');
  }
 });
 buyingButtons();
 new MutationObserver(records => {
  if (records.some(record => [...record.addedNodes].some(node => node.nodeType === 1 && (node.matches?.('#order,.daily-checkout') || node.querySelector?.('#order,.daily-checkout'))))) buyingButtons();
 }).observe(document.body, { childList: true, subtree: true });
 new MutationObserver(refresh).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
});
