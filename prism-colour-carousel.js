document.addEventListener('DOMContentLoaded', () => {
 const track = document.querySelector('.colour-discovery-grid');
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('[data-colour-prev], [data-colour-next]').forEach(button => {
  button.addEventListener('click', () => {
   const card = track.querySelector('a');
   const direction = button.hasAttribute('data-colour-next') ? 1 : -1;
   track.scrollBy({left: direction * (card.offsetWidth + 14), behavior: reduced.matches ? 'instant' : 'smooth'});
  });
 });
});
