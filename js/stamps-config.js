/**
 * スタンプラリー設定ファイル
 *
 * スポット番号 = id です。QRコードを現地に貼るときに取り違えないよう、
 * 必ず id とスポット番号を一致させたまま運用してください。
 *
 *   id:1 蚤の市通りの北     → 烏天狗
 *   id:2 蚤の市通りの南     → 土蜘蛛
 *   id:3 みずほ銀行奥       → 青鬼
 *   id:4 山車会館前広場     → 百目
 *   id:5 流動（妖怪の背中） → 河童
 *
 * spot  … 設置場所の名前（スタンプ帳に表示）
 * hint  … まだ取っていない人に見せる道案内（謎解きではなく実用重視）
 * fx    … 獲得時の演出。5か所とも同じだと途中で飽きるため妖怪ごとに変える
 *         （light=光 / onibi=鬼火 / inazuma=稲妻 / hotaru=蛍 / kinpaku=金箔）
 * emoji … 画像が読み込めなかったときの代わりに表示する
 * color … 演出の光やボタンに使う色
 */

const STAMPS_CONFIG = [
  {
    id: 1,
    name: '烏天狗',
    subtitle: '烏天狗をゲット！',
    description: '山から下りてきた笛の名手。翼をたたんで、今日は静かに一曲。',
    image: './assets/tengu.webp',
    color: '#2C5AA0',
    emoji: '👺',
    speech: 'よう来たな。笛の音が聞こえたか',
    spot: '蚤の市通りの北',
    hint: '蚤の市通りを北の端まで進め',
    fx: 'light',      // 最初の1体。明るく歓迎する
  },
  {
    id: 2,
    name: '土蜘蛛',
    subtitle: '土蜘蛛をゲット！',
    description: '八本の脚で太鼓を抱える古い妖怪。打ち鳴らす音で夜を知らせる。',
    image: './assets/tsuchigumo.webp',
    color: '#8B6FB0',
    emoji: '🕷️',
    speech: 'わしの太鼓、聞いていくかい',
    spot: '蚤の市通りの南',
    hint: '同じ通りを、今度は南のはずれまで',
    fx: 'onibi',      // 妖しい雰囲気に合わせて鬼火
  },
  {
    id: 3,
    name: '青鬼',
    subtitle: '青鬼をゲット！',
    description: '十千木でいちばん大きな妖怪。見た目は怖いが、根はやさしい。',
    image: './assets/aooni.webp',
    color: '#C0442A',
    emoji: '👹',
    speech: 'おう、よう見つけたな！',
    spot: 'みずほ銀行奥',
    hint: 'みずほ銀行の裏手、奥にひそむ',
    fx: 'inazuma',    // 一番行ってほしい場所なので、一番派手な演出
  },
  {
    id: 4,
    name: '百目',
    subtitle: '百目をゲット！',
    description: '数えきれない目で祭りを見物する陽気な妖怪。踊り出すと止まらない。',
    image: './assets/hyakume.webp',
    color: '#5E8C3A',
    emoji: '👁️',
    speech: 'どの目で見ても、お前さんが見えるわい',
    spot: '山車会館前広場',
    hint: '山車会館の前の広場を探せ',
    fx: 'hotaru',     // 広場でのんびり。やわらかい蛍
  },
  {
    id: 5,
    name: '河童',
    subtitle: '河童をゲット！',
    description: '皿の水をこぼさぬよう、のんびり歩く。きゅうりを持たせると喜ぶ。',
    image: './assets/kappa.webp',
    color: '#2F7D62',
    emoji: '🥒',
    speech: 'きゅうり…食うか？',
    spot: '会場のどこか（歩いています）',
    hint: '会場を歩く妖怪の背中を見よ',
    fx: 'kinpaku',    // 見つけにくいので金箔でレア感
  },
];

function getStampById(id) {
  return STAMPS_CONFIG.find((s) => s.id === Number(id)) || null;
}
