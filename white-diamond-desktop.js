const showcase = document.querySelector('#review-cards');
const products = new Map(window.VDProducts.products.map(product => [product.id, product]));
const selected = [...showcase.querySelectorAll('[data-review-id]')].map(node => products.get(node.dataset.reviewId)).filter(Boolean);
const category = document.querySelector('#review-category');
const query = document.querySelector('#review-query');
const sort = document.querySelector('#review-sort');
const count = document.querySelector('#review-count');
for (const value of [...new Set(selected.map(product => product.category))].sort()) {
  category.add(new Option(window.VDProductCards.categoryName(value), value));
}
function render() {
  const search = query.value.trim().toLowerCase();
  const matches = selected.filter(product => (!category.value || product.category === category.value) && product.name.toLowerCase().includes(search));
  if (sort.value === 'price') matches.sort((a,b) => (window.VDProductCards.price(a) ?? Infinity) - (window.VDProductCards.price(b) ?? Infinity));
  showcase.replaceChildren(...matches.map(window.VDProductCards.create));
  count.textContent = `${matches.length} ${matches.length === 1 ? 'design' : 'designs'}`;
}
query.addEventListener('input', render);
category.addEventListener('change', render);
sort.addEventListener('change', render);
render();
document.body.classList.add('white-desktop-ready');
