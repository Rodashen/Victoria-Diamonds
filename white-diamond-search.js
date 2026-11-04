const search = document.querySelector('#white-diamond-search');
const result = document.querySelector('#white-diamond-count');
const cards = [...document.querySelectorAll('.white-diamond-grid article')];
if (search && result) {
  const filter = () => {
    const query = search.value.trim().toLowerCase();
    let visible = 0;
    for (const card of cards) {
      card.hidden = !card.textContent.toLowerCase().includes(query);
      if (!card.hidden) visible += 1;
    }
    result.textContent = visible ? `${visible} ${visible === 1 ? 'design' : 'designs'}` : 'No matching designs.';
  };
  search.closest('.editorial-controls').hidden = false;
  search.addEventListener('input', filter);
  filter();
}
