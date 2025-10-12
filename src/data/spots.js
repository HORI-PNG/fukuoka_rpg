// 観光スポットのデータ
// 'export' することで、他のファイルからこの変数をインポートできるようになる
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
        type: 'quiz',
        x: 650,
        y: 100,
        width: 100,
        height: 100,
        url: 'https://example.com/mojiko-minigame',
        reward: '焼きカレー'
    },
    {
        name: '福岡タワー',
        type: 'quiz',
        x: 380,
        y: 340,
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
        url: './games/canalcity/index.html',
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
        type: 'quiz',
        x: 540, // 左からの位置
        y: 500, // 上からの位置
        width: 100,
        height: 100,
        url: 'https://example.com/', // テスト用のURL
        reward: 'デバッグ成功！'
    }
    
];