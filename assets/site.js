// Progressive enhancement: all content and full-size links work without JavaScript.
const button = document.getElementById('inspect-model');
const figure = document.getElementById('model-figure');
button.hidden = false;
button.addEventListener('click', () => {
  const expanded = button.getAttribute('aria-expanded') !== 'true';
  button.setAttribute('aria-expanded', String(expanded));
  figure.classList.toggle('zoomed', expanded);
  button.textContent = expanded ? 'Fit architecture to page' : 'Enlarge architecture';
});

const sections = [...document.querySelectorAll('main > section[id]')];
const links = [...document.querySelectorAll('.toc a')];
const visible = new Map();
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => visible.set(entry.target.id, entry.isIntersecting));
  const current = sections.find(section => visible.get(section.id));
  links.forEach(link => {
    if (current && link.hash === '#' + current.id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}, {rootMargin: '-12% 0px -45% 0px'});
sections.forEach(section => observer.observe(section));

// Native dialog provides modal focus, Escape dismissal and an accessible name.
document.querySelectorAll('.figure a').forEach(link => {
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (typeof HTMLDialogElement === 'undefined') return;
    event.preventDefault();
    const source = link.closest('figure').querySelector('img');
    const dialog = document.createElement('dialog');
    dialog.className = 'image-dialog';
    dialog.setAttribute('aria-label', 'Full-size research figure');
    const toolbar = document.createElement('div'); toolbar.className = 'dialog-toolbar';
    const title = document.createElement('p'); title.textContent = source.alt;
    const close = document.createElement('button'); close.type = 'button'; close.textContent = 'Close ✕';
    const area = document.createElement('div'); area.className = 'dialog-image'; area.tabIndex = 0; area.setAttribute('role', 'region'); area.setAttribute('aria-label', 'Research figure; scroll to inspect enlarged image');
    const zoom = document.createElement('button'); zoom.type = 'button'; zoom.textContent = 'Zoom in'; zoom.setAttribute('aria-pressed', 'false');
    const img = document.createElement('img'); img.src = source.src; img.alt = source.alt;
    area.append(img); toolbar.append(title, zoom, close); dialog.append(toolbar, area); document.body.append(dialog);
    zoom.addEventListener('click', () => {
      const enlarged = zoom.getAttribute('aria-pressed') !== 'true';
      zoom.setAttribute('aria-pressed', String(enlarged)); zoom.textContent = enlarged ? 'Fit image' : 'Zoom in';
      img.style.width = enlarged ? Math.min(source.naturalWidth, 2200) + 'px' : '100%';
      img.style.maxWidth = enlarged ? 'none' : '100%';
    });
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => { dialog.remove(); link.focus({preventScroll:true}); });
    dialog.showModal(); close.focus();
  });
});
