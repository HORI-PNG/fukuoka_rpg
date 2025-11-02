const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const resultArea = document.querySelector('.result-area');
const backButton = document.getElementById('back-to-map');

const PLAYER_SIZE = 20;
const GOAL_HEIGHT = 30;
const ENEMY_COUNT = 8;
const ENEMY_SIZE = 25;
const PLAYER_SPEED = 4;

// プレイヤー
let player = {
    x: canvas.width / 2 - PLAYER_SIZE / 2,
    y: canvas.height - PLAYER_SIZE - 10,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    color: 'blue'
};

// ゴール（改札）
const goal = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: GOAL_HEIGHT,
    color: 'green'
};

// 人混み（敵）
let enemies = [];

// キー入力の状態
let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// ゲームの状態
let gameInProgress = true;

// 人混みの初期化
function createEnemies() {
    enemies = []; // 配列をリセット
    for (let i = 0; i < ENEMY_COUNT; i++) {
        enemies.push({
            x: Math.random() * (canvas.width - ENEMY_SIZE),
            y: GOAL_HEIGHT + 20 + Math.random() * (canvas.height - GOAL_HEIGHT - 100), // プレイヤーとゴールエリアを避ける
            width: ENEMY_SIZE,
            height: ENEMY_SIZE,
            color: 'red',
            speed: 1 + Math.random() * 2 // 移動スピードをランダムに
        });
    }
}

// 描画関数
function draw() {
    // 画面クリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ゴールを描画
    ctx.fillStyle = goal.color;
    ctx.fillRect(goal.x, goal.y, goal.width, goal.height);

    // プレイヤーを描画
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // 人混みを描画
    ctx.fillStyle = 'red';
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

// 人混みを動かす
function moveEnemies() {
    enemies.forEach(enemy => {
        enemy.x += enemy.speed;
        // 壁で跳ね返る
        if (enemy.x + enemy.width > canvas.width || enemy.x < 0) {
            enemy.speed *= -1;
        }
    });
}

// プレイヤーを動かす
function movePlayer() {
    if (keys.ArrowUp && player.y > 0) {
        player.y -= PLAYER_SPEED;
    }
    if (keys.ArrowDown && player.y + player.height < canvas.height) {
        player.y += PLAYER_SPEED;
    }
    if (keys.ArrowLeft && player.x > 0) {
        player.x -= PLAYER_SPEED;
    }
    if (keys.ArrowRight && player.x + player.width < canvas.width) {
        player.x += PLAYER_SPEED;
    }
}

// 当たり判定
function checkCollision() {
    // 1. 人混みとの当たり判定
    for (const enemy of enemies) {
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            // 当たった！
            alert('人混みにぶつかった！最初からやり直し。');
            resetGame();
            return;
        }
    }

    // 2. ゴールとの当たり判定
    if (
        player.x < goal.x + goal.width &&
        player.x + player.width > goal.x &&
        player.y < goal.y + goal.height &&
        player.y + player.height > goal.y
    ) {
        // クリア！
        gameInProgress = false;
        resultArea.style.display = 'block';
    }
}

// ゲームをリセット（やり直し）
function resetGame() {
    player.x = canvas.width / 2 - PLAYER_SIZE / 2;
    player.y = canvas.height - PLAYER_SIZE - 10;
    createEnemies(); // 敵を再配置
}

// ゲームループ
function gameLoop() {
    if (!gameInProgress) return;

    movePlayer();
    moveEnemies();
    draw();
    checkCollision();

    requestAnimationFrame(gameLoop); // 毎フレームこの関数を呼び出す
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
    window.location.href = '../../index.html?reward=博多通りもん&success=true';
});

// ゲーム開始
createEnemies();
gameLoop();