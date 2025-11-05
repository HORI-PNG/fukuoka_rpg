// ★追加： HTMLの読み込み完了を待つ
document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const resultArea = document.querySelector('.result-area');
    const backButton = document.getElementById('back-to-map');

    const PLAYER_SIZE = 25;
    const GOAL_WIDTH = 30;
    const ENEMY_COUNT = 6;
    const ENEMY_SIZE = 20;

    let player = {
        x: 20,
        y: canvas.height / 2 - PLAYER_SIZE / 2,
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
        color: 'white',
        vx: 0,
        vy: 0,
        speed: 0.2,
        friction: 0.98
    };

    const startPoint = {
        x: 20,
        y: canvas.height / 2 - PLAYER_SIZE / 2
    };

    const goal = {
        x: canvas.width - GOAL_WIDTH,
        y: 0,
        width: GOAL_WIDTH,
        height: canvas.height,
        color: 'green'
    };

    let enemies = [];

    let keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false
    };

    let gameInProgress = true;

    function createEnemies() {
        enemies = [];
        for (let i = 0; i < ENEMY_COUNT; i++) {
            enemies.push({
                x: GOAL_WIDTH + 50 + Math.random() * (canvas.width - GOAL_WIDTH - 150),
                y: Math.random() * (canvas.height - ENEMY_SIZE),
                width: ENEMY_SIZE,
                height: ENEMY_SIZE,
                color: 'red',
                speed: (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random() * 1)
            });
        }
    }

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

    function moveEnemies() {
        enemies.forEach(enemy => {
            enemy.y += enemy.speed;
            if (enemy.y + enemy.height > canvas.height || enemy.y < 0) {
                enemy.speed *= -1;
            }
        });
    }

    function movePlayer() {
        if (keys.ArrowUp) player.vy -= player.speed;
        if (keys.ArrowDown) player.vy += player.speed;
        if (keys.ArrowLeft) player.vx -= player.speed;
        if (keys.ArrowRight) player.vx += player.speed;

        player.vx *= player.friction;
        player.vy *= player.friction;

        player.x += player.vx;
        player.y += player.vy;

        if (player.x < 0) { player.x = 0; player.vx = 0; }
        if (player.x + player.width > canvas.width) { player.x = canvas.width - player.width; player.vx = 0; }
        if (player.y < 0) { player.y = 0; player.vy = 0; }
        if (player.y + player.height > canvas.height) { player.y = canvas.height - player.height; player.vy = 0; }
    }

    function checkCollision() {
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

        if (
            player.x + player.width > goal.x &&
            player.x < goal.x + goal.width &&
            player.y < goal.y + goal.height &&
            player.y + player.height > goal.y
        ) {
            gameInProgress = false;
            resultArea.style.display = 'block';
        }
    }

    function resetPlayer() {
        player.x = startPoint.x;
        player.y = startPoint.y;
        player.vx = 0;
        player.vy = 0;
        
        // キー入力もリセット
        keys.ArrowUp = false;
        keys.ArrowDown = false;
        keys.ArrowLeft = false;
        keys.ArrowRight = false;
    }

    function gameLoop() {
        if (!gameInProgress) return;
        movePlayer();
        moveEnemies();
        draw();
        checkCollision();
        requestAnimationFrame(gameLoop);
    }

    // --- ★ここから修正 (キー入力と仮想コントローラの処理) ---

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

    // 仮想コントローラーのボタンとキーのマッピング
    const controlMapping = {
        'btn-up': 'ArrowUp',
        'btn-down': 'ArrowDown',
        'btn-left': 'ArrowLeft',
        'btn-right': 'ArrowRight'
    };

    // 各ボタンにタッチイベント（pointerイベント）を割り当てる
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
        window.location.href = '../../index.html?reward=大濠公園まんじゅう&success=true';
    });

    createEnemies();
    gameLoop();

}); // ★追加： DOMContentLoaded の閉じカッコ