// Minimal interactivity: render projects from JSON, enable simple tag filters.
const grid = document.getElementById('project-grid');
const buttons = document.querySelectorAll('.filters button');
const yearEl = document.getElementById('year');
yearEl && (yearEl.textContent = new Date().getFullYear());

let projects = [];

fetch('projects.json')
  .then(r => r.json())
  .then(data => { projects = data; render('all'); })
  .catch(() => { grid.innerHTML = '<p>Unable to load projects.json. Add the file at the repo root.</p>'; });

buttons.forEach(btn => btn.addEventListener('click', () => {
  buttons.forEach(b => b.setAttribute('aria-pressed', 'false'));
  btn.setAttribute('aria-pressed', 'true');
  render(btn.dataset.filter);
}));

function render(filter) {
  const items = projects.filter(p => filter === 'all' || p.tags.includes(filter));
  grid.innerHTML = items.map(card).join('');
}

function card(p) {
  const tags = p.tags.map(t => `<span class="tag">${t}</span>`).join('');
  const links = [
    p.demo && `<a href="${p.demo}" target="_blank" rel="noopener">Demo</a>`,
    p.code && `<a href="${p.code}" target="_blank" rel="noopener">Code</a>`,
    p.post && `<a href="${p.post}" target="_blank" rel="noopener">Write‑up</a>`
  ].filter(Boolean).join('<span aria-hidden="true">·</span>');

  return `
    <article class="card">
      <h3>${p.title}</h3>
      <p>${p.summary}</p>
      <div class="tags" aria-label="tags">${tags}</div>
      <div class="links">${links}</div>
    </article>
  `;
}
