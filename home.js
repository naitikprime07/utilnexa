const header = document.querySelector('header');
const nav = document.querySelector('nav');
const form = document.querySelector('.searchBar');
const input = document.querySelector('#search');
const status = document.querySelector('.search-status');
const panels = [nav, form];
let opener;

function closePanels() {
  panels.forEach(panel => panel.classList.remove('open_state'));
  document.querySelectorAll('[aria-expanded]').forEach(button => button.setAttribute('aria-expanded', 'false'));
  document.body.style.overflowY = '';
}

for (const [selector, panel, label] of [['.menu_open', nav, 'Open navigation'], ['.search_open', form, 'Open search']]) {
  const button = document.querySelector(selector);
  button.setAttribute('aria-label', label);
  button.setAttribute('aria-expanded', 'false');
  button.addEventListener('click', () => {
    closePanels();
    opener = button;
    panel.classList.add('open_state');
    button.setAttribute('aria-expanded', 'true');
    document.body.style.overflowY = 'hidden';
    (panel === form ? input : nav.querySelector('a')).focus();
  });
}
document.querySelectorAll('.close_btn').forEach(button => {
  button.type = 'button';
  button.setAttribute('aria-label', 'Close panel');
  button.addEventListener('click', () => { closePanels(); opener?.focus(); });
});
document.querySelector('#go').setAttribute('aria-label', 'Search articles');
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') { closePanels(); opener?.focus(); }
});
nav.addEventListener('click', event => { if (event.target.closest('a')) closePanels(); });
window.addEventListener('resize', () => { if (innerWidth > 769) closePanels(); });
window.addEventListener('scroll', () => {
  header.querySelector('.center').classList.toggle('headerScroll', scrollY > 0);
}, { passive: true });
new ResizeObserver(() => {
  document.querySelector('.padding').style.height = `${header.getBoundingClientRect().height + 10}px`;
}).observe(header);

function filterArticles() {
  const query = input.value.trim().toLowerCase();
  let count = 0;
  document.querySelectorAll('main .items').forEach(card => {
    card.hidden = !card.textContent.toLowerCase().includes(query);
    if (!card.hidden) count++;
  });
  document.querySelectorAll('.list, .main-right').forEach(section => {
    section.hidden = !section.querySelector('.items:not([hidden])');
  });
  status.hidden = !query;
  status.textContent = count ? `${count} articles found for “${input.value.trim()}”.` : 'No articles found. Try another search.';
  document.querySelector('.banner').hidden = Boolean(query);
}
input.addEventListener('input', filterArticles);
form.addEventListener('submit', event => {
  event.preventDefault();
  filterArticles();
  closePanels();
  if (input.value.trim()) status.scrollIntoView({ block: 'center' });
});
