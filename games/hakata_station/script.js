// ★追加： HTMLの読み込み完了を待つ
document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const resultArea = document.querySelector('.result-area');
    const backButton = document.getElementById('back-to-map');

    const PLAYER_SIZE = 20;
    const GOAL_HEIGHT = 30;
    const ENEMY_COUNT = 8;
    const ENEMY_SIZE = 25;
    const PLAYER_SPEED = 4;

    let player = {
        x: canvas.width / 2 - PLAYER_SIZE / 2,
        y: canvas.height - PLAYER_SIZE - 10,
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
        color: 'blue'
    };

    const goal = {
        x: 0,
        y: 0,
        width: canvas.width,
        height: GOAL_HEIGHT,
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
                x: Math.random() * (canvas.width - ENEMY_SIZE),
                y: GOAL_HEIGHT + 20 + Math.random() * (canvas.height - GOAL_HEIGHT - 100),
                width: ENEMY_SIZE,
                height: ENEMY_SIZE,
                color: 'red',
                speed: 1 + Math.random() * 2 
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
            enemy.x += enemy.speed;
            if (enemy.x + enemy.width > canvas.width || enemy.x < 0) {
                enemy.speed *= -1;
            }
        });
    }

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

    function checkCollision() {
        for (const enemy of enemies) {
            if (
                player.x < enemy.x + enemy.width &&
                player.x + player.width > enemy.x &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y
            ) {
                alert('人混みにぶつかった！最初からやり直し。');
                resetGame();
                return;
            }
        }
        if (
            player.x < goal.x + goal.width &&
            player.x + player.width > goal.x &&
            player.y < goal.y + goal.height &&
            player.y + player.height > goal.y
        ) {
            gameInProgress = false;
            resultArea.style.display = 'block';
        }
    }

    function resetGame() {
        player.x = canvas.width / 2 - PLAYER_SIZE / 2;
        player.y = canvas.height - PLAYER_SIZE - 10;
        
        // ★修正：キー入力もリセット
        keys.ArrowUp = false;
        keys.ArrowDown = false;
        keys.ArrowLeft = false;
        keys.ArrowRight = false;

        createEnemies();
    }

    function gameLoop() {
        if (!gameInProgress) return;
        movePlayer();
        moveEnemies();
        draw();
        checkCollision();
        requestAnimationFrame(gameLoop);
    }

    // --- (キー入力と仮想コントローラの処理) ---

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

    const controlMapping = {
        'btn-up': 'ArrowUp',
        'btn-down': 'ArrowDown',
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
    
    backButton.addEventListener('click', () => {
        window.location.href = '../../index.html?reward=博多通りもん&success=true';
    });

    createEnemies();
    gameLoop();

}); // ★追加： DOMContentLoaded の閉じカッコ