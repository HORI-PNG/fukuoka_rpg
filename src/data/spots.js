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
// ・二見ヶ浦の夫婦岩 1
// ・マリンワールド海の中道 1
export const spots = [
    {
        name: 'マリンワールド海の中道',
        type: 'minigame',
        x: 80,
        y: 260,
        width: 100,
        height: 100,
        url: './games/marine_world/index.html',
        reward: '海の仲間たちのキーホルダー',
        mobileFriendly: true // ギリギリ許容範囲
    },
    {
        name: '二見ヶ浦の夫婦岩',
        type: 'minigame',
        x: 110,
        y: 430,
        width: 100,
        height: 100,
        url: './games/futamigaura/index.html',
        reward: '縁結びのお守り',
        // SAOの問題にしたいので、true・falseは無し
    },
    {
        name: '柳川の川下り',
        type: 'minigame',
        x: 300,
        y: 400,
        width: 100,
        height: 100,
        url: './games/yanagawa_river/index.html',
        reward: 'うなぎのせいろ蒸し',
        mobileFriendly: false // 文字検索が出てくる
    },
    {
        name: '小倉城',
        type: 'minigame',
        x: 580,
        y: 180,
        width: 100,
        height: 100,
        url: './games/kokura_castle/index.html',
        reward: '小倉城の瓦',
        mobileFriendly: false // 画面拡大が頻繁に起きる
    },
    {
        name: '宗像大社',
        type: 'minigame',
        x: 610,
        y: 60,
        width: 100,
        height: 100,
        url: './games/munakata_adv/index.html',
        reward: '交通安全お守り',
        mobileFriendly: true
    },
    {
        name: '太宰府天満宮',
        type: 'minigame',
        x: 410,
        y: 440,
        width: 100,
        height: 100,
        url: './games/dazaifu_quest/index.html',
        reward: '梅ヶ枝餅',
        mobileFriendly: true
    },
    {
        name: '門司港',
        type: 'minigame',
        x: 100,
        y: 160,
        width: 180,
        height: 100,
        url: './games/mojiko/index.html', 
        reward: '焼きカレー',
        mobileFriendly: true
    },
    {
        name: '福岡タワー',
        type: 'minigame',
        x: 400,
        y: 180,
        width: 100,
        height: 150,
        url: './games/fukuoka_tower/index.html',
        reward: '明太子',
        mobileFriendly: true
    },
    {
        name: 'PayPayドーム',
        type: 'minigame',
        x: 520,
        y: 280,
        width: 100,
        height: 100,
        url: './games/paypay_dome/index.html', 
        reward: 'ホームラン記念ボール',
        mobileFriendly: false // 文字検索が出てくる
    },
    {
        name: 'キャナルシティ博多',
        type: 'minigame',
        x: 500,
        y: 360,
        width: 150,
        height: 50,
        url: './games/canalcity/index.html',
        reward: 'もつ鍋',
        mobileFriendly: true
    },
    {
        name: '中州屋台',
        type: 'minigame', 
        x: 560,
        y: 420,
        width: 150,
        height: 50,
        url: './games/nakasu/index.html', 
        reward: 'ラーメン', 
        mobileFriendly: true
    },
    {
        name: '大濠公園',
        type: 'minigame', 
        x: 250,
        y: 350,
        width: 100,
        height: 100,
        url: './games/ohori_park/index.html', 
        reward: '大濠公園まんじゅう', 
        mobileFriendly: true // 文字検索が出てくるけど、許容範囲
    },
    {
        name: '博多駅',
        type: 'minigame',
        x: 490,
        y: 120,
        width: 130,
        height: 70,
        url: './games/hakata_station/index.html', 
        reward: '博多通りもん',
        mobileFriendly: false // 文字検索が出てくる
    },
    {
        name: '河内藤園',
        type: 'minigame',
        x: 690,
        y: 250,
        width: 150,
        height: 100,
        url: './games/kawachi_fuji/index.html', 
        reward: '藤のしおり', 
        mobileFriendly: true
    },
    {
        name: '志摩サンセットロード（糸島）',
        type: 'minigame',
        x: 680,
        y: 150,
        width: 100,
        height: 100,
        url: './games/itoshima_drive/index.html', 
        reward: '貝殻', 
        mobileFriendly: true
    },
    {
        name: '皿倉山',
        type: 'minigame',
        x: 220,
        y: 90,
        width: 140,
        height: 100,
        url: './games/sarakurayama_puzzle/index.html', 
        reward: '100億ドルの夜景',
        mobileFriendly: true
    },
];