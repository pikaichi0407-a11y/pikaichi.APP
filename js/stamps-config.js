/**
 * スタンプラリー設定ファイル
 *
 * スポット番号 = id です。QRコードを現地に貼るときに取り違えないよう、
 * 必ず id とスポット番号を一致させたまま運用してください。
 *
 *   id:1 蚤の市通りの北     → シャークバイト
 *   id:2 蚤の市通りの南     → ナマズちゃん
 *   id:3 みずほ銀行奥       → リアルシャークバイト
 *   id:4 山車会館前広場     → フロッグちゃん
 *   id:5 流動（妖怪の背中） → トチコちゃん
 *
 * spot … 設置場所の名前（スタンプ帳に表示）
 * hint … まだ取っていない人に見せる道案内（謎解きではなく実用重視）
 * fx   … スタンプ獲得時の演出。5か所とも同じだと途中で飽きるため妖怪ごとに変える
 *        （light=光 / onibi=鬼火 / inazuma=稲妻 / hotaru=蛍 / kinpaku=金箔）
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
    spot: '蚤の市通りの北',
    hint: '蚤の市通りを北の端まで進め',
    fx: 'light',   // 明るく歓迎する最初の1体
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
    spot: '蚤の市通りの南',
    hint: '同じ通りを、今度は南のはずれまで',
    fx: 'hotaru',   // 静かで綺麗な蛍
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
    spot: 'みずほ銀行奥',
    hint: 'みずほ銀行の裏手、奥にひそむ',
    fx: 'inazuma',   // 一番行ってほしい場所のご褒美
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
    spot: '山車会館前広場',
    hint: '山車会館の前の広場を探せ',
    fx: 'onibi',   // 妖怪らしい鬼火
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
    spot: '会場のどこか（歩いています）',
    hint: '会場を歩く妖怪の背中を見よ',
    fx: 'kinpaku',   // 見つけにくい妖怪に金色のレア感
  },
];

function getStampById(id) {
  return STAMPS_CONFIG.find((s) => s.id === Number(id)) || null;
}
