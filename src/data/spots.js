// ・福岡タワー 1
// ・博多駅 1
// ・大濠公園 1
// ・paypayドーム 1
// ・太宰府天満宮 1
// ・中州屋台 1
// ・河内藤園 1
// ・志摩サンセットロード（糸島）1
// ・門司港 1
// ・皿倉山 1
// ・宗像大社 1
// ・小倉城 1
// ・柳川の川下り 1
// ・糸島 1
// ・二見ヶ浦の夫婦岩 1
// ・マリンワールド海の中道 1
export const spots = [
    {
        name: 'マリンワールド海の中道',
        type: 'minigame',
        x: 400,
        y: 200,
        width: 100,
        height: 100,
        url: './games/marine_world/index.html',
        reward: '海の仲間たちのキーホルダー'
    },
    {
        name: '二見ヶ浦の夫婦岩',
        type: 'minigame',
        x: 650,
        y: 100,
        width: 100,
        height: 300,
        url: './games/futamigaura/index.html',
        reward: '縁結びのお守り'
    },
    {
        name: '糸島',
        type: 'minigame',
        x: 250,
        y: 250,
        width: 100,
        height: 100,
        url: './games/itoshima_craft/index.html',
        reward: '手作りブレスレット'
    },
    {
        name: '柳川の川下り',
        type: 'minigame',
        x: 120,
        y: 500,
        width: 100,
        height: 100,
        url: './games/yanagawa_river/index.html',
        reward: 'うなぎのせいろ蒸し'
    },
    {
        name: '小倉城',
        type: 'minigame',
        x: 600,
        y: 200,
        width: 100,
        height: 100,
        url: './games/kokura_castle/index.html',
        reward: '小倉城の瓦'
    },
    {
        name: '宗像大社',
        type: 'minigame',
        x: 530,
        y: 100,
        width: 100,
        height: 100,
        url: './games/munakata_adv/index.html',
        reward: '交通安全お守り'
    },
    {
        name: '太宰府天満宮',
        type: 'minigame',
        x: 350,
        y: 600,
        width: 100,
        height: 100,
        url: './games/dazaifu_quest/index.html',
        reward: '梅ヶ枝餅'
    },
    {
        name: '門司港',
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
        type: 'minigame',
        x: 400,
        y: 400,
        width: 50,
        height: 100,
        url: './games/fukuoka_tower/index.html',
        reward: '明太子'
    },
    {
        name: 'PayPayドーム',
        type: 'minigame',
        x: 720, // 左からの位置
        y: 400, // 上からの位置
        width: 100,
        height: 100,
        url: './games/paypay_dome/index.html', // テスト用のURL
        reward: 'ホームラン記念ボール'
    },
    {
        name: 'キャナルシティ博多',
        type: 'minigame',
        x: 500,
        y: 300,
        width: 50,
        height: 50,
        url: './game/canalcity/index.html',
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
    {
        name: '大濠公園',
        type: 'minigame', // タイプを'minigame'に変更（'quiz'のままでも動作します）
        x: 480,
        y: 430,
        width: 100,
        height: 100,
        url: './games/ohori_park/index.html', 
        reward: '大濠公園まんじゅう' // 
    },
    {
        name: '博多駅',
        type: 'minigame', // タイプを'minigame'に変更（'quiz'のままでも動作します）
        x: 700,
        y: 280,
        width: 100,
        height: 100,
        url: './games/hakata_station/index.html', 
        reward: '博多通りもん' // 
    },
    {
        name: '河内藤園',
        type: 'minigame', // タイプを'minigame'に変更（'quiz'のままでも動作します）
        x: 150,
        y: 600,
        width: 100,
        height: 100,
        url: './games/kawachi_fuji/index.html', 
        reward: '藤のしおり' // 
    },
    {
        name: '志摩サンセットロード（糸島）',
        type: 'minigame', // タイプを'minigame'に変更（'quiz'のままでも動作します）
        x: 200,
        y: 150,
        width: 150,
        height: 80,
        url: './games/itoshima_drive/index.html', 
        reward: '貝殻' // 
    },
    {
        name: '皿倉山',
        type: 'minigame', // タイプを'minigame'に変更（'quiz'のままでも動作します）
        x: 750,
        y: 100,
        width: 100,
        height: 100,
        url: './games/sarakurayama_puzzle/index.html', 
        reward: '100億ドルの夜景' // 
    },
];