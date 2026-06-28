// Paleta de cores por disciplina/idioma. Atribuída automaticamente na ordem
// em que cada chave aparece pela primeira vez no catálogo, usando as cores
// da marca. Se houver mais chaves que cores, a paleta se repete.
const BRAND_PALETTE = ['#DD016F', '#0094DA', '#85BB41', '#FFCB01', '#4A4629'];
const colorMap = {};
const nameByKey = {};

function getColor(key) {
  if (!colorMap[key]) {
    const usedCount = Object.keys(colorMap).length;
    colorMap[key] = BRAND_PALETTE[usedCount % BRAND_PALETTE.length];
  }
  return colorMap[key];
}

// Retorna as chaves "filtráveis" de uma coleção (disciplinas ou idiomas),
// usadas tanto no card (tags) quanto no filtro do topo.
// Coleções sem disciplina/idioma (faixa-direta, link-unico) retornam [].
function getFilterKeysForItem(item) {
  const keys = [];
  if (item.type === 'ano-disciplina') {
    item.years.forEach(year => {
      year.disciplines.forEach(d => { if (!keys.includes(d.key)) keys.push(d.key); });
    });
  } else if (item.type === 'ano-idioma') {
    item.years.forEach(year => {
      year.languages.forEach(l => { if (!keys.includes(l.key)) keys.push(l.key); });
    });
  }
  return keys;
}

function collectionMatchesFilter(item, filter) {
  if (filter === 'todas') return true;
  return getFilterKeysForItem(item).includes(filter);
}

// Pré-popula cores e nomes percorrendo o catálogo inteiro, para que a mesma
// chave (ex: "portugues") tenha sempre a mesma cor e nome em todo o site.
(function initColorsAndNames() {
  CATALOG.forEach(item => {
    getFilterKeysForItem(item).forEach(key => {
      getColor(key);
      if (!nameByKey[key]) {
        if (item.type === 'ano-disciplina') {
          const d = item.years.flatMap(y => y.disciplines).find(x => x.key === key);
          if (d) nameByKey[key] = d.name;
        } else if (item.type === 'ano-idioma') {
          const l = item.years.flatMap(y => y.languages).find(x => x.key === key);
          if (l) nameByKey[key] = l.name;
        }
      }
    });
  });
})();

function buildDisciplineNav() {
  const nav = document.getElementById('disciplineNav');
  Object.keys(nameByKey).forEach(key => {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.dataset.discipline = key;
    chip.textContent = nameByKey[key];
    nav.appendChild(chip);
  });
}

function buildStripeGradient(colors) {
  if (colors.length === 0) return 'var(--marrom)';
  if (colors.length === 1) return colors[0];
  return `linear-gradient(90deg, ${colors.map((c, i) => `${c} ${i * 100 / colors.length}% ${(i + 1) * 100 / colors.length}%`).join(', ')})`;
}

function renderCatalog(filter) {
  const catalog = document.getElementById('catalog');
  catalog.innerHTML = '';

  const items = CATALOG.filter(item => collectionMatchesFilter(item, filter));

  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'book-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Ver detalhes de ' + item.title);

    const keys = getFilterKeysForItem(item);
    let tagsHtml;
    if (keys.length) {
      tagsHtml = keys.map(key => `<span class="discipline-tag" style="color:${getColor(key)}">${nameByKey[key]}</span>`).join('');
    } else if (item.type === 'faixa-direta') {
      tagsHtml = `<span class="discipline-tag" style="color:${BRAND_PALETTE[2]}">Educação Digital</span>`;
    } else {
      tagsHtml = `<span class="discipline-tag" style="color:${BRAND_PALETTE[4]}">Regionalizado</span>`;
    }

    const colors = keys.length ? keys.map(getColor) : [item.type === 'faixa-direta' ? BRAND_PALETTE[2] : BRAND_PALETTE[4]];
    const stripeGradient = buildStripeGradient(colors);

    card.innerHTML = `
      <div class="book-card-stripe" style="background:${stripeGradient}"></div>
      <div class="book-card-body">
        <div class="tag-row">${tagsHtml}</div>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <span class="card-cta">Ver vídeo e materiais →</span>
      </div>
    `;

    card.addEventListener('click', () => handleCardClick(item));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCardClick(item);
      }
    });

    catalog.appendChild(card);
  });

  if (items.length === 0) {
    catalog.innerHTML = '<p class="empty-state">Nenhuma coleção encontrada para esse filtro.</p>';
  }
}

// Decide o que fazer ao clicar num card, de acordo com o tipo da coleção.
function handleCardClick(item) {
  openCollectionModal(item);
}

// Insere o player do YouTube. Se a página estiver sendo aberta direto do
// computador (protocolo file://), o YouTube bloqueia o embed por segurança —
// nesse caso mostramos um botão para abrir o vídeo direto no YouTube.
function renderVideo(item) {
  const videoBox = document.getElementById('modalVideo');
  const watchUrl = `https://www.youtube.com/watch?v=${item.youtube}`;

  if (window.location.protocol === 'file:') {
    videoBox.innerHTML = `
      <div class="video-fallback">
        <p>O vídeo não pode ser exibido aqui porque a página foi aberta direto do computador.</p>
        <p>Quando o site estiver publicado na internet, o vídeo aparece normalmente.</p>
        <a href="${watchUrl}" target="_blank" rel="noopener noreferrer" class="video-fallback-btn">▶ Assistir no YouTube</a>
      </div>`;
    return;
  }

  videoBox.innerHTML =
    `<iframe src="https://www.youtube.com/embed/${item.youtube}" title="${item.title}" allowfullscreen></iframe>`;
}

