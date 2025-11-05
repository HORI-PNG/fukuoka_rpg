document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const resultArea = document.querySelector('.result-area');
    const backButton = document.getElementById('back-to-map');

    const CATCHER_WIDTH = 80;
    const CATCHER_HEIGHT = 20;
    const CATCHER_SPEED = 7;
    const BALL_RADIUS = 10;
    const BALL_SPEED = 3;
    const BALL_SPAWN_INTERVAL = 1000; // 1秒ごとにボール生成
    const CLEAR_SCORE = 10;

    let catcher = {
        x: canvas.width / 2 - CATCHER_WIDTH / 2,
        y: canvas.height - CATCHER_HEIGHT - 10,
        width: CATCHER_WIDTH,
        height: CATCHER_HEIGHT,
        color: 'blue'
    };

    let balls = [];
    let score = 0;
    let gameInProgress = true;
    let keys = { ArrowLeft: false, ArrowRight: false };
    let ballSpawnTimer;

    // --- キー入力処理 ---
    document.addEventListener('keydown', (e) => {
        if (e.key in keys) keys[e.key] = true;
    });
    document.addEventListener('keyup', (e) => {
        if (e.key in keys) keys[e.key] = false;
    });

    // --- ボールの生成 ---
    function spawnBall() {
        if (!gameInProgress) return;
        
        balls.push({
            x: Math.random() * (canvas.width - BALL_RADIUS * 2) + BALL_RADIUS,
            y: -BALL_RADIUS,
            radius: BALL_RADIUS,
            color: 'white',
            speed: BALL_SPEED + Math.random() * 2 // 速度を少しランダムに
        });
    }

    // --- 更新と描画 ---
    function gameLoop() {
        if (!gameInProgress) return;

        // 画面クリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // キャッチャーの移動
        if (keys.ArrowLeft && catcher.x > 0) {
            catcher.x -= CATCHER_SPEED;
        }
        if (keys.ArrowRight && catcher.x + catcher.width < canvas.width) {
            catcher.x += CATCHER_SPEED;
        }

        // キャッチャーの描画
        ctx.fillStyle = catcher.color;
        ctx.fillRect(catcher.x, catcher.y, catcher.width, catcher.height);

        // ボールの移動と描画
        for (let i = balls.length - 1; i >= 0; i--) {
            const ball = balls[i];
            ball.y += ball.speed;

            // ボールの描画
            ctx.fillStyle = ball.color;
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();

            // キャッチャーとの当たり判定
            if (
                ball.x > catcher.x &&
                ball.x < catcher.x + catcher.width &&
                ball.y + ball.radius > catcher.y &&
                ball.y - ball.radius < catcher.y + catcher.height
            ) {
                // キャッチ成功
                balls.splice(i, 1); // ボールを消す
                score++;
                scoreElement.textContent = score;
                
                // クリア判定
                if (score >= CLEAR_SCORE) {
                    gameClear();
                }
            } 
            // 画面外（下）に落ちた
            else if (ball.y - ball.radius > canvas.height) {
                balls.splice(i, 1);
                // (今回は失敗ペナルティなし)
            }
        }

        requestAnimationFrame(gameLoop);
    }

    // --- ゲームクリア処理 ---
    function gameClear() {
        gameInProgress = false;
        clearInterval(ballSpawnTimer); // ボールの生成を停止
        resultArea.style.display = 'block';
    }

    // マップに戻るボタンの処理
    backButton.addEventListener('click', () => {
        // spots.js の報酬名に合わせる
        window.location.href = '../../index.html?reward=ホームラン記念ボール&success=true';
    });

    // --- ゲーム開始 ---
    ballSpawnTimer = setInterval(spawnBall, BALL_SPAWN_INTERVAL);
    gameLoop();
});