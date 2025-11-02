const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const resultArea = document.querySelector('.result-area');
const backButton = document.getElementById('back-to-map');

const GAME_WIDTH = gameContainer.offsetWidth;
const GAME_HEIGHT = gameContainer.offsetHeight;
const PLAYER_WIDTH = player.offsetWidth;
const PLAYER_SPEED = 10;
const OBSTACLE_SPEED = 5;
const OBSTACLE_INTERVAL = 1000; // 1秒ごとに障害物を生成

let playerX = player.offsetLeft;
let keys = {
    ArrowLeft: false,
    ArrowRight: false
};

let gameInProgress = true;
let obstacles = [];
let obstacleTimer;
let gameTimer;

// プレイヤーの移動
function movePlayer() {
    if (keys.ArrowLeft && playerX > 0) {
        playerX -= PLAYER_SPEED;
    }
    if (keys.ArrowRight && playerX + PLAYER_WIDTH < GAME_WIDTH) {
        playerX += PLAYER_SPEED;
    }
    player.style.left = playerX + 'px';
}

// 障害物を生成
function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.className = 'obstacle';
    obstacle.style.left = Math.random() * (GAME_WIDTH - 40) + 'px'; // ランダムなX位置
    gameContainer.appendChild(obstacle);
    obstacles.push(obstacle);
}

// 障害物を移動
function moveObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        let obstacleY = obstacle.offsetTop + OBSTACLE_SPEED;

        if (obstacleY > GAME_HEIGHT) {
            // 画面外に出たら削除
            obstacle.remove();
            obstacles.splice(i, 1);
        } else {
            obstacle.style.top = obstacleY + 'px';
            // 当たり判定
            checkCollision(obstacle);
        }
    }
}

// 当たり判定
function checkCollision(obstacle) {
    const playerRect = player.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    if (
        playerRect.left < obstacleRect.right &&
        playerRect.right > obstacleRect.left &&
        playerRect.top < obstacleRect.bottom &&
        playerRect.bottom > obstacleRect.top
    ) {
        // 当たった！
        alert('クラッシュ！もう一度！');
        resetGame();
    }
}

// ゲームをリセット（やり直し）
function resetGame() {
    // 既存の障害物をすべて削除
    obstacles.forEach(obstacle => obstacle.remove());
    obstacles = [];
    
    // プレイヤー位置をリセット
    playerX = 130;
    player.style.left = playerX + 'px';
}

// ゲームクリア処理
function gameClear() {
    gameInProgress = false;
    clearInterval(obstacleTimer); // 障害物の生成を停止
    clearTimeout(gameTimer);     // ゲームタイマーを停止
    resultArea.style.display = 'block';
}

// ゲームループ
function gameLoop() {
    if (!gameInProgress) return;

    movePlayer();
    moveObstacles();

    requestAnimationFrame(gameLoop);
}

// キー入力イベントリスナー
document.addEventListener('keydown', (e) => {
    if (e.key in keys) {
        keys[e.key] = true;
    }
});
document.addEventListener('keyup', (e) => {
    if (e.key in keys) {
        keys[e.key] = false;
    }
});

// マップに戻るボタンの処理
backButton.addEventListener('click', () => {
    // ★重要：報酬と成功フラグを付けてマップ画面に戻る
    window.location.href = '../../index.html?reward=おしゃれな貝殻&success=true';
});

// ゲーム開始
gameLoop();
obstacleTimer = setInterval(createObstacle, OBSTACLE_INTERVAL);

// 20秒間走り切ったらクリア
gameTimer = setTimeout(gameClear, 20000);