function renderOptionsGrid(options) {
  // options: array de { label, url, color? }
  const optionsGrid = document.getElementById('optionsGrid');
  optionsGrid.innerHTML = '';
  optionsGrid.className = 'year-grid';

  options.forEach(opt => {
    if (opt.url) {
      const a = document.createElement('a');
      a.href = opt.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'year-btn';
      if (opt.color) a.style.color = opt.color;
      a.textContent = opt.label;
      optionsGrid.appendChild(a);
    } else {
      const span = document.createElement('span');
      span.className = 'year-btn year-btn-disabled';
      span.textContent = opt.label;
      span.title = 'Material ainda não disponível';
      optionsGrid.appendChild(span);
    }
  });
}

function renderChoiceGrid(options, onSelect) {
  // options: array de { label, ... }
  const optionsGrid = document.getElementById('optionsGrid');
  optionsGrid.innerHTML = '';
  optionsGrid.className = 'discipline-grid';

  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'discipline-btn';
    btn.textContent = opt.label;
    btn.addEventListener('click', () => onSelect(opt));
    optionsGrid.appendChild(btn);
  });
}

// Para coleções "link-unico": um único botão de destaque, não uma grade.
function renderSingleCta(label, url) {
  const optionsGrid = document.getElementById('optionsGrid');
  optionsGrid.innerHTML = '';
  optionsGrid.className = 'cta-wrap';

  if (url) {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'cta-btn';
    a.textContent = label;
    optionsGrid.appendChild(a);
  } else {
    const span = document.createElement('span');
    span.className = 'cta-btn cta-btn-disabled';
    span.textContent = label;
    span.title = 'Material ainda não disponível';
    optionsGrid.appendChild(span);
  }
}

// Nível 1 do modal: vídeo da coleção + primeira escolha (ano ou faixa)
function openCollectionModal(item) {
  const overlay = document.getElementById('modalOverlay');

  document.getElementById('modalDiscipline').textContent = 'Coleção';
  document.getElementById('modalDiscipline').removeAttribute('style');
  document.getElementById('modalTitle').textContent = item.title;
  document.getElementById('modalDesc').textContent = item.description;

  renderVideo(item);
  document.getElementById('backBtn').style.display = 'none';

  if (item.type === 'faixa-direta') {
    document.getElementById('modalLabel').textContent = 'Escolha a faixa de anos';
    renderOptionsGrid(item.ranges.map(r => ({ label: r.label, url: r.url })));
  } else if (item.type === 'ano-disciplina') {
    document.getElementById('modalLabel').textContent = 'Escolha o ano escolar';
    renderChoiceGrid(
      item.years.map(y => ({ label: y.label, year: y })),
      (opt) => openDisciplineStep(item, opt.year)
    );
  } else if (item.type === 'ano-idioma') {
    document.getElementById('modalLabel').textContent = 'Escolha o ano escolar';
    renderChoiceGrid(
      item.years.map(y => ({ label: y.label, year: y })),
      (opt) => openLanguageStep(item, opt.year)
    );
  } else if (item.type === 'link-unico') {
    document.getElementById('modalLabel').textContent = 'Material completo';
    renderSingleCta('Acessar obra', item.url);
  }

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// Nível 2 (tipo ano-disciplina): escolha da disciplina daquele ano
function openDisciplineStep(item, year) {
  document.getElementById('modalDiscipline').textContent = year.label;
  document.getElementById('modalDiscipline').removeAttribute('style');
  document.getElementById('modalLabel').textContent = 'Escolha a disciplina';

  renderOptionsGrid(year.disciplines.map(d => ({ label: d.name, url: d.url, color: getColor(d.key) })));

  const backBtn = document.getElementById('backBtn');
  backBtn.textContent = '← Voltar para os anos';
  backBtn.style.display = 'inline-flex';
  backBtn.onclick = () => openCollectionModal(item);
}

// Nível 2 (tipo ano-idioma): escolha do idioma daquele ano
function openLanguageStep(item, year) {
  document.getElementById('modalDiscipline').textContent = year.label;
  document.getElementById('modalDiscipline').removeAttribute('style');
  document.getElementById('modalLabel').textContent = 'Escolha o idioma';

  renderOptionsGrid(year.languages.map(l => ({ label: l.name, url: l.url, color: getColor(l.key) })));

  const backBtn = document.getElementById('backBtn');
  backBtn.textContent = '← Voltar para os anos';
  backBtn.style.display = 'inline-flex';
  backBtn.onclick = () => openCollectionModal(item);
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.getElementById('modalVideo').innerHTML = '';
  document.body.style.overflow = '';
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if (e.target.id === 'modalOverlay') closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

buildDisciplineNav();

document.getElementById('disciplineNav').addEventListener('click', (e) => {
  if (!e.target.classList.contains('chip')) return;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  e.target.classList.add('active');
  renderCatalog(e.target.dataset.discipline);
});

renderCatalog('todas');

