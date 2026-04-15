/**
 * スタンプラリー設定ファイル
 * 各スタンプのスポット名・説明・3Dモデルパスなどを定義する。
 * キャラクター名やスポット情報はここだけ変更すれば全体に反映される。
 *
 * ── モデルについて ──
 * model: Blenderで作った.glbファイルのパス。
 *        ファイルが存在しない場合は placeholder の形状が表示される。
 * placeholder: .glbが未準備のときにARに表示する仮の3D形状設定。
 */

const STAMPS_CONFIG = [
  {
    id: 1,
    name: 'スポット1',
    subtitle: '最初のスタンプ',
    description: 'ここでスタンプを集めてスタートしよう！',
    model: 'assets/models/character1.glb',
    modelScale: '0.5 0.5 0.5',
    modelPosition: '0 0 0',
    modelRotation: '0 0 0',
    color: '#FF6B6B',
    emoji: '🌟',
    // ── プレースホルダー（仮オブジェクト）設定 ──
    placeholder: {
      shape: 'a-box',           // A-Frame プリミティブタグ名
      color: '#FF6B6B',
      scale: '0.45 0.45 0.45',
      position: '0 0.3 0',
      label: '立方体',
    },
  },
  {
    id: 2,
    name: 'スポット2',
    subtitle: '2つ目のスタンプ',
    description: 'ここで不思議なキャラクターに出会える！',
    model: 'assets/models/character2.glb',
    modelScale: '0.5 0.5 0.5',
    modelPosition: '0 0 0',
    modelRotation: '0 0 0',
    color: '#4ECDC4',
    emoji: '🌊',
    placeholder: {
      shape: 'a-sphere',
      color: '#4ECDC4',
      scale: '0.35 0.35 0.35',
      position: '0 0.35 0',
      label: '球体',
    },
  },
  {
    id: 3,
    name: 'スポット3',
    subtitle: '3つ目のスタンプ',
    description: 'このキャラクターは特別な技を持っているよ！',
    model: 'assets/models/character3.glb',
    modelScale: '0.5 0.5 0.5',
    modelPosition: '0 0 0',
    modelRotation: '0 0 0',
    color: '#FFE66D',
    emoji: '⚡',
    placeholder: {
      shape: 'a-cone',
      color: '#FFE66D',
      scale: '0.4 0.6 0.4',
      position: '0 0.35 0',
      label: 'コーン',
    },
  },
  {
    id: 4,
    name: 'スポット4',
    subtitle: '4つ目のスタンプ',
    description: '森の奥深くに潜む神秘的な存在！',
    model: 'assets/models/character4.glb',
    modelScale: '0.5 0.5 0.5',
    modelPosition: '0 0 0',
    modelRotation: '0 0 0',
    color: '#A8E6CF',
    emoji: '🌿',
    placeholder: {
      shape: 'a-cylinder',
      color: '#A8E6CF',
      scale: '0.25 0.55 0.25',
      position: '0 0.35 0',
      label: '円柱',
    },
  },
  {
    id: 5,
    name: 'スポット5',
    subtitle: 'ラストスタンプ',
    description: '全スタンプ制覇おめでとう！最後の伝説のキャラクター！',
    model: 'assets/models/character5.glb',
    modelScale: '0.5 0.5 0.5',
    modelPosition: '0 0 0',
    modelRotation: '0 0 0',
    color: '#C9B1FF',
    emoji: '👑',
    placeholder: {
      shape: 'a-torus',
      color: '#C9B1FF',
      scale: '0.35 0.35 0.35',
      position: '0 0.35 0',
      label: 'トーラス',
    },
  },
];

/**
 * IDでスタンプ設定を取得する
 * @param {number} id - スタンプID (1〜5)
 * @returns {object|null}
 */
function getStampById(id) {
  return STAMPS_CONFIG.find((s) => s.id === Number(id)) || null;
}
