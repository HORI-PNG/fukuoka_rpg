export const spots = [
    {
        name: '太宰府天満宮',
        type: 'quiz',
        x: 350,
        y: 760,
        width: 100,
        height: 100,
        url: 'https://www.dazaifutenmangu.or.jp/',
        reward: '梅ヶ枝餅'
    },
    {
        name: '門司港レトロ',
        type: 'minigame', // typeを'minigame'に変更
        x: 650,
        y: 100,
        width: 100,
        height: 100,
        url: './games/mojiko/index.html', // 門司港のゲームURLを追加
        reward: '焼きカレー'
    },
    {
        name: '福岡タワー',
        type: 'quiz',
        x: 400,
        y: 400,
        width: 50,
        height: 100,
        url: 'https://www.fukuokatower.co.jp/',
        reward: '明太子'
    },
    {
        name: 'PayPayドーム',
        type: 'quiz',
        x: 720, // 左からの位置
        y: 400, // 上からの位置
        width: 100,
        height: 100,
        url: 'https://example.com/', // テスト用のURL
        reward: 'デバッグ成功！'
    },
    {
        name: 'キャナルシティ博多',
        type: 'quiz',
        x: 500,
        y: 300,
        width: 50,
        height: 50,
        url: 'https://canalcity.co.jp/',
        reward: 'もつ鍋'
    },
    {
        name: 'テストエリア',
        type: 'quiz',
        x: 10, // 左からの位置
        y: 490, // 上からの位置
        width: 100,
        height: 100,
        url: 'https://example.com/', // テスト用のURL
        reward: 'デバッグ成功！'
    },
    {
        name: '中州屋台',
        type: 'minigame', // タイプを'minigame'に変更（'quiz'のままでも動作します）
        x: 540,
        y: 500,
        width: 100,
        height: 100,
        url: './games/yatai_shooting/index.html', 
        reward: 'ラーメン' // 
    },
];