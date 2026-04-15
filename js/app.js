/**
 * ARスタンプラリー - コアロジック
 * スタンプの取得・保存・読み込みを管理する。
 * localStorage キー: 'stamp-rally-stamps'（取得済みスタンプIDの配列を JSON 文字列で保存）
 */

const STORAGE_KEY = 'stamp-rally-stamps';
const TOTAL_STAMPS = 5;

function getCollectedStamps() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function isStampCollected(id) {
  return getCollectedStamps().includes(Number(id));
}

function collectStamp(id) {
  const collected = getCollectedStamps();
  const numId = Number(id);
  if (collected.includes(numId)) return false;
  collected.push(numId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collected));
  return true;
}

function resetAllStamps() {
  localStorage.removeItem(STORAGE_KEY);
}

function isComplete() {
  return getCollectedStamps().length >= TOTAL_STAMPS;
}

function getStampIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return null;
  const num = Number(id);
  if (!Number.isInteger(num) || num < 1 || num > TOTAL_STAMPS) return null;
  return num;
}

/**
 * キャラクター画像 or 絵文字のHTMLを返す（スタンプカード用）
 */
function stampIconHTML(stamp, done) {
  if (!done) {
    return '<span class="stamp-lock-icon">?</span>';
  }
  if (stamp.image) {
    // data-fallback にフォールバック絵文字を格納し、onerror で差し替え
    return `<img src="${stamp.image}" class="stamp-char-img" alt="${stamp.name}" data-fallback="${stamp.emoji}" onerror="this.outerHTML=this.dataset.fallback">`;
  }
  return stamp.emoji;
}

/**
 * index.html 用: スタンプカード一覧を DOM に描画する
 */
function renderStampGrid() {
  const grid = document.getElementById('stamp-grid');
  if (!grid) return;

  const collected = getCollectedStamps();

  grid.innerHTML = STAMPS_CONFIG.map((stamp) => {
    const done = collected.includes(stamp.id);
    // 画像ありはうっすら色付き背景、絵文字のみは濃い背景
    const iconBg  = done ? (stamp.image ? `${stamp.color}18` : stamp.color) : '#e0e0e0';
    const iconBorder = done ? stamp.color : '#ccc';

    return `
      <div class="stamp-card ${done ? 'collected' : 'locked'}">
        <div class="stamp-icon" style="background:${iconBg};border:3px solid ${iconBorder};">
          ${stampIconHTML(stamp, done)}
        </div>
        <div class="stamp-info">
          <p class="stamp-name">${stamp.name}</p>
          <p class="stamp-sub">${done ? stamp.subtitle : '未取得'}</p>
        </div>
        ${done ? `<a class="btn-ar" href="stamp.html?id=${stamp.id}" style="background:${stamp.color}">詳細</a>` : ''}
      </div>
    `;
  }).join('');

  // 進捗バーを更新
  const count = collected.length;
  const progress = document.getElementById('progress-count');
  const bar = document.getElementById('progress-bar');
  if (progress) progress.textContent = `${count} / ${TOTAL_STAMPS}`;
  if (bar) bar.style.width = `${(count / TOTAL_STAMPS) * 100}%`;

  if (count >= TOTAL_STAMPS) {
    const banner = document.getElementById('complete-banner');
    if (banner) banner.classList.remove('hidden');
  }
}

/**
 * stamp.html 用: スタンプ取得処理を実行する
 */
function handleStampCollection() {
  const id = getStampIdFromURL();
  const errorEl  = document.getElementById('stamp-error');
  const contentEl = document.getElementById('stamp-content');
  const loadingEl = document.getElementById('stamp-loading');

  if (loadingEl) loadingEl.classList.add('hidden');

  if (!id) {
    if (errorEl) errorEl.classList.remove('hidden');
    return;
  }

  const stamp = getStampById(id);
  if (!stamp) {
    if (errorEl) errorEl.classList.remove('hidden');
    return;
  }

  // スタンプ情報をDOMにセット
  const nameEl = document.getElementById('stamp-name');
  const subEl  = document.getElementById('stamp-subtitle');
  const descEl = document.getElementById('stamp-description');
  const iconEl = document.getElementById('stamp-icon');
  const arBtn  = document.getElementById('btn-view-ar');

  if (nameEl) nameEl.textContent = stamp.name;
  if (subEl)  subEl.textContent  = stamp.subtitle;
  if (descEl) descEl.textContent = stamp.description;

  // キャラクター画像 or 絵文字を詳細アイコンに表示
  if (iconEl) {
    iconEl.style.background  = stamp.image ? `${stamp.color}18` : stamp.color;
    iconEl.style.border      = `4px solid ${stamp.color}`;
    iconEl.style.boxShadow   = `0 4px 24px ${stamp.color}55`;

    if (stamp.image) {
      const img = document.createElement('img');
      img.src   = stamp.image;
      img.alt   = stamp.name;
      img.style.cssText = 'width:90%;height:90%;object-fit:contain;';
      img.onerror = () => {
        iconEl.removeChild(img);
        iconEl.textContent       = stamp.emoji;
        iconEl.style.background  = stamp.color;
        iconEl.style.fontSize    = '3rem';
      };
      iconEl.innerHTML = '';
      iconEl.appendChild(img);
    } else {
      iconEl.textContent = stamp.emoji;
    }
  }

  if (arBtn) arBtn.href = `ar.html?id=${stamp.id}`;

  const isNew    = collectStamp(id);
  const statusEl = document.getElementById('stamp-status');

  if (isNew) {
    if (statusEl) {
      statusEl.textContent = '🎉 スタンプをゲット！';
      statusEl.classList.add('new');
    }
    if (contentEl) contentEl.classList.add('animate-in');
  } else {
    if (statusEl) {
      statusEl.textContent = '✅ 取得済み';
      statusEl.classList.add('already');
    }
  }

  if (contentEl) contentEl.classList.remove('hidden');

  if (isComplete()) {
    const completeBanner = document.getElementById('complete-banner');
    if (completeBanner) completeBanner.classList.remove('hidden');
  }
}

/**
 * ar.html 用: ARシーンにモデルをセットする（将来用）
 */
function setupARScene() {
  const id      = getStampIdFromURL();
  const errorEl = document.getElementById('ar-error');

  if (!id || !getStampById(id)) {
    if (errorEl) errorEl.classList.remove('hidden');
    return;
  }

  const stamp = getStampById(id);

  if (!isStampCollected(id)) {
    if (errorEl) {
      errorEl.textContent = 'このスタンプはまだ取得されていません。QRコードをスキャンしてください。';
      errorEl.classList.remove('hidden');
    }
    return;
  }

  const modelEl = document.getElementById('ar-character');
  if (modelEl) {
    modelEl.setAttribute('gltf-model', stamp.model);
    modelEl.setAttribute('scale', stamp.modelScale || '0.5 0.5 0.5');
    modelEl.setAttribute('position', stamp.modelPosition || '0 0 0');
    modelEl.setAttribute('rotation', stamp.modelRotation || '0 0 0');
  }

  const titleEl = document.getElementById('ar-title');
  if (titleEl) titleEl.textContent = `${stamp.emoji} ${stamp.name}`;
}
