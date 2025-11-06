document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const successCountElem = document.getElementById('success-count');
    const resultArea = document.querySelector('.result-area');
    const backButton = document.getElementById('back-to-map');

    const LANE_WIDTH = canvas.width / 3; // 100
    const PLAYER_WIDTH = 50;
    const PLAYER_HEIGHT = 50;
    const OBSTACLE_HEIGHT = 20;
    const OBSTACLE_SPEED = 7;
    const SUCCESS_GOAL = 5;

    let playerLane = 1; // 0:左, 1:中央, 2:右
    let player = {
        x: LANE_WIDTH + (LANE_WIDTH - PLAYER_WIDTH) / 2, // 初期位置は中央
        y: canvas.height - PLAYER_HEIGHT - 20,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        color: 'blue'
    };

    let obstacles = []; // {x, y, width, height, color}
    let successCount = 0;
    let gameInProgress = true;
    let keys = { ArrowLeft: false, ArrowRight: false };
    let canMove = true; // キー入力のクールダウン用

    // --- キー入力処理 ---
    document.addEventListener('keydown', (e) => {
        if (!gameInProgress || !canMove) return;

        if (e.key === 'ArrowLeft') {
            if (playerLane > 0) {
                playerLane--;
                canMove = false;
            }
        } else if (e.key === 'ArrowRight') {
            if (playerLane < 2) {
                playerLane++;
                canMove = false;
            }
        }
        
        // プレイヤーのX座標をレーンに合わせて更新
        player.x = (LANE_WIDTH * playerLane) + (LANE_WIDTH - PLAYER_WIDTH) / 2;

        // すぐに連続入力できないようにする
        setTimeout(() => { canMove = true; }, 150);
    });

    // --- 障害物の生成 ---
    function spawnObstacle() {
        if (!gameInProgress) return;

        // 3つのレーンのうち、1つだけ安全なレーンを決める
        const safeLane = Math.floor(Math.random() * 3);

        for (let i = 0; i < 3; i++) {
            if (i !== safeLane) {
                // 障害物レーン
                obstacles.push({
                    x: LANE_WIDTH * i,
                    y: -OBSTACLE_HEIGHT,
                    width: LANE_WIDTH,
                    height: OBSTACLE_HEIGHT,
                    color: 'red'
                });
            }
        }
        successCount++;
        successCountElem.textContent = successCount;
    }

    // --- 更新と描画 ---
    function gameLoop() {
        if (!gameInProgress) return;

        // 画面クリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // レーンの境界線（デバッグ用）
        // ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        // ctx.beginPath();
        // ctx.moveTo(LANE_WIDTH, 0);
        // ctx.lineTo(LANE_WIDTH, canvas.height);
        // ctx.moveTo(LANE_WIDTH * 2, 0);
        // ctx.lineTo(LANE_WIDTH * 2, canvas.height);
        // ctx.stroke();

        // 障害物の移動と描画
        let passedObstacle = false;
        for (let i = obstacles.length - 1; i >= 0; i--) {
            const obs = obstacles[i];
            obs.y += OBSTACLE_SPEED;

            // 描画
            ctx.fillStyle = obs.color;
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

            // 当たり判定
            if (
                player.x < obs.x + obs.width &&
                player.x + player.width > obs.x &&
                player.y < obs.y + obs.height &&
                player.y + player.height > obs.y
            ) {
                // ゲームオーバー
                gameInProgress = false;
                alert('障害物（橋）にぶつかった！やり直し！');
                window.location.reload();
                return;
            }

            // 画面外（下）に出たら削除
            if (obs.y > canvas.height) {
                obstacles.splice(i, 1);
                passedObstacle = true;
            }
        }

        // 障害物を5回避けたらクリア
        if (successCount > SUCCESS_GOAL) {
            gameInProgress = false;
            resultArea.style.display = 'block';
            return;
        }
        
        // 障害物が画面下を通過し、障害物がなくなったら次の障害物を生成
        if (passedObstacle && obstacles.length === 0) {
            spawnObstacle();
        }

        // プレイヤー（舟）の描画
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);

        requestAnimationFrame(gameLoop);
    }

    // マップに戻るボタンの処理
    backButton.addEventListener('click', () => {
        window.location.href = '../../index.html?reward=うなぎのせいろ蒸し&success=true';
    });

    const controlMapping = {
        'btn-left': 'ArrowLeft',
        'btn-right': 'ArrowRight'
    };

    for (const [buttonId, key] of Object.entries(controlMapping)) {
        const button = document.getElementById(buttonId);
        if (button) {
            // 柳川ゲームはキーを押した瞬間に移動するロジック (keydown) を使う
            button.addEventListener('pointerdown', (e) => {
                e.preventDefault(); 

                if (!gameInProgress || !canMove) return;

                if (key === 'ArrowLeft') {
                    if (playerLane > 0) {
                        playerLane--;
                        canMove = false;
                    }
                } else if (key === 'ArrowRight') {
                    if (playerLane < 2) {
                        playerLane++;
                        canMove = false;
                    }
                }

                player.x = (LANE_WIDTH * playerLane) + (LANE_WIDTH - PLAYER_WIDTH) / 2;
                setTimeout(() => { canMove = true; }, 150);
            });
        }
    }

    // --- ゲーム開始 ---
    spawnObstacle(); // 最初の障害物を生成
    gameLoop();
});