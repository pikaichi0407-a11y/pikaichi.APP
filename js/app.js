/**
 * ARスタンプラリー - コアロジック
 * スタンプの取得・保存・読み込みを管理する。
 * localStorage キー: 'stamp-rally-stamps'（取得済みスタンプIDの配列を JSON 文字列で保存）
 */

const STORAGE_KEY = 'stamp-rally-stamps';
const TOTAL_STAMPS = 5;

/**
 * 取得済みスタンプIDの配列を返す
 * @returns {number[]}
 */
function getCollectedStamps() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * スタンプIDが取得済みかどうかを返す
 * @param {number} id
 * @returns {boolean}
 */
function isStampCollected(id) {
  return getCollectedStamps().includes(Number(id));
}

/**
 * スタンプを取得済みとして保存する（重複は無視）
 * @param {number} id
 * @returns {boolean} 新たに追加された場合 true、既に取得済みだった場合 false
 */
function collectStamp(id) {
  const collected = getCollectedStamps();
  const numId = Number(id);
  if (collected.includes(numId)) return false;
  collected.push(numId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collected));
  return true;
}

/**
 * 全スタンプをリセットする（デバッグ用）
 */
function resetAllStamps() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * 全スタンプ取得済みかどうかを返す
 * @returns {boolean}
 */
function isComplete() {
  return getCollectedStamps().length >= TOTAL_STAMPS;
}

/**
 * URLクエリパラメータから stamp id を取得する
 * @returns {number|null}
 */
function getStampIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return null;
  const num = Number(id);
  if (!Number.isInteger(num) || num < 1 || num > TOTAL_STAMPS) return null;
  return num;
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
    return `
      <div class="stamp-card ${done ? 'collected' : 'locked'}">
        <div class="stamp-icon" style="background:${done ? stamp.color : '#ccc'}">
          ${done ? stamp.emoji : '?'}
        </div>
        <div class="stamp-info">
          <p class="stamp-name">${stamp.name}</p>
          <p class="stamp-sub">${done ? stamp.subtitle : '未取得'}</p>
        </div>
        ${done ? `<a class="btn-ar" href="ar.html?id=${stamp.id}">ARで見る</a>` : ''}
      </div>
    `;
  }).join('');

  // 進捗バーを更新
  const count = collected.length;
  const progress = document.getElementById('progress-count');
  const bar = document.getElementById('progress-bar');
  if (progress) progress.textContent = `${count} / ${TOTAL_STAMPS}`;
  if (bar) bar.style.width = `${(count / TOTAL_STAMPS) * 100}%`;

  // 全取得時のコンプリートバナー
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
  const errorEl = document.getElementById('stamp-error');
  const contentEl = document.getElementById('stamp-content');

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
  const subEl = document.getElementById('stamp-subtitle');
  const descEl = document.getElementById('stamp-description');
  const iconEl = document.getElementById('stamp-icon');
  const arBtn = document.getElementById('btn-view-ar');

  if (nameEl) nameEl.textContent = stamp.name;
  if (subEl) subEl.textContent = stamp.subtitle;
  if (descEl) descEl.textContent = stamp.description;
  if (iconEl) {
    iconEl.textContent = stamp.emoji;
    iconEl.style.background = stamp.color;
  }
  if (arBtn) arBtn.href = `ar.html?id=${stamp.id}`;

  const isNew = collectStamp(id);
  const statusEl = document.getElementById('stamp-status');

  if (isNew) {
    if (statusEl) {
      statusEl.textContent = 'スタンプをゲット！';
      statusEl.classList.add('new');
    }
    if (contentEl) contentEl.classList.add('animate-in');
  } else {
    if (statusEl) {
      statusEl.textContent = '取得済み';
      statusEl.classList.add('already');
    }
  }

  if (contentEl) contentEl.classList.remove('hidden');

  // コンプリートチェック
  if (isComplete()) {
    const completeBanner = document.getElementById('complete-banner');
    if (completeBanner) completeBanner.classList.remove('hidden');
  }
}

/**
 * ar.html 用: ARシーンにモデルをセットする
 */
function setupARScene() {
  const id = getStampIdFromURL();
  const errorEl = document.getElementById('ar-error');

  if (!id) {
    if (errorEl) errorEl.classList.remove('hidden');
    return;
  }

  const stamp = getStampById(id);
  if (!stamp) {
    if (errorEl) errorEl.classList.remove('hidden');
    return;
  }

  // 未取得チェック
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
    modelEl.setAttribute('scale', stamp.modelScale);
    modelEl.setAttribute('position', stamp.modelPosition);
    modelEl.setAttribute('rotation', stamp.modelRotation);
  }

  const titleEl = document.getElementById('ar-title');
  if (titleEl) titleEl.textContent = `${stamp.emoji} ${stamp.name}`;
}
