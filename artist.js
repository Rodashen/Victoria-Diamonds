/* Progressive enhancement only: biography, images and links work without JavaScript. */
document.addEventListener('DOMContentLoaded', () => {
 'use strict';
 const dialog = document.querySelector('.artist-lightbox');
 let opener = null;
 if (dialog && typeof dialog.showModal === 'function') {
  document.querySelectorAll('[data-artwork]').forEach(link => link.addEventListener('click', event => {
   if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
   event.preventDefault();
   opener = link;
   const figure = link.closest('figure');
   const image = dialog.querySelector('img');
   image.src = link.href;
   image.alt = link.querySelector('img').alt;
   dialog.querySelector('h2').textContent = figure.querySelector('h3').innerText.replace(/\s+/g, ' ').trim();
   dialog.querySelector('p').textContent = figure.querySelector('figcaption p').textContent;
   dialog.showModal();
  }));
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => opener?.focus());
 }
 const share = document.querySelector('[data-share-artist]');
 const status = document.querySelector('.artist-share-status');
 if (share) {
  share.hidden = false;
  share.addEventListener('click', async () => {
   const url = document.querySelector('link[rel="canonical"]').href;
   try {
    if (navigator.share) await navigator.share({ title: 'Rachel Gemma Tan | Victoria Diamonds', url });
    else if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(url); status.textContent = 'Artist page link copied. Ready to share.'; }
    else status.textContent = 'Share this link: ' + url;
   } catch (error) { if (error.name !== 'AbortError') status.textContent = 'Share this link: ' + url; }
  });
 }
});
