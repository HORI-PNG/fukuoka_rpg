// ★追加： HTMLの読み込み完了を待つ
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
    const BALL_SPAWN_INTERVAL = 1000;
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
    let keys = { ArrowLeft: false, ArrowRight: false }; // 上下キーは不要
    let ballSpawnTimer;

    // --- (キー入力処理は下の方に移動) ---

    function spawnBall() {
        if (!gameInProgress) return;
        
        balls.push({
            x: Math.random() * (canvas.width - BALL_RADIUS * 2) + BALL_RADIUS,
            y: -BALL_RADIUS,
            radius: BALL_RADIUS,
            color: 'white',
            speed: BALL_SPEED + Math.random() * 2
        });
    }

    function gameLoop() {
        if (!gameInProgress) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // キャッチャーの移動
        if (keys.ArrowLeft && catcher.x > 0) {
            catcher.x -= CATCHER_SPEED;
        }
        if (keys.ArrowRight && catcher.x + catcher.width < canvas.width) {
            catcher.x += CATCHER_SPEED;
        }

        ctx.fillStyle = catcher.color;
        ctx.fillRect(catcher.x, catcher.y, catcher.width, catcher.height);

        // ボールの移動と描画
        for (let i = balls.length - 1; i >= 0; i--) {
            const ball = balls[i];
            ball.y += ball.speed;

            ctx.fillStyle = ball.color;
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();

            // 当たり判定
            if (
                ball.x > catcher.x &&
                ball.x < catcher.x + catcher.width &&
                ball.y + ball.radius > catcher.y &&
                ball.y - ball.radius < catcher.y + catcher.height
            ) {
                balls.splice(i, 1);
                score++;
                scoreElement.textContent = score;
                
                if (score >= CLEAR_SCORE) {
                    gameClear();
                }
            } 
            else if (ball.y - ball.radius > canvas.height) {
                balls.splice(i, 1);
            }
        }

        requestAnimationFrame(gameLoop);
    }

    function gameClear() {
        gameInProgress = false;
        clearInterval(ballSpawnTimer);
        resultArea.style.display = 'block';
    }

    // --- ★ここから修正 (キー入力と仮想コントローラの処理) ---

    // PCのキーボード入力
    document.addEventListener('keydown', (e) => {
        if (e.key in keys) keys[e.key] = true;
    });
    document.addEventListener('keyup', (e) => {
        if (e.key in keys) keys[e.key] = false;
    });

    // 仮想コントローラーのボタンとキーのマッピング
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
    // --- ★ここまで修正 ---

    backButton.addEventListener('click', () => {
        window.location.href = '../../index.html?reward=ホームラン記念ボール&success=true';
    });

    ballSpawnTimer = setInterval(spawnBall, BALL_SPAWN_INTERVAL);
    gameLoop();

}); // ★追加： DOMContentLoaded の閉じカッコ