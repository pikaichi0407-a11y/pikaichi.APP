/**
 * スタンプラリー設定ファイル
 * 各スタンプのスポット名・説明・3Dモデルパスなどを定義する。
 * キャラクター名やスポット情報はここだけ変更すれば全体に反映される。
 */

const STAMPS_CONFIG = [
  {
    id: 1,
    name: 'スポット1',
    subtitle: '最初のスタンプ',
    description: 'ここでスタンプを集めてスタートしよう！',
    model: 'assets/models/character1.glb',
    modelScale: '0.5 0.5 0.5',      // AR表示時のスケール
    modelPosition: '0 0 0',          // AR表示時のオフセット
    modelRotation: '0 0 0',          // AR表示時の回転
    color: '#FF6B6B',                // UIアクセントカラー
    emoji: '🌟',
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
