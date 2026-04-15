/**
 * スタンプラリー設定ファイル
 *
 * image: assets/characters/ に置く画像ファイル（PNG/JPG）
 *        未配置の場合は emoji がフォールバック表示される。
 *
 * 画像ファイルの対応:
 *   character1.png ← image_23.png（サメ）
 *   character2.png ← image_19.png（ナマズ）
 *   character3.png ← image_20.png（リアルなサメ）
 *   character4.png ← image_21.png（巫女さん）
 *   character5.png ← image_22.png（女の子）
 */

const STAMPS_CONFIG = [
  {
    id: 1,
    name: 'サメのスポット',
    subtitle: '帽子のサメをゲット！',
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
    name: 'ナマズのスポット',
    subtitle: '幸運のナマズをゲット！',
    description: '大きな巾着袋を大事そうに持つ、愛らしいナマズキャラクター！会えると幸運が訪れる！',
    model: 'assets/models/character2.glb',
    image: 'assets/characters/character2.png',
    color: '#283593',
    emoji: '🐟',
    placeholder: {
      shape: 'a-sphere',
      color: '#283593',
      scale: '0.4 0.4 0.4',
      position: '0 0.35 0',
      label: '球体(ナマズ仮)',
    },
  },
  {
    id: 3,
    name: 'リアルサメのスポット',
    subtitle: '3Dリアルサメをゲット！',
    description: '超リアルな3Dレンダリング！リアル版の帽子サメが迫力満点で登場！',
    model: 'assets/models/character3.glb',
    image: 'assets/characters/character3.png',
    color: '#0D47A1',
    emoji: '🏆',
    placeholder: {
      shape: 'a-cylinder',
      color: '#0D47A1',
      scale: '0.3 0.5 0.3',
      position: '0 0.35 0',
      label: '円柱(リアルサメ仮)',
    },
  },
  {
    id: 4,
    name: '巫女さんのスポット',
    subtitle: 'ミツワちゃんをゲット！',
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
    name: '女の子のスポット',
    subtitle: 'かわいい女の子をゲット！',
    description: 'バケツを持ったほんわかかわいい女の子キャラクター！全スタンプ制覇の証！',
    model: 'assets/models/character5.glb',
    image: 'assets/characters/character5.png',
    color: '#E65100',
    emoji: '👧',
    placeholder: {
      shape: 'a-torus',
      color: '#E65100',
      scale: '0.35 0.35 0.35',
      position: '0 0.35 0',
      label: 'トーラス(女の子仮)',
    },
  },
];

function getStampById(id) {
  return STAMPS_CONFIG.find((s) => s.id === Number(id)) || null;
}
