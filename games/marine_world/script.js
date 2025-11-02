document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const resultArea = document.querySelector('.result-area');
    const backButton = document.getElementById('back-to-map');
    const scoreElement = document.getElementById('score');
    const timerElement = document.getElementById('timer');

    const GAME_TIME = 30; // 制限時間（秒）
    const CLEAR_SCORE = 15; // クリアに必要な撮影数
    const FISH_COUNT = 10; // 常に泳いでいる魚の数
    const RARE_FISH_CHANCE = 0.1; // 10%でレア魚

    let score = 0;
    let timeLeft = GAME_TIME;
    let gameInProgress = true;
    let fishes = []; // {x, y, radius, color, vx, vy}
    let gameTimer;

    // --- 魚の生成 ---
    function createFish() {
        const radius = 10 + Math.random() * 5;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = Math.random() * (canvas.height - radius * 2) + radius;
        const speed = 1 + Math.random();
        const angle = Math.random() * Math.PI * 2;
        
        let color = '#cccccc'; // 通常の魚（銀色）
        let vx = Math.cos(angle) * speed;
        let vy = Math.sin(angle) * speed;
        let isRare = false;

        if (Math.random() < RARE_FISH_CHANCE) {
            // レア魚
            color = '#ffd700'; // 金色
            vx *= 2.5; // 通常より速い
            vy *= 2.5;
            isRare = true;
        }

        fishes.push({ x, y, radius, color, vx, vy, isRare });
    }

    // --- 魚の移動と描画 ---
    function updateFishes() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        fishes.forEach(fish => {
            fish.x += fish.vx;
            fish.y += fish.vy;

            // 壁で反射
            if (fish.x - fish.radius < 0 || fish.x + fish.radius > canvas.width) {
                fish.vx *= -1;
            }
            if (fish.y - fish.radius < 0 || fish.y + fish.radius > canvas.height) {
                fish.vy *= -1;
            }

            // 描画
            ctx.beginPath();
            ctx.arc(fish.x, fish.y, fish.radius, 0, Math.PI * 2);
            ctx.fillStyle = fish.color;
            ctx.fill();
            ctx.closePath();
        });
    }

    // --- クリック（撮影）処理 ---
    canvas.addEventListener('click', (e) => {
        if (!gameInProgress) return;

        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // クリックが魚に当たったか判定
        for (let i = fishes.length - 1; i >= 0; i--) {
            const fish = fishes[i];
            const distance = Math.sqrt((clickX - fish.x) ** 2 + (clickY - fish.y) ** 2);
            
            if (distance < fish.radius) {
                // ヒット！
                fishes.splice(i, 1); // 撮影された魚を削除
                
                if (fish.isRare) {
                    score += 3; // レア魚は3点
                } else {
                    score += 1;
                }
                
                scoreElement.textContent = score;
                createFish(); // 新しい魚を追加
                return;
            }
        }
    });

    // --- ゲームループと時間 ---
    function gameLoop() {
        if (!gameInProgress) return;
        updateFishes();
        requestAnimationFrame(gameLoop);
    }

    function countdown() {
        if (!gameInProgress) return;
        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }

    // --- ゲーム終了処理 ---
    function endGame() {
        gameInProgress = false;
        clearInterval(gameTimer);

        if (score >= CLEAR_SCORE) {
            // クリア
            resultArea.style.display = 'block';
        } else {
            // 失敗
            alert('時間切れ！目標数に届かなかった...\nもう一度挑戦しよう！');
            window.location.reload();
        }
    }
    
    // マップに戻るボタン
    backButton.addEventListener('click', () => {
        window.location.href = '../../index.html?reward=海の仲間たちのキーホルダー&success=true';
    });

    // --- ゲーム開始 ---
    for (let i = 0; i < FISH_COUNT; i++) {
        createFish();
    }
    gameTimer = setInterval(countdown, 1000);
    gameLoop();
});