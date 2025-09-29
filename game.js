const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// プレイヤーが所持しているアイテム
let PlayerItems = [];

// アイテムを画面に表示する関数
function displayItems() {
    const itemsDiv = document.getElementById('items');
    itemsDiv.innerHTML = ''; // 既存のアイテムをクリア
    PlayerItems.forEach(item => {
        const itemElement = document.createElement('div');
        // ★修正点1: 変数名を itemElement に修正
        itemElement.className = 'item';
        itemElement.textContent = item;
        itemsDiv.appendChild(itemElement);
    });
}

// ページ読み込み時にローカルストレージからアイテムを読み込む
function loadItems() {
    const savedItems = localStorage.getItem('playerItems');
    if (savedItems) {
        PlayerItems = JSON.parse(savedItems);
    }
    displayItems();
}

// 新しいアイテムを追加し、保存する関数を正しく定義
function addItem(itemName) {
    if (!PlayerItems.includes(itemName)) {
        PlayerItems.push(itemName);
        localStorage.setItem('playerItems', JSON.stringify(PlayerItems));
        displayItems();
        alert(`「${itemName}」を手に入れた！`);
    }
}

// URLパラメータをチェックして報酬を受け取る関数
function checkForReward() {
    const urlParams = new URLSearchParams(window.location.search);
    const reward = urlParams.get('reward');
    if (reward) {
        // ★修正点2: 正しいaddItem関数を呼び出す
        addItem(reward);
        // URLからクエリパラメータを削除
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// プレイヤーの情報
const player = {
    x: 400,
    y: 300,
    width: 32,
    height: 32,
    speed: 5
};

// 観光スポットの情報
const spots = [
    {
        name: '太宰府天満宮',
        x: 350,
        y: 450,
        width: 50,
        height: 50,
        url: 'https://www.dazaifutenmangu.or.jp/',
        reward: '梅ヶ枝餅'
    },
    {
        name: '門司港レトロ',
        x: 650,
        y: 100,
        width: 50,
        height: 50,
        url: 'https://example.com/mojiko-minigame',
        reward: '焼きカレー'
    }
];

// キー入力の状態を管理するオブジェクト
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// キーが押された時の処理
document.addEventListener('keydown', (e) => {
    if (e.key in keys) {
        keys[e.key] = true;
    }
});

// キーが離された時の処理
document.addEventListener('keyup', (e) => {
    if (e.key in keys) {
        keys[e.key] = false;
    }
});

// プレイヤーの位置を更新する関数
function updatePlayerPosition() {
    if (keys.ArrowUp && player.y > 0) player.y -= player.speed;
    if (keys.ArrowDown && player.y < canvas.height - player.height) player.y += player.speed;
    if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
    if (keys.ArrowRight && player.x < canvas.width - player.width) player.x += player.speed;
}

// 画面を描画する関数
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);

    spots.forEach(spot => {
        ctx.fillStyle = 'rgba(159, 221, 232, 0.5)'; // スポットの色を半透明の黄色に
        ctx.fillRect(spot.x, spot.y, spot.width, spot.height);
        ctx.fillStyle = 'black';
        ctx.font = '12px sans-serif';
        ctx.fillText(spot.name, spot.x, spot.y - 5);
    });

    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

// スポットとのあたり判定をチェックする関数
function checkSpotCollision() {
    spots.forEach(spot => {
        if (player.x < spot.x + spot.width &&
            player.x + player.width > spot.x &&
            player.y < spot.y + spot.height &&
            player.y + player.height > spot.y
        ) {
            if (!sessionStorage.getItem(`visited_${spot.name}`)) {
                if (confirm(`「${spot.name}」に到着！\nミニゲームに挑戦しますか？`)) {
                    sessionStorage.setItem(`visited_${spot.name}`, 'true');
                    window.location.href = spot.url;
                }
            }
        }
    });
}

// ゲームのメインループ
function gameLoop() {
    updatePlayerPosition();
    draw();
    checkSpotCollision();
    requestAnimationFrame(gameLoop);
}

// ページの読み込みが完了したときにアイテム関連の処理を実行
window.addEventListener('load', () => {
    loadItems();
    checkForReward();
});

const mapImage = new Image();
const playerImage = new Image();

let imagesLoaded = 0;
const totalImages = 2;

function onImageLoad() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        // 全ての画像が読み込まれたらゲームを開始
        gameLoop();
    }
}

mapImage.onload = onImageLoad;
playerImage.onload = onImageLoad;

mapImage.src = 'fukuoka_map_1.png';
playerImage.src = 'player_icon.png';