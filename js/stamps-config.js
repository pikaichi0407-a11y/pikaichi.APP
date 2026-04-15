/**
 * スタンプラリー設定ファイル
 * 各スタンプのスポット名・説明・キャラクター画像パスなどを定義する。
 *
 * image: assets/characters/ に置くキャラクター画像（PNG/JPG/WebP）
 *        未配置の場合は emoji がフォールバックとして表示される。
 */

const STAMPS_CONFIG = [
  {
    id: 1,
    name: 'サメのスポット',
    subtitle: '海の王者・帽子サメをゲット！',
    description: '緑ストライプの帽子と蝶ネクタイがトレードマーク！海の伝説のサメキャラクター！',
    model: 'assets/models/character1.glb',
    image: 'assets/characters/character1.png',
    color: '#1565C0',
    emoji: '🦈',
    placeholder: {
      shape: 'a-cone',
      color: '#1565C0',
      scale: '0.3 0.5 0.15',
      position: '0 0.35 0',
      label: 'サメのヒレ(仮)',
    },
  },
  {
    id: 2,
    name: 'イルカのスポット',
    subtitle: '海の使者・イルカをゲット！',
    description: '巾着袋を大切に持つ、かわいい青いイルカキャラクター！',
    model: 'assets/models/character2.glb',
    image: 'assets/characters/character2.png',
    color: '#01579B',
    emoji: '🐬',
    placeholder: {
      shape: 'a-sphere',
      color: '#01579B',
      scale: '0.35 0.35 0.35',
      position: '0 0.35 0',
      label: '球体(イルカ仮)',
    },
  },
  {
    id: 3,
    name: 'おてだまのスポット',
    subtitle: 'ほっこりキャラをゲット！',
    description: 'バケツを持ったほんわかかわいいキャラクター。会うと幸せになれる！',
    model: 'assets/models/character3.glb',
    image: 'assets/characters/character3.png',
    color: '#F57F17',
    emoji: '🎎',
    placeholder: {
      shape: 'a-cylinder',
      color: '#F57F17',
      scale: '0.25 0.55 0.25',
      position: '0 0.35 0',
      label: '円柱(人形仮)',
    },
  },
  {
    id: 4,
    name: 'ミツワちゃんスポット',
    subtitle: '商店街の看板娘をゲット！',
    description: 'ミツワ通り共栄会の公式キャラクター！商店街の守り神・巫女スタイルがかわいい！',
    model: 'assets/models/character4.glb',
    image: 'assets/characters/character4.png',
    color: '#B71C1C',
    emoji: '⛩️',
    placeholder: {
      shape: 'a-cone',
      color: '#B71C1C',
      scale: '0.4 0.6 0.4',
      position: '0 0.35 0',
      label: 'コーン(巫女仮)',
    },
  },
  {
    id: 5,
    name: 'レジェンドサメスポット',
    subtitle: '伝説のレアキャラをゲット！',
    description: '全スタンプ制覇おめでとう！リアルで迫力満点の伝説サメキャラクター！',
    model: 'assets/models/character5.glb',
    image: 'assets/characters/character5.png',
    color: '#0D47A1',
    emoji: '🏆',
    placeholder: {
      shape: 'a-torus',
      color: '#0D47A1',
      scale: '0.35 0.35 0.35',
      position: '0 0.35 0',
      label: 'トーラス(レアサメ仮)',
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
