/**
 * スタンプラリー設定ファイル
 *
 * 画像ファイルの対応（gh-pages / assets/ 直下）:
 *   assets/shark-bite.PNG   → シャークバイト  (ID:1)
 *   assets/namazu-chan.PNG  → ナマズちゃん    (ID:2)
 *   assets/real-shark.PNG  → リアルシャークバイト (ID:3)
 *   assets/mitsuwa-chan.PNG → ミツワちゃん    (ID:4)
 *   assets/tochiko-chan.PNG  → トチコちゃん  (ID:5)
 */

const STAMPS_CONFIG = [
  {
    id: 1,
    name: 'シャークバイト',
    subtitle: '帽子のサメをゲット！',
    description: '緑ストライプの帽子と蝶ネクタイがトレードマーク！海の伝説のサメキャラクター！',
    image: './assets/shark-bite.PNG?v=4',
    color: '#1565C0',
    emoji: '🦈',
    speech: 'ガブッ！とスタンプGETだぜ！',
  },
  {
    id: 2,
    name: 'ナマズちゃん',
    subtitle: '幸運のナマズをゲット！',
    description: '大きな巾着袋を大事そうに持つ、愛らしいナマズキャラクター！会えると幸運が訪れる！',
    image: './assets/namazu-chan.PNG?v=4',
    color: '#283593',
    emoji: '🐟',
    speech: '幸運を呼んじゃうよ！',
  },
  {
    id: 3,
    name: 'リアルシャークバイト',
    subtitle: 'リアルサメをゲット！',
    description: '超リアルな迫力サメ！伝説のシャークバイトがリアル版で登場！',
    image: './assets/real-shark.PNG?v=4',
    color: '#0D47A1',
    emoji: '🦈',
    speech: '本気のサメの力、見せてやる！',
  },
  {
    id: 4,
    name: 'フロッグちゃん',
    subtitle: 'フロッグちゃんをゲット！',
    description: 'FROG\'S GARDENのマスコットキャラクター！スタンプ帳を持ったかわいいカエルちゃん！',
    image: './assets/frogs-garden.PNG?v=1',
    color: '#2E7D32',
    emoji: '🐸',
    speech: 'ようこそ、とちぎ蚤の市へ！',
  },
  {
    id: 5,
    name: 'トチコちゃん',
    subtitle: 'トチコちゃんをゲット！',
    description: 'バケツを持ったほんわかかわいいトチコちゃん！全スタンプ制覇の証！',
    image: './assets/tochiko-chan.PNG?v=4',
    color: '#E65100',
    emoji: '👧',
    speech: '一緒に栃木を盛り上げよう！',
  },
];

function getStampById(id) {
  return STAMPS_CONFIG.find((s) => s.id === Number(id)) || null;
}
