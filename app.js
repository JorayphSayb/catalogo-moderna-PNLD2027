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

    const cardTop = item.image
      ? `<img src="${item.image}" alt="${item.title}" class="book-card-img">`
      : `<div class="book-card-stripe" style="background:${item.color || 'var(--marrom)'}"></div>`;

    card.innerHTML = `
      ${cardTop}
      <div class="book-card-body">
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
  const optionsGrid = document.getElementById('optionsGrid');
  optionsGrid.innerHTML = '';
  optionsGrid.className = 'year-grid';

  options.forEach(opt => {
    const wrapper = document.createElement('div');
    wrapper.className = 'year-btn-wrap';

    if (opt.url) {
      const a = document.createElement('a');
      a.href = opt.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'year-btn';
      if (opt.color) a.style.color = opt.color;
      a.textContent = opt.label;
      wrapper.appendChild(a);
    } else {
      const span = document.createElement('span');
      span.className = 'year-btn year-btn-disabled';
      span.textContent = opt.label;
      span.title = 'Material ainda não disponível';
      wrapper.appendChild(span);
    }

    if (opt.aiUrl) {
      const ai = document.createElement('a');
      ai.href = opt.aiUrl;
      ai.target = '_blank';
      ai.rel = 'noopener noreferrer';
      ai.className = 'ai-btn';
      ai.title = 'Perguntar à IA sobre esta obra';
      ai.textContent = '💬 IA';
      wrapper.appendChild(ai);
    }

    optionsGrid.appendChild(wrapper);
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
function renderSingleCta(label, url, aiUrl) {
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
    optionsGrid.appendChild(span);
  }

  if (aiUrl) {
    const ai = document.createElement('a');
    ai.href = aiUrl;
    ai.target = '_blank';
    ai.rel = 'noopener noreferrer';
    ai.className = 'cta-ai-btn';
    ai.textContent = '💬 Perguntar à IA';
    optionsGrid.appendChild(ai);
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
    renderOptionsGrid(item.ranges.map(r => ({ label: r.label, url: r.url, aiUrl: r.aiUrl })));
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
    renderSingleCta('Acessar obra', item.url, item.aiUrl);
  }

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// Nível 2 (tipo ano-disciplina): escolha da disciplina daquele ano
function openDisciplineStep(item, year) {
  document.getElementById('modalDiscipline').textContent = year.label;
  document.getElementById('modalDiscipline').removeAttribute('style');
  document.getElementById('modalLabel').textContent = 'Escolha a disciplina';

  renderOptionsGrid(year.disciplines.map(d => ({ label: d.name, url: d.url, color: getColor(d.key), aiUrl: d.aiUrl })));

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

  renderOptionsGrid(year.languages.map(l => ({ label: l.name, url: l.url, color: getColor(l.key), aiUrl: l.aiUrl })));

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


// ==========================================
// MODAL PLANO DE AULA IA
// ==========================================
const planoBtn = document.getElementById('planoAulaBtn');
const planoOverlay = document.getElementById('planoOverlay');
const planoClose = document.getElementById('planoClose');

planoBtn.addEventListener('click', () => {
  document.getElementById('planoVideo').innerHTML =
    `<iframe src="https://www.youtube.com/embed/4epEQzWUT4s" title="Plano de Aula IA" allowfullscreen></iframe>`;
  planoOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
});

planoClose.addEventListener('click', () => {
  planoOverlay.classList.remove('open');
  document.getElementById('planoVideo').innerHTML = '';
  document.body.style.overflow = '';
});

planoOverlay.addEventListener('click', (e) => {
  if (e.target.id === 'planoOverlay') {
    planoOverlay.classList.remove('open');
    document.getElementById('planoVideo').innerHTML = '';
    document.body.style.overflow = '';
  }
});

// ==========================================
// MODAL CÓDIGO DAS OBRAS
// ==========================================
const CODIGOS = {
  "Pitanguá": {
    "Português":         { "1º e 2º ano": "0045 P27 01 01 010 010", "3º ao 5º ano": "0056 P27 01 02 010 010" },
    "Matemática":        { "1º e 2º ano": "0050 P27 01 01 020 020", "3º ao 5º ano": "0061 P27 01 02 020 020" },
    "CHG":               { "1º e 2º ano": "0053 P27 01 01 037 037" },
    "Ciências":          { "3º ao 5º ano": "0064 P27 01 02 207 207" },
    "História":          { "3º ao 5º ano": "0066 P27 01 02 040 040" },
    "Geografia":         { "3º ao 5º ano": "0068 P27 01 02 050 050" },
    "Artes":             { "1º e 2º ano": "0047 P27 01 01 060 060", "3º ao 5º ano": "0058 P27 01 02 060 060" },
    "Produção de Texto": { "3º ao 5º ano": "0075 P27 01 02 038 038" },
  },
  "Buriti Raízes": {
    "Português":         { "1º e 2º ano": "0044 P27 01 01 010 010", "3º ao 5º ano": "0055 P27 01 02 010 010" },
    "Matemática":        { "1º e 2º ano": "0049 P27 01 01 020 020", "3º ao 5º ano": "0060 P27 01 02 020 020" },
    "CHG":               { "1º e 2º ano": "0052 P27 01 01 037 037" },
    "Ciências":          { "3º ao 5º ano": "0063 P27 01 02 207 207" },
    "História":          { "3º ao 5º ano": "0065 P27 01 02 040 040" },
    "Geografia":         { "3º ao 5º ano": "0067 P27 01 02 050 050" },
    "Artes":             { "1º e 2º ano": "0046 P27 01 01 060 060", "3º ao 5º ano": "0057 P27 01 02 060 060" },
    "Produção de Texto": { "3º ao 5º ano": "0074 P27 01 02 038 038" },
  },
  "Bit-a-Bit": {
    "Educação Digital":  { "1º e 2º ano": "0054 P27 01 01 099 099", "3º ao 5º ano": "0076 P27 01 02 099 099" },
  },
  "Língua Estrangeira": {
    "Inglês":            { "1º e 2º ano": "0077 P27 01 03 090 090", "3º ao 5º ano": "0079 P27 01 03 090 090" },
    "Espanhol":          { "1º e 2º ano": "0078 P27 01 03 098 098", "3º ao 5º ano": "0080 P27 01 03 098 098" },
  },
  "Moderna pelo Brasil": {
    "Nordeste":          { "3º ao 5º ano": "0070 P27 01 02 039 039" },
  },
};

const codigoBtn = document.getElementById('codigoObrasBtn');
const codigoOverlay = document.getElementById('codigoOverlay');
const codigoClose = document.getElementById('codigoClose');

function renderCodigoStep1() {
  const body = document.getElementById('codigoBody');
  body.innerHTML = `
    <h2 class="codigo-title">Código das Obras</h2>
    <p class="codigo-desc">Selecione a coleção para ver o código de inscrição no MEC.</p>
    <div class="codigo-grid">
      ${Object.keys(CODIGOS).map(col => `
        <button class="codigo-col-btn" onclick="renderCodigoStep2('${col.replace(/'/g, "\'")}')">${col}</button>
      `).join('')}
    </div>
  `;
}

function renderCodigoStep2(colecao) {
  const disciplinas = CODIGOS[colecao];
  const body = document.getElementById('codigoBody');
  body.innerHTML = `
    <button class="codigo-back" onclick="renderCodigoStep1()">← Voltar</button>
    <h2 class="codigo-title">${colecao}</h2>
    <p class="codigo-desc">Selecione a disciplina:</p>
    <div class="codigo-grid">
      ${Object.keys(disciplinas).map(disc => `
        <button class="codigo-col-btn" onclick="renderCodigoStep3('${colecao.replace(/'/g, "\'")}', '${disc.replace(/'/g, "\'")}')">${disc}</button>
      `).join('')}
    </div>
  `;
}

function renderCodigoStep3(colecao, disciplina) {
  const faixas = CODIGOS[colecao][disciplina];
  const body = document.getElementById('codigoBody');
  const faixasHtml = Object.entries(faixas).map(([faixa, codigo]) => `
    <div class="codigo-box">
      <div class="codigo-faixa">${faixa}</div>
      <div class="codigo-valor" id="cod-${faixa.replace(/\s/g,'-')}">${codigo}</div>
      <button class="codigo-copiar" onclick="copiarCodigo('${codigo}', this)">📋 Copiar código</button>
    </div>
  `).join('');

  body.innerHTML = `
    <button class="codigo-back" onclick="renderCodigoStep2('${colecao.replace(/'/g, "\'")}')")>← Voltar</button>
    <h2 class="codigo-title">${colecao} — ${disciplina}</h2>
    <p class="codigo-desc">Copie o código e use na plataforma do MEC para solicitar a obra:</p>
    ${faixasHtml}
  `;
}

function copiarCodigo(codigo, btn) {
  navigator.clipboard.writeText(codigo).then(() => {
    const original = btn.textContent;
    btn.textContent = '✅ Copiado!';
    btn.classList.add('copiado');
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove('copiado');
    }, 2000);
  });
}

codigoBtn.addEventListener('click', () => {
  renderCodigoStep1();
  codigoOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
});

codigoClose.addEventListener('click', () => {
  codigoOverlay.classList.remove('open');
  document.body.style.overflow = '';
});

codigoOverlay.addEventListener('click', (e) => {
  if (e.target.id === 'codigoOverlay') {
    codigoOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
});


// ==========================================
// MODAL RESENHA DAS OBRAS
// ==========================================
const resenhaBtn = document.getElementById('resenhaBtn');
const resenhaOverlay = document.getElementById('resenhaOverlay');
const resenhaClose = document.getElementById('resenhaClose');

resenhaBtn.addEventListener('click', () => {
  resenhaOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
});

resenhaClose.addEventListener('click', () => {
  resenhaOverlay.classList.remove('open');
  document.body.style.overflow = '';
});

resenhaOverlay.addEventListener('click', (e) => {
  if (e.target.id === 'resenhaOverlay') {
    resenhaOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
});

document.querySelectorAll('.resenha-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.resenha-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.resenha-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});


// ==========================================
// MODAL ATAS
// ==========================================
document.getElementById('atasBtn').addEventListener('click', () => {
  document.getElementById('atasOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
});
document.getElementById('atasClose').addEventListener('click', () => {
  document.getElementById('atasOverlay').classList.remove('open');
  document.body.style.overflow = '';
});
document.getElementById('atasOverlay').addEventListener('click', (e) => {
  if (e.target.id === 'atasOverlay') {
    document.getElementById('atasOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ==========================================
// MODAL GUIA PNLD
// ==========================================
document.getElementById('guiaBtn').addEventListener('click', () => {
  document.getElementById('guiaOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
});
document.getElementById('guiaClose').addEventListener('click', () => {
  document.getElementById('guiaOverlay').classList.remove('open');
  document.body.style.overflow = '';
});
document.getElementById('guiaOverlay').addEventListener('click', (e) => {
  if (e.target.id === 'guiaOverlay') {
    document.getElementById('guiaOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }
});

renderCatalog('todas');

