/**
 * スタンプラリー設定ファイル
 *
 * 画像ファイルの対応（gh-pages / assets/ 直下）:
 *   assets/namazu-chan.png   → ナマズちゃん  (ID:2)
 *   assets/shark-bite.png   → シャークバイト (ID:1)
 *   assets/real-shark.png   → リアルシャークバイト (ID:3)
 *   assets/mitsuwa-chan.png → ミツワちゃん   (ID:4)
 *   assets/tochiko-chan.png → トチコちゃん   (ID:5)
 */

const STAMPS_CONFIG = [
  {
    id: 1,
    name: 'シャークバイト',
    subtitle: '帽子のサメをゲット！',
    description: '緑ストライプの帽子と蝶ネクタイがトレードマーク！海の伝説のサメキャラクター！',
    image: './assets/shark-bite.png?v=2',
    color: '#1565C0',
    emoji: '🦈',
  },
  {
    id: 2,
    name: 'ナマズちゃん',
    subtitle: '幸運のナマズをゲット！',
    description: '大きな巾着袋を大事そうに持つ、愛らしいナマズキャラクター！会えると幸運が訪れる！',
    image: './assets/namazu-chan.png?v=2',
    color: '#283593',
    emoji: '🐟',
  },
  {
    id: 3,
    name: 'リアルシャークバイト',
    subtitle: 'リアルサメをゲット！',
    description: '超リアルな迫力サメ！伝説のシャークバイトがリアル版で登場！',
    image: './assets/real-shark.png?v=2',
    color: '#0D47A1',
    emoji: '🦈',
  },
  {
    id: 4,
    name: 'ミツワちゃん',
    subtitle: 'ミツワちゃんをゲット！',
    description: 'ミツワ通り共栄会の公式キャラクター！商店街の守り神・巫女スタイルがかわいい！',
    image: './assets/mitsuwa-chan.png?v=2',
    color: '#B71C1C',
    emoji: '⛩️',
  },
  {
    id: 5,
    name: 'トチコちゃん',
    subtitle: 'トチコちゃんをゲット！',
    description: 'バケツを持ったほんわかかわいいトチコちゃん！全スタンプ制覇の証！',
    image: './assets/tochiko-chan.png?v=2',
    color: '#E65100',
    emoji: '👧',
  },
];

function getStampById(id) {
  return STAMPS_CONFIG.find((s) => s.id === Number(id)) || null;
}
