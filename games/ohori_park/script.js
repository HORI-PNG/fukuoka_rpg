document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const resultArea = document.querySelector('.result-area');
    const backButton = document.getElementById('back-to-map');

    const PLAYER_SIZE = 25;
    const GOAL_WIDTH = 30; 
    const ENEMY_COUNT = 15;
    const ENEMY_SIZE = 20;

    // プレイヤー（スワンボート）
    let player = {
        x: 20, // ★修正：スタート位置 (左端)
        y: canvas.height / 2 - PLAYER_SIZE / 2, // ★修正：スタート位置 (中央)
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
        color: 'white',
        vx: 0,
        vy: 0,
        speed: 0.2, // ★調整：加速力を落とす (速すぎるため 0.5 -> 0.2)
        friction: 0.98 // ★調整：摩擦を強める（慣性を減らす 0.96 -> 0.98)
    };

    // スタート地点
    const startPoint = {
        x: 20,
        y: canvas.height / 2 - PLAYER_SIZE / 2
    };

    // ゴール
    const goal = {
        x: canvas.width - GOAL_WIDTH, // ★修正：ゴール位置 (右端)
        y: 0,
        width: GOAL_WIDTH,
        height: canvas.height, // ★修正：ゴール位置 (右端全体)
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

    let gameInProgress = true;

    // カモの初期化 (★修正：上下に動くように変更)
    function createEnemies() {
        enemies = [];
        for (let i = 0; i < ENEMY_COUNT; i++) {
            enemies.push({
                x: GOAL_WIDTH + 50 + Math.random() * (canvas.width - GOAL_WIDTH - 150), // スタートとゴールを避ける
                y: Math.random() * (canvas.height - ENEMY_SIZE),
                width: ENEMY_SIZE,
                height: ENEMY_SIZE,
                color: 'red',
                speed: (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random() * 1) // ★調整：少し遅く
            });
        }
    }

    // 描画関数 (変更なし)
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = goal.color;
        ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
        ctx.fillStyle = 'red';
        enemies.forEach(enemy => {
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        });
    }

    // カモを動かす (★修正：上下移動)
    function moveEnemies() {
        enemies.forEach(enemy => {
            enemy.y += enemy.speed; // Y方向（上下）に動く
            // 壁で跳ね返る
            if (enemy.y + enemy.height > canvas.height || enemy.y < 0) {
                enemy.speed *= -1;
            }
        });
    }

    // プレイヤーの操作と移動 (★調整：壁判定を修正)
    function movePlayer() {
        if (keys.ArrowUp) player.vy -= player.speed;
        if (keys.ArrowDown) player.vy += player.speed;
        if (keys.ArrowLeft) player.vx -= player.speed;
        if (keys.ArrowRight) player.vx += player.speed;

        player.vx *= player.friction;
        player.vy *= player.friction;

        player.x += player.vx;
        player.y += player.vy;

        // 画面端の壁判定 (★修正)
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

    // 当たり判定 (ゴール判定を★修正)
    function checkCollision() {
        // 1. カモとの当たり判定
        for (const enemy of enemies) {
            if (
                player.x < enemy.x + enemy.width &&
                player.x + player.width > enemy.x &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y
            ) {
                alert('カモにぶつかった！スタートからやり直し。');
                resetPlayer();
                return;
            }
        }

        // 2. ゴールとの当たり判定 (★修正)
        if (
            player.x + player.width > goal.x && // プレイヤーの右端がゴールの左端を超えたら
            player.x < goal.x + goal.width &&
            player.y < goal.y + goal.height &&
            player.y + player.height > goal.y
        ) {
            gameInProgress = false;
            resultArea.style.display = 'block';
        }
    }

    // プレイヤーをスタート地点に戻す (★修正)
    function resetPlayer() {
        player.x = startPoint.x;
        player.y = startPoint.y;
        player.vx = 0;
        player.vy = 0;
        keys.ArrowUp = false;
        keys.ArrowDown = false;
        keys.ArrowLeft = false;
        keys.ArrowRight = false;
    }

    // ゲームループ (変更なし)
    function gameLoop() {
        if (!gameInProgress) return;
        movePlayer();
        moveEnemies();
        draw();
        checkCollision();
        requestAnimationFrame(gameLoop);
    }

    // キー入力イベントリスナー (変更なし)
    document.addEventListener('keydown', (e) => {
        if (e.key in keys) keys[e.key] = true;
    });
    document.addEventListener('keyup', (e) => {
        if (e.key in keys) keys[e.key] = false;
    });

    // マップに戻るボタンの処理 (変更なし)
    backButton.addEventListener('click', () => {
        window.location.href = '../../index.html?reward=大濠公園まんじゅう&success=true';
    });

    // ゲーム開始
    createEnemies();
    gameLoop();
});