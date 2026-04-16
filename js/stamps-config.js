/**
 * スタンプラリー設定ファイル
 *
 * image: assets/ に置く画像ファイル（PNG/JPG）
 *        未配置の場合は emoji がフォールバック表示される。
 *
 * 画像ファイルの対応:
 *   assets/character1.png ← image_23.png（シャークバイト）
 *   assets/character2.png ← image_19.png（ナマズちゃん）
 *   assets/character3.png ← image_20.png（リアルシャークバイト）
 *   assets/character4.png ← image_21.png（ミツワちゃん）
 *   assets/character5.png ← image_22.png（トチコちゃん）
 */

const STAMPS_CONFIG = [
  {
    id: 1,
    name: 'シャークバイト',
    subtitle: '帽子のサメをゲット！',
    description: '緑ストライプの帽子と蝶ネクタイがトレードマーク！海の伝説のサメキャラクター！',
    image: 'assets/character1.png',
    color: '#1565C0',
    emoji: '🦈',
  },
  {
    id: 2,
    name: 'ナマズちゃん',
    subtitle: '幸運のナマズをゲット！',
    description: '大きな巾着袋を大事そうに持つ、愛らしいナマズキャラクター！会えると幸運が訪れる！',
    image: 'assets/character2.png',
    color: '#283593',
    emoji: '🐟',
  },
  {
    id: 3,
    name: 'リアルシャークバイト',
    subtitle: 'リアルサメをゲット！',
    description: '超リアルな迫力サメ！伝説のシャークバイトがリアル版で登場！',
    image: 'assets/character3.png',
    color: '#0D47A1',
    emoji: '🦈',
  },
  {
    id: 4,
    name: 'ミツワちゃん',
    subtitle: 'ミツワちゃんをゲット！',
    description: 'ミツワ通り共栄会の公式キャラクター！商店街の守り神・巫女スタイルがかわいい！',
    image: 'assets/character4.png',
    color: '#B71C1C',
    emoji: '⛩️',
  },
  {
    id: 5,
    name: 'トチコちゃん',
    subtitle: 'トチコちゃんをゲット！',
    description: 'バケツを持ったほんわかかわいいトチコちゃん！全スタンプ制覇の証！',
    image: 'assets/character5.png',
    color: '#E65100',
    emoji: '👧',
  },
];

function getStampById(id) {
  return STAMPS_CONFIG.find((s) => s.id === Number(id)) || null;
}
