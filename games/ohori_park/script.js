const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const resultArea = document.querySelector('.result-area');
const backButton = document.getElementById('back-to-map');

const PLAYER_SIZE = 25;
const GOAL_HEIGHT = 30;
const ENEMY_COUNT = 6;
const ENEMY_SIZE = 20;

// プレイヤー（スワンボート）
let player = {
    x: canvas.width / 2 - PLAYER_SIZE / 2,
    y: canvas.height - PLAYER_SIZE - 20,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    color: 'white',
    vx: 0, // X方向の速度
    vy: 0, // Y方向の速度
    speed: 0.5, // 加速力
    friction: 0.96 // 摩擦（慣性）
};

// スタート地点
const startPoint = {
    x: canvas.width / 2 - PLAYER_SIZE / 2,
    y: canvas.height - PLAYER_SIZE - 20
};

// ゴール
const goal = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: GOAL_HEIGHT,
    color: 'green'
};

// カモ（敵）
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

// カモの初期化
function createEnemies() {
    enemies = []; // 配列をリセット
    for (let i = 0; i < ENEMY_COUNT; i++) {
        enemies.push({
            x: Math.random() * (canvas.width - ENEMY_SIZE),
            y: GOAL_HEIGHT + 40 + Math.random() * (canvas.height - GOAL_HEIGHT - 150), // プレイヤーとゴールエリアを避ける
            width: ENEMY_SIZE,
            height: ENEMY_SIZE,
            color: 'red',
            speed: (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random() * 1.5) // 移動スピードと方向
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

    // カモを描画
    ctx.fillStyle = 'red';
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

// カモを動かす
function moveEnemies() {
    enemies.forEach(enemy => {
        enemy.x += enemy.speed;
        // 壁で跳ね返る
        if (enemy.x + enemy.width > canvas.width || enemy.x < 0) {
            enemy.speed *= -1;
        }
    });
}

// プレイヤーの操作と移動
function movePlayer() {
    // キー入力で加速
    if (keys.ArrowUp) player.vy -= player.speed;
    if (keys.ArrowDown) player.vy += player.speed;
    if (keys.ArrowLeft) player.vx -= player.speed;
    if (keys.ArrowRight) player.vx += player.speed;

    // 摩擦を適用
    player.vx *= player.friction;
    player.vy *= player.friction;

    // 速度を位置に反映
    player.x += player.vx;
    player.y += player.vy;

    // 画面端の壁判定
    if (player.x < 0) {
        player.x = 0;
        player.vx = 0;
    }
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
        player.vx = 0;
    }
    if (player.y < 0) {
        player.y = 0;
        player.vy = 0;
    }
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.vy = 0;
    }
}

// 当たり判定
function checkCollision() {
    // 1. カモとの当たり判定
    for (const enemy of enemies) {
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            // 当たった！
            alert('カモにぶつかった！スタートからやり直し。');
            resetPlayer();
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

// プレイヤーをスタート地点に戻す
function resetPlayer() {
    player.x = startPoint.x;
    player.y = startPoint.y;
    player.vx = 0;
    player.vy = 0;
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
    window.location.href = '../../index.html?reward=大濠公園まんじゅう&success=true';
});

// ゲーム開始
createEnemies();
gameLoop();