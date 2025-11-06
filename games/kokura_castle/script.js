document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const resultArea = document.querySelector('.result-area');
    const backButton = document.getElementById('back-to-map');
    const scoreElement = document.getElementById('score');
    const bgImage = new Image();
    bgImage.src = './小倉城.png'

    const PLAYER_WIDTH = 50;
    const PLAYER_HEIGHT = 30;
    const PLAYER_SPEED = 5;
    const BULLET_SPEED = 7;
    const ENEMY_SPEED = 1.5;
    const ENEMY_WIDTH = 30;
    const ENEMY_HEIGHT = 30;
    const ENEMY_SPAWN_INTERVAL = 1000; // 1秒ごとに敵が出現

    let player = {
        x: canvas.width / 2 - PLAYER_WIDTH / 2,
        y: canvas.height - PLAYER_HEIGHT - 10,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        color: 'blue'
    };

    let bullets = [];
    let enemies = [];
    let score = 0;
    let gameInProgress = true;
    let enemySpawnTimer;

    let keys = {
        ArrowLeft: false,
        ArrowRight: false
    };

    // --- 描画処理 ---
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 背景画像を描画
    if (bgImage.complete) { // 画像が読み込み完了していたら描画
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    }

        // プレイヤー（城）
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // 弾（矢）
        ctx.fillStyle = 'black';
        bullets.forEach(bullet => {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });

        // 敵
        ctx.fillStyle = 'red';
        enemies.forEach(enemy => {
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        });
    }

    // --- 更新処理 ---
    function update() {
        if (!gameInProgress) return;

        // プレイヤー移動
        if (keys.ArrowLeft && player.x > 0) {
            player.x -= PLAYER_SPEED;
        }
        if (keys.ArrowRight && player.x + player.width < canvas.width) {
            player.x += PLAYER_SPEED;
        }

        // 弾の移動
        for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].y -= BULLET_SPEED;
            if (bullets[i].y < 0) {
                bullets.splice(i, 1); // 画面外に出たら削除
            }
        }

        // 敵の移動
        for (let i = enemies.length - 1; i >= 0; i--) {
            enemies[i].y += ENEMY_SPEED;
            
            // 敵が城に到達（ゲームオーバー）
            if (enemies[i].y + enemies[i].height > player.y) {
                gameInProgress = false; // ループを停止させる
                clearInterval(enemySpawnTimer); // 敵の出現タイマーを止める
                
                alert('城が突破された！やり直し！');
                
                // アラートを閉じたらページをリロードして最初から
                window.location.reload(); 
                return;
            }

            // 弾と敵の当たり判定
            for (let j = bullets.length - 1; j >= 0; j--) {
                if (
                    bullets[j].x < enemies[i].x + enemies[i].width &&
                    bullets[j].x + bullets[j].width > enemies[i].x &&
                    bullets[j].y < enemies[i].y + enemies[i].height &&
                    bullets[j].y + bullets[j].height > enemies[i].y
                ) {
                    // ヒット！
                    enemies.splice(i, 1);
                    bullets.splice(j, 1);
                    score += 10;
                    scoreElement.textContent = score;
                    
                    // スコアが200に達したらクリア
                    if (score >= 200) {
                        gameClear();
                    }
                    break; // 敵が消えたので弾のループを抜ける
                }
            }
        }
    }

    // --- ゲームループ ---
    function gameLoop() {
        update();
        draw();
        if (gameInProgress) {
            requestAnimationFrame(gameLoop);
        }
    }

    // --- 敵の生成 ---
    function spawnEnemy() {
        if (!gameInProgress) return;
        enemies.push({
            x: Math.random() * (canvas.width - ENEMY_WIDTH),
            y: 0,
            width: ENEMY_WIDTH,
            height: ENEMY_HEIGHT
        });
    }

    // --- ゲームクリア ---
    function gameClear() {
        gameInProgress = false;
        clearInterval(enemySpawnTimer);
        resultArea.style.display = 'block';
    }

    // --- ゲームリセット ---
    function resetGame() {
        score = 0;
        scoreElement.textContent = score;
        bullets = [];
        enemies = [];
        player.x = canvas.width / 2 - PLAYER_WIDTH / 2;
        gameInProgress = true;
        gameLoop(); // ループを再開
    }

    // --- イベントリスナー ---
    document.addEventListener('keydown', (e) => {
        if (e.key in keys) keys[e.key] = true;
        
        // スペースキーで弾を発射
        if (e.key === ' ' && gameInProgress) {
            bullets.push({
                x: player.x + player.width / 2 - 2.5,
                y: player.y,
                width: 5,
                height: 10
            });
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key in keys) keys[e.key] = false;
    });

    // マップに戻るボタン
    backButton.addEventListener('click', () => {
        window.location.href = '../../index.html?reward=小倉城の瓦&success=true';
    });

    // 仮想コントローラーのボタンとキーのマッピング (左右)
    const controlMapping = {
        'btn-left': 'ArrowLeft',
        'btn-right': 'ArrowRight'
    };
    
    for (const [buttonId, key] of Object.entries(controlMapping)) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('pointerdown', (e) => {
                e.preventDefault(); 
                keys[key] = true;
            });
            button.addEventListener('pointerup', (e) => {
                e.preventDefault();
                keys[key] = false;
            });
            button.addEventListener('pointerleave', (e) => {
                keys[key] = false;
            });
        }
    }
    
    // 射撃ボタンの処理
    const fireButton = document.getElementById('btn-fire');
    if (fireButton) {
        fireButton.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            if (gameInProgress) {
                bullets.push({
                    x: player.x + player.width / 2 - 2.5,
                    y: player.y,
                    width: 5,
                    height: 10
                });
            }
        });
    }
    
    // --- ゲーム開始 ---
    enemySpawnTimer = setInterval(spawnEnemy, ENEMY_SPAWN_INTERVAL);
    gameLoop();
